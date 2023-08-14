<?php

namespace Database\Factories;

use App\Models\Item;
use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    protected $model = Item::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'serial_number' => fake()->unique()->bothify('?????-#####'),
            'status' => 1,
            'work_time' => fake()->randomNumber(2),
            'equipment_id' => Equipment::select('id')->orderByRaw("RAND()")->first()->id
        ];
    }
}
