<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\Category;
use App\Enums\RentStatus;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreRentRequest;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\EquipmentCollection;
use App\Http\Resources\RentalEquipmentResource;
use Illuminate\Database\Eloquent\Builder;

class SelfRentController extends Controller
{
    public function offerIndex(Request $request): JsonResponse
    {
        $offer = Equipment::withCount([
            'items as available_items_count' => function (Builder $query) {
                $query->where('status', 'dostępny');
            },
        ]);
        if ($request->cat != null) {
            $offer = $offer->where('category_id', $request->cat);
        }

        $offer = $offer->get();

        if ($request->sort != null) {
            $order = 'asc';
            $sort = $request->sort;
            if (substr($sort, 0, 1) == '!') {
                $order = 'desc';
                $sort = substr($sort, 1);
            }
            $offer = $offer->sortBy([[$sort, $order]])->values();
        }
        return response()->json(new EquipmentCollection($offer, $offer->count()));
    }
    public function offerShow(Equipment $equipment): JsonResponse
    {
        $offer = Equipment::withCount([
            'items as available_items_count' => function (Builder $query) {
                $query->where('status', 'dostępny');
            },
        ])->findOrFail($equipment->id);
        return response()->json(new EquipmentResource($offer));
    }

    public function selfCategories(): JsonResponse
    {
        $categories = Category::all()->map(function ($item) {
            return collect([
                'label' => $item->name,
                'value' => $item->id
            ]);
        });
        return response()->json($categories);
    }

    public function customerRents(): JsonResponse
    {
        $rentals = Auth::user()->customer->rentals;
        foreach ($rentals as $rental) {
            $rental->equipment = $rental->items->groupBy('equipment_id')->map(function ($item, $key) {
                return collect(Equipment::find($key))->merge([
                    'quantity' => $item->count(),
                    'items' => $item
                ]);
            })->values();
        }
        return response()->json(RentalEquipmentResource::collection($rentals->load('address')));
    }

    public function storeRent(StoreRentRequest $request): JsonResponse
    {
        foreach ($request->equipment as $equip) {
            $itemsAvaible = Equipment::withCount([
                'items' => function (Builder $query) {
                    $query->where('status', 'dostępny');
                }
            ])->find($equip['id']);
            if ($equip['quantity'] > $itemsAvaible->items_count) {
                return response()->json([
                    'message' => 'Nie ma wystarczającej ilości sprzętu'
                ], 422);
            }
        }

        $rental = DB::transaction(function () use ($request) {
            $rental = Rental::create($request->merge([
                'customer_id' => Auth::user()->customer->id,
                'status' => RentStatus::oczekujący->value,
                'total_price' => 0,
                'date_rental' => $request->dateRental,
                'date_deadline' => $request->dateDeadline,
                'paid' => 0,
            ])->all());

            foreach ($request->equipment as $equip) {
                $items = Equipment::with(['items'])->find($equip['id'])->items
                    ->where('status', 'dostępny')->values();
                for ($i = 0; $i < $equip['quantity']; $i++) {
                    $rental->items()->attach($items[$i]->id, ['price' => $equip['price']]);
                    $items[$i]->update(['status' => 2]);
                }
            }
            Rental::calculateTotalPrice($rental);
            return $rental;
        });

        return response()->json([
            'message' => 'Wypożyczenie przekazano do realizacji',
            'data' => $rental->load('items.equipment')
        ]);
    }
}
