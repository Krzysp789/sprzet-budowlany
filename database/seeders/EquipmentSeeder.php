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
        foreach (Storage::disk('imgEq')->files() as $img) {
            if ($img != '.gitignore') Storage::disk('imgEq')->delete($img);
        };
        Equipment::factory()->count(50)->create()->each(function ($equipment) {
            $file = Storage::allFiles('exampleEq');
            $file = $file[fake()->numberBetween(0, count($file) - 1)];
            $filePath = "$equipment->id." . pathinfo($file, PATHINFO_EXTENSION);
            Storage::copy($file, "img_eq/$filePath");
            $equipment->update([
                'img_url' => $filePath
            ]);
            for ($i = 0; $i < fake()->numberBetween(0, 10); $i++) {
                $item = Item::factory()->create();
                $item->update(['equipment_id' => $equipment->id]);
            }
        });
    }
}
