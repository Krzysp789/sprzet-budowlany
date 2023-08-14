<?php

namespace Database\Factories;

use App\Models\Equipment;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
 */
class EquipmentFactory extends Factory
{
    protected $model = Equipment::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(100),
            'price' => fake()->randomFloat(2, 10, 500),
            'description' => fake()->optional()->text(150),
            'category_id' => Category::select('id')->orderByRaw("RAND()")->first()->id,
        ];
    }
}
