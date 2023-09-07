<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $cascadeDeletes = [
        'rentals',
    ];

    protected $fillable = [
        'first_name',
        'last_name',
        'phone_no',
        'email',
        'notes',
    ];

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
