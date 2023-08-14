<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Rental;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RentalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Rental::factory()->count(50)->create()->each(function ($rental) {
            for ($i = 0; $i < rand(0, 3); ++$i) {
                $item = Item::with(['equipment'])->orderByRaw('RAND()')->first();
                DB::table('item_rental')->insert([
                    'rental_id' => $rental->id,
                    'item_id' => $item->id,
                    'price' => $item->equipment->price
                ]);
            }
        });
    }
}
