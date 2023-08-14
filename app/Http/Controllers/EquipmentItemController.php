<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\ItemResource;
use App\Http\Resources\ItemCollection;
use App\Http\Requests\EquipmentItemRequest;

class EquipmentItemController extends Controller
{
    /**
     * Create the controller instance.
     */
    public function __construct()
    {
        $this->authorizeResource(Equipment::class, 'equipment');
    }

    public function index(Equipment $equipment): JsonResponse
    {
        return response()->json(new ItemCollection($equipment->items));
    }

    public function show(Equipment $equipment, Item $item): JsonResponse
    {
        $item = $equipment->items->find($item->id);
        if (empty($item)) abort(404);

        return response()->json(new ItemResource($item));
    }

    public function store(EquipmentItemRequest $request, Equipment $equipment): JsonResponse
    {
        $item = Item::create($request->merge([
            'equipment_id' => $equipment->id
        ])->all());

        return response()->json([
            'message' => "Udało się dodać przedmiot $item->serial_number.",
            'data' => $item,
        ], 201);
    }

    public function update(EquipmentItemRequest $request, Equipment $equipment, Item $item): JsonResponse
    {
        $item = $equipment->items->find($item->id);
        if (empty($item)) abort(404);
        $item->update($request->all());

        return response()->json([
            'message' => "Udało się zaktualizować przedmiot $item->serial_number.",
            'data' => $item,
        ]);
    }

    public function destroy(Equipment $equipment, Item $item): Response | JsonResponse
    {
        $item = $equipment->items->find($item->id);
        if (empty($item)) abort(404);
        if (!$item->rentals->isEmpty()) {
            return response()->json([
                'message' => "Nie można usuniąć przedmiotu $item->serial_number ponieważ ma przypisane wypożyczenia."
            ], 409);
        }
        $item->delete();

        return response()->json([
            'message' => "Udało się usunąć przedmiot $item->serial_number."
        ]);
    }

    public function search(Request $request, Equipment $equipment): Response
    {
        $item = $equipment->items->where($request->attr, $request->val);

        return $item->isEmpty() ? response(false) : response(true);
    }
}
