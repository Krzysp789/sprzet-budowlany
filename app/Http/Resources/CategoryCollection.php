<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CategoryCollection extends ResourceCollection
{
    private $total;

    public function __construct($resource, $total)
    {
        parent::__construct($resource);

        $this->resource = $this->collectResource($resource);
        $this->total = $total;
    }

    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'total' => $this->total
        ];
    }
}
