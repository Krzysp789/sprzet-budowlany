<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rental extends Model
{
    use HasFactory;
    // SoftDeletes;

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

    public static function calculateTotalPrice(Rental $rental)
    {
        $sum = 0;
        $sum += $rental->items()->sum('price');

        $dateRental = Carbon::parse($rental->date_rental);
        $dateDeadline = Carbon::parse($rental->date_deadline);
        $sum *= $dateRental->diffInDays($dateDeadline) + 1;
        $sum += $rental->delivery == 2 || $rental->delivery ==  "dostawa_na_adres" ? 50 : 0;
        $sum += $rental->payment == 2 || $rental->payment ==  "przelew" ? 5 : 0;

        $rental->update(['total_price' => $sum]);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class); // ->withTrashed();
    }

    public function address()
    {
        return $this->belongsTo(Address::class); // ->withTrashed();
    }

    public function items()
    {
        return $this->belongsToMany(Item::class)->withPivot('price');
        // ->withTrashed()
        // ->orderBy('id')
    }
}
