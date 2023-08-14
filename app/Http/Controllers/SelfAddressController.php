<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\AddressRequest;
use App\Http\Resources\AddressCollection;
use App\Http\Resources\AddressResource;

class SelfAddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(new AddressCollection(
            Auth::user()->customer->load(['addresses'])->addresses
        ));
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $address = Auth::user()->customer->addresses->find($id);
        if (empty($address)) abort(404);

        return response()->json(new AddressResource($address));
    }

    /**
     * Display the specified resource.
     */
    public function showActive(): JsonResponse
    {
        $address = Auth::user()->customer->addresses->where('active', true)->first();
        if (empty($address)) abort(404);

        return response()->json(new AddressResource($address));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AddressRequest $request)
    {
        $activeAddresses = Address::where('customer_id', Auth::user()->customer->id)
            ->where('active', 1)->count();
        $address = Address::create($request->merge([
            'customer_id' => Auth::user()->customer->id,
            'active' => $activeAddresses > 0 ? 0 : 1
        ])->all());

        return response()->json([
            'message' => "Udało się dodać adres $address->street_number",
            'data' => $address,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AddressRequest $request, int $id)
    {
        $address = Auth::user()->customer->addresses->find($id);
        if (empty($address)) abort(404);
        $address->update($request->all());

        return response()->json([
            'message' => "Udało się zaktualizować adres $address->street_number",
            'data' => $address,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $address = Auth::user()->customer->addresses->find($id);
        if (empty($address)) abort(404);
        $address->delete();
        $activeAddresses = Address::where('customer_id', Auth::user()->customer->id)
            ->where('active', 1)->count();
        if ($activeAddresses < 1) {
            $addressActive = Address::where('customer_id', Auth::user()->customer->id)->first();
            if ($addressActive != null) $addressActive->update(['active' => 1]);
        }

        return response()->json([
            'message' => "Udało się usunąć adres $address->street_number"
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function setActive(Address $address): JsonResponse
    {
        $addresses = Auth::user()->customer->addresses;
        $address = Auth::user()->customer->addresses->find($address->id);
        if (empty($address)) abort(404);
        $addresses->each(function ($item) {
            $item->update(['active' => 0]);
        });
        $address->update(['active' => 1]);

        return response()->json(new AddressResource($address));
    }
}
