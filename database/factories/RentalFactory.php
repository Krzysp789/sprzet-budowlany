<?php

namespace Database\Factories;

use App\Enums\Payment;
use App\Models\Rental;
use App\Enums\Delivery;
use App\Models\Customer;
use App\Enums\RentStatus;
use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rental>
 */
class RentalFactory extends Factory
{
    protected $model = Rental::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $customer_id = Customer::select('id')->orderByRaw('RAND()')->first()->id;
        return [
            'customer_id' => $customer_id,
            'address_id' => Address::where('customer_id', $customer_id)->first()->id,
            'total_price' => fake()->randomFloat(2, 100, 800),
            'date_rental' => fake()->date('Y_m_d'),
            'date_deadline' => fake()->date('Y_m_d'),
            'date_return' => fake()->optional->date('Y_m_d'),
            'status' => fake()->randomElement(RentStatus::cases()),
            'delivery' => fake()->randomElement(Delivery::cases()),
            'payment' => fake()->randomElement(Payment::cases()),
            'paid' => fake()->boolean(),
            'notes' => $this->faker->optional->text(150),
        ];
    }
}
