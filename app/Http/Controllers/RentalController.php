<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\RentalResource;
use App\Http\Resources\RentalCollection;
use App\Http\Requests\Rental\StoreRentalRequest;
use App\Http\Requests\Rental\UpdateRentalRequest;

class RentalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rentals = Rental::with('items.equipment', 'address')->withCount('items');

        if ($request->globalFilter != null) {
            $rentals = $rentals->whereHas('customer', function ($query) use ($request) {
                return $query->where('first_name', 'like', "%$request->globalFilter%")
                    ->orWhere('last_name', 'like', "%$request->globalFilter%");
            })->orWhere('status', 'like', "%$request->globalFilter%")
                ->orWhere('total_price', 'like', "%$request->globalFilter%")
                ->orWhere('date_rental', 'like', "%$request->globalFilter%")
                ->orWhere('delivery', 'like', "%$request->globalFilter%")
                ->orWhere('payment', 'like', "%$request->globalFilter%")
                ->orWhere('notes', 'like', "%$request->globalFilter%");
        }

        $rentals = $rentals->get();

        if ($request->sortField != null && $request->sortOrder != null) {
            $request->sortOrder == 1 ?
                $rentals = $rentals->sortBy($request->sortField) :
                $rentals = $rentals->sortByDesc($request->sortField);
        }

        $total = $rentals->count();

        if ($request->first != null && $request->rows != null) {
            $rentals = $rentals->skip($request->first)->take($request->rows)->values();
        }

        return response()->json(new RentalCollection($rentals, $total));
    }

    public function show(Rental $rental): JsonResponse
    {
        return response()->json(new RentalResource($rental->load('items.equipment', 'address')));
    }

    public function store(StoreRentalRequest $request): JsonResponse
    {
        $rental = DB::transaction(function () use ($request) {
            $rental = Rental::create($request->merge(['total_price' => 0])->all());
            Rental::calculateTotalPrice($rental);
            return $rental;
        });

        return response()->json([
            'message' => "Udało się dodać wypożyczenie #$rental->id.",
            'data' => $rental,
        ], 201);
    }

    public function update(UpdateRentalRequest $request, Rental $rental): JsonResponse
    {
        DB::transaction(function () use ($request, $rental) {
            $rental->update($request->all());
            Rental::calculateTotalPrice($rental);
        });

        return response()->json([
            'message' => "Udało się zaktualizować wypożyczenie #$rental->id.",
            'data' => $rental,
        ]);
    }

    public function destroy(Rental $rental): JsonResponse
    {
        $rental->items()->detach();
        $rental->delete();

        return response()->json([
            'message' => "Udało się usunąć wypożyczenie #$rental->id.",
            'data' => $rental,
        ]);
    }
}
