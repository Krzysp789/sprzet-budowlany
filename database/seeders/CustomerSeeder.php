<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::factory()->count(50)->create()->each(function ($customer) {
            $address = Address::factory()->create([
                'customer_id' => $customer->id,
                'active' => true
            ]);
        });
    }
}
