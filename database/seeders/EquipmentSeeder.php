<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Equipment;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Equipment::factory()->count(50)->create()->each(function ($equipment) {
            for ($i = 0; $i < fake()->numberBetween(0, 10); $i++) {
                $item = Item::factory()->create();
                $item->update(['equipment_id' => $equipment->id]);
            }
        });
    }
}
