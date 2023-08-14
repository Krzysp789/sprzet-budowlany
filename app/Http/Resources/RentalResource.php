<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalResource extends JsonResource
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
            'customer_id' => $this->customer_id,
            'customer_first_name' => $this->customer->first_name,
            'customer_last_name' => $this->customer->last_name,
            'address_id' => $this->address_id,
            'address' => new AddressResource($this->whenLoaded('address')),
            'total_price' => $this->total_price,
            'date_rental' => $this->date_rental,
            'date_deadline' => $this->date_deadline,
            'date_return' => $this->date_return,
            'status' => $this->status,
            'delivery' => $this->delivery,
            'payment' => $this->payment,
            'paid' => $this->paid,
            'notes' => $this->notes,
            'items_count' => $this->whenCounted('items'),
            'items' => ItemResource::collection($this->whenLoaded('items'))
        ];
    }
}
