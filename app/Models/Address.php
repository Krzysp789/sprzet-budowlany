<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'street_number',
        'post_code',
        'town',
        'active',
        'customer_id'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }
}
