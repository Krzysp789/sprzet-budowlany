<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\EquipmentRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\EquipmentResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\EquipmentCollection;

class EquipmentController extends Controller
{
    /**
     * Create the controller instance.
     */
    public function __construct()
    {
        $this->authorizeResource(Equipment::class, 'equipment');
    }

    public function index(Request $request): JsonResponse
    {
        $equipment = Equipment::with('items')->withCount([
            'items',
            'items as available_items_count' => function (Builder $query) {
                $query->where('status', 'dostępny');
            },
        ]);

        if ($request->globalFilter != null) {
            $equipment = $equipment->where('name', 'like', "%$request->globalFilter%")
                ->orWhereHas('category', function ($query) use ($request) {
                    return $query->where('name', 'like', "%$request->globalFilter%");
                })
                ->orWhere('price', 'like', "%$request->globalFilter%")
                ->orWhere('description', 'like', "%$request->globalFilter%");
        }

        $equipment = $equipment->get();

        if ($request->sortField != null && $request->sortOrder != null) {
            $request->sortOrder == 1 ?
                $equipment = $equipment->sortBy($request->sortField) :
                $equipment = $equipment->sortByDesc($request->sortField);
        }

        $total = $equipment->count();

        if ($request->first != null && $request->rows != null) {
            $equipment = $equipment->skip($request->first)->take($request->rows)->values();
        }

        $equipment->each(function ($equip) {
            if (!empty(Storage::disk('eqImg')->files($equip->id))) {
                $equip->image_url = Storage::disk('eqImg')
                    ->url(Storage::disk('eqImg')->files($equip->id)[0]);
            }
        });

        return response()->json(new EquipmentCollection($equipment, $total));
    }

    public function show(Equipment $equipment): JsonResponse
    {
        if (!empty(Storage::disk('eqImg')->files($equipment->id))) {
            $equipment->image_url = Storage::disk('eqImg')
                ->url(Storage::disk('eqImg')->files($equipment->id)[0]);
        }
        return response()->json(new EquipmentResource($equipment));
    }

    public function store(EquipmentRequest $request): JsonResponse
    {
        $equipment = Equipment::create($request->all());

        return response()->json([
            'message' => "Udało się dodać sprzęt $equipment->name.",
            'data' => $equipment,
        ], 201);
    }

    public function update(EquipmentRequest $request, Equipment $equipment): JsonResponse
    {
        $equipment->update($request->all());

        return response()->json([
            'message' => "Udało się zaktualizować sprzęt $equipment->name.",
            'data' => $equipment,
        ]);
    }

    public function destroy(Equipment $equipment): JsonResponse
    {
        foreach ($equipment->items as $item) {
            if (!$item->rentals->isEmpty()) {
                return response()->json([
                    'message' => "Nie można usuniąć sprzętu $equipment->name ponieważ ma przypisane wypożyczenia."
                ], 409);
            }
        }
        DB::transaction(function () use ($equipment) {
            foreach ($equipment->items as $item) {
                $item->delete();
            }
            $equipment->delete();
        });

        return response()->json([
            'message' => "Udało się usunąć sprzęt $equipment->name."
        ]);
    }

    public function updateImg(Request $request, Equipment $equipment): Response | JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|mimetypes:image/*|max:512',
        ], [
            'image.mimetypes' => 'Pole :attribute musi być grafiką'
        ], ['image' => 'obrazek']);

        if ($validator->fails()) {
            return response()->json([
                'header' => "Nie udało się zaktualizować obrazka sprzętu $equipment->name",
                'message' => implode(' ', $validator->errors()->all())
            ], 422);
        }

        foreach (Storage::disk('eqImg')->files($equipment->id) as $img) {
            Storage::delete("eqImg/$img");
        };

        Storage::putFile("eqImg/$equipment->id", $request->file('image'));

        return response()->json([
            'message' => "Udało się zakutualizować obrazek sprzętu $equipment->name."
        ]);
    }

    public function search(Request $request): Response
    {
        $equipment = Equipment::where($request->attr, $request->val)->get();

        return $equipment->isEmpty() ? response(false) : response(true);
    }
}
