<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\ItemResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
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
            'category_id' => $this->category_id,
            'category_name' => $this->category->name,
            'name' => $this->name,
            'price' => $this->price,
            'description' => $this->description,
            'items_count' => $this->whenCounted('items'),
            'available_items_count' => $this->whenCounted('available_items_count'),
            'items' => ItemResource::collection($this->whenLoaded('items')),
            'img_url' => Storage::disk('imgEq')->url($this->img_url)
        ];
    }
}
