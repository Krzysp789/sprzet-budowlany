<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\Equipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\RentalEquipmentRequest;

class RentalEquipmentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(RentalEquipmentRequest $request, Rental $rental): JsonResponse
    {
        $rented = $rental->items->pluck('id');
        $items = Equipment::with(['items'])->find($request->equipment_id)->items
            ->where('status', 'dostępny')->whereNotIn('id', $rented)->values();

        DB::transaction(function () use ($request, $rental, $items) {
            for ($i = 0; $i < $request->quantity; $i++) {
                $rental->items()->attach($items[$i]->id, $request->pivot);
                $items[$i]->update(['status' => 2]);
            }
            Rental::calculateTotalPrice($rental);
        });

        return response()->json([
            'message' => "Udało się dodać $request->quantity sprzęty do wypożyczenia #$rental->id.",
            'data' => $rental,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rental $rental, Equipment $equipment): JsonResponse
    {
        $items = $rental->items()->where('equipment_id', $equipment->id)->get();
        if ($items->isEmpty()) abort(404);
        $items = $items->groupBy('equipment_id')->values()->first();

        DB::transaction(function () use ($rental, $items) {
            foreach ($items as $item) {
                $rental->items()->detach($item);
                $item->update(['status' => 1]);
            }
            Rental::calculateTotalPrice($rental);
        });

        return response()->json([
            'message' => "Udało się usunąć sprzęt z wypożyczenia #$rental->id.",
            'data' => $rental,
        ], 201);
    }
}
