<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Equipment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Equipment::factory()->count(50)->create()->each(function ($equipment) {
            foreach (Storage::disk('eqImg')->files($equipment->id) as $img) {
                Storage::delete("eqImg/$img");
            };
            $file = Storage::allFiles('exampleEq');
            $file = $file[fake()->numberBetween(0, count($file) - 1)];
            Storage::copy($file, "eqImg/$equipment->id/" . substr($file, 10));
            for ($i = 0; $i < fake()->numberBetween(0, 10); $i++) {
                $item = Item::factory()->create();
                $item->update(['equipment_id' => $equipment->id]);
            }
        });
    }
}
