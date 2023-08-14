<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory;
    // SoftDeletes;
    // CascadeSoftDeletes;

    // protected $cascadeDeletes = [
    //     'equipments'
    // ];

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
            // ->withTrashed()
            // ->orderBy('id')
            ->withPivot('price');
    }
}
