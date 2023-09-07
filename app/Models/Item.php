<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'serial_number',
        'status',
        'work_time',
        'equipment_id',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function rentals()
    {
        return $this->belongsToMany(Rental::class)
            ->withPivot('price');
    }
}
