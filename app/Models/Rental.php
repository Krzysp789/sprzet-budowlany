<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'address_id',
        'total_price',
        'date_rental',
        'date_deadline',
        'date_return',
        'status',
        'delivery',
        'payment',
        'paid',
        'notes',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function items()
    {
        return $this->belongsToMany(Item::class)->withPivot('price');
    }
}
