<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;
    // SoftDeletes;
    // CascadeSoftDeletes;

    // protected $cascadeDeletes = [
    //     'equipments'
    // ];

    protected $fillable = [
        'name',
    ];

    public function equipment()
    {
        return $this->hasMany(Equipment::class);
    }

    // public function scopeWithInactive(Builder $query): Builder
    // {
    //     return $query->withTrashed();
    // }
}
