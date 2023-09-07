<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Events\CalculateRental;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ItemResource;
use App\Http\Resources\ItemCollection;
use App\Http\Requests\RentalItem\StoreRentalItemRequest;
use App\Http\Requests\RentalItem\UpdateRentalItemRequest;

class RentalItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Rental $rental): JsonResponse
    {
        return response()->json(new ItemCollection($rental->items->load('equipment')));
    }

    /**
     * Display the specified resource.
     */
    public function show(Rental $rental, Item $item): JsonResponse
    {
        $item = $rental->load('items.equipment')->items->find($item->id);
        if (empty($item)) abort(404);

        return response()->json(new ItemResource($item->load('rentals')));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRentalItemRequest $request, Rental $rental): JsonResponse
    {
        $item = Item::findOrFail($request->item_id);
        DB::transaction(function () use ($request, $rental, $item) {
            $rental->items()->attach($request->item_id, $request->pivot);
            $item->update(['status' => 2]);
            CalculateRental::dispatch($rental);
        });

        return response()->json([
            'message' => "Udało się dodać przedmiot $item->serial_number do wypożyczenia #$rental->id.",
            'data' => $rental,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRentalItemRequest $request, Rental $rental, Item $item): JsonResponse
    {
        $item = $rental->items()->findOrFail($item->id);
        DB::transaction(function () use ($request, $rental, $item) {
            $rental->items()->updateExistingPivot($item->id, $request->pivot);
            CalculateRental::dispatch($rental);
        });

        return response()->json([
            'message' => "Udało się zaktalizować przedmiot $item->serial_number w wypożyczeniu #$rental->id.",
            'data' => $rental,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rental $rental, Item $item): JsonResponse
    {
        DB::transaction(function () use ($rental, $item) {
            $rental->items()->detach($item->id);
            $item->update(['status' => 1]);
            CalculateRental::dispatch($rental);
        });

        return response()->json([
            'message' => "Udało się usunąć przedmiot $item->serial_number z wypożyczenia #$rental->id.",
            'data' => $rental,
        ]);
    }

    public function search(Request $request, Rental $rental): Response
    {
        $item = $rental->items()->find($request->val);

        return empty($item) ? response(false) : response(true);
    }
}
