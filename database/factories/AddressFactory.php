<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'street_number' => fake()->streetAddress(),
            'post_code' => fake()->postcode(),
            'town' => fake()->city(),
            'active' => false,
            'customer_id' => Customer::select('id')->orderByRaw("RAND()")->first()->id
        ];
    }
}
