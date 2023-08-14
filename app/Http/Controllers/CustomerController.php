<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\CustomerRequest;
use App\Http\Resources\CustomerCollection;
use App\Http\Resources\CustomerResource;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $customers = Customer::with('addresses');

        if ($request->globalFilter != null) {
            $customers = $customers->where('first_name', 'like', "%$request->globalFilter%")
                ->orWhere('last_name', 'like', "%$request->globalFilter%")
                ->orWhere('phone_no', 'like', "%$request->globalFilter%")
                ->orWhere('email', 'like', "%$request->globalFilter%")
                ->orWhere('notes', 'like', "%$request->globalFilter%");
        }

        $customers = $customers->get();

        if ($request->sortField != null && $request->sortOrder != null) {
            $request->sortOrder == 1 ?
                $customers = $customers->sortBy($request->sortField) :
                $customers = $customers->sortByDesc($request->sortField);
        }

        $total = $customers->count();

        if ($request->first != null && $request->rows != null) {
            $customers = $customers->skip($request->first)->take($request->rows)->values();
        }

        return response()->json(new CustomerCollection($customers, $total));
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json(new CustomerResource($customer));
    }

    public function store(CustomerRequest $request): JsonResponse
    {
        $customer = Customer::create($request->all());

        return response()->json([
            'message' => "Udało się dodać klienta $customer->first_name $customer->last_name.",
            'data' => $customer
        ], 201);
    }

    public function update(CustomerRequest $request, Customer $customer): JsonResponse
    {
        $customer->update($request->all());

        return response()->json([
            'message' => "Udało się zaktualizować klienta $customer->first_name $customer->last_name.",
            'data' => $customer
        ]);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        if (!$customer->rentals->isEmpty()) {
            return response()->json([
                'message' => "Nie można usuniąć klienta $customer->first_name $customer->last_name ponieważ ma przypisane wypożyczenia."
            ], 409);
        }
        if (!empty($customer->user)) {
            return response()->json([
                'message' => "Nie można usuniąć klienta $customer->first_name $customer->last_name ponieważ ma przypisane konto."
            ], 409);
        }
        $customer->delete();

        return response()->json([
            'message' => "Udało się usunąć klienta $customer->first_name $customer->last_name."
        ]);
    }

    public function search(Request $request): Response
    {
        $customer = Customer::where($request->attr, $request->val)->get();

        return $customer->isEmpty() ? response(false) : response(true);
    }
}
