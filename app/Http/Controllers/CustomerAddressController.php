<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\AddressRequest;
use App\Http\Resources\AddressCollection;
use App\Http\Resources\AddressResource;

class CustomerAddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Customer $customer): JsonResponse
    {
        return response()->json(new AddressCollection($customer->addresses));
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer, Address $address): JsonResponse
    {
        $address = $customer->addresses->find($address->id);
        if (empty($address)) abort(404);

        return response()->json(new AddressResource($address));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AddressRequest $request, Customer $customer): JsonResponse
    {
        $activeAddresses = Address::where('customer_id', $customer->id)
            ->where('active', 1)->count();
        $address = Address::create($request->merge([
            'customer_id' => $customer->id,
            'active' => $activeAddresses > 0 ? 0 : 1
        ])->all());

        return response()->json([
            'message' => "Udało się dodać adres $address->street_number.",
            'data' => $address,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AddressRequest $request, Customer $customer, Address $address): JsonResponse
    {
        $address = $customer->addresses->find($address->id);
        if (empty($address)) abort(404);
        $address->update($request->all());

        return response()->json([
            'message' => "Udało się zaktualizować adres $address->street_number.",
            'data' => $address,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer, Address $address): JsonResponse
    {
        $address = $customer->addresses->find($address->id);
        if (empty($address)) abort(404);
        if (!$address->rentals->isEmpty()) {
            return response()->json([
                'message' => "Nie można usuniąć adresu ponieważ ma przypisane wypożyczenia."
            ], 409);
        }
        $address->delete();
        $activeAddresses = Address::where('customer_id', $customer->id)
            ->where('active', 1)->count();
        if ($activeAddresses < 1) {
            $addressActive = Address::where('customer_id', $customer->id)->first();
            if ($addressActive != null) $addressActive->update(['active' => 1]);
        }

        return response()->json([
            'message' => "Udało się usunąć adres $address->street_number."
        ]);
    }

    public function search(Request $request, Customer $customer): Response
    {
        $item = $customer->addresses->where($request->attr, $request->val);

        return $item->isEmpty() ? response(false) : response(true);
    }
}
