<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'serial_number' => $this->serial_number,
            'status' => $this->status,
            'work_time' => $this->work_time,
            'price' => $this->whenPivotLoaded('item_rental', function () {
                return $this->pivot->price;
            }),
            'equipment' => new EquipmentResource($this->whenLoaded('equipment')),
        ];
    }
}
