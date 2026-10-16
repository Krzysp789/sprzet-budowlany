<?php

use App\Enums\Delivery;
use App\Enums\ItemStatus;
use App\Enums\Payment;
use App\Events\CalculateRental;
use App\Models\Address;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Equipment;
use App\Models\Item;
use App\Models\Rental;
use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

beforeEach(function () {
    $customer = Customer::factory()->create();
    Address::factory()->create(['customer_id' => $customer->id]);
    $rental = Rental::factory()->create([
        'date_rental' => '2023-10-01',
        'date_deadline' => '2023-10-01',
        'delivery' => Delivery::odbiór_osobisty,
        'payment' => Payment::przy_odbiorze,
    ]);
    Category::factory()->create();
    $equipment = Equipment::factory()->create(['price' => 100]);
    $item = Item::factory([
        'status' => ItemStatus::wypożyczony,
        'equipment_id' => $equipment->id
    ])->create();
    $rental->items()->attach($item->id, ['price' => 100]);
});

test('calculates the total price for a single item and a single day, with no additional fees', function () {
    $rental = Rental::first();

    event(new CalculateRental($rental));

    $rental->refresh();
    expect($rental->total_price)->toBe('100.00');
});

test('adds the delivery fee to the price', function () {
    $rental = Rental::first();
    $rental->update(['delivery' => Delivery::dostawa_na_adres]);
    $rental->refresh();

    event(new CalculateRental($rental));

    $rental->refresh();
    expect($rental->total_price)->toBe('150.00');
});

test('adds the transfer fee to the price', function () {
    $rental = Rental::first();
    $rental->update(['payment' => Payment::przelew]);
    $rental->refresh();

    event(new CalculateRental($rental));


    $rental->refresh();
    expect($rental->total_price)->toBe('105.00');
});

test('calculates the price, including all additional fees', function () {
    $rental = Rental::first();
    $rental->update([
        'date_deadline' => '2023-10-02',
        'delivery' => Delivery::dostawa_na_adres,
        'payment' => Payment::przelew
    ]);
    $rental->refresh();

    event(new CalculateRental($rental));

    $rental->refresh();
    expect($rental->total_price)->toBe('255.00');
});

test('calculates the price for multiple days and multiple items', function () {
    $equipment = Equipment::factory()->create(['price' => 50]);
    $item = Item::factory([
        'status' => ItemStatus::wypożyczony,
        'equipment_id' => $equipment->id
    ])->create();
    $rental = Rental::first();
    $rental->items()->attach($item->id, ['price' => 50]);
    $rental->update(['date_deadline' => '2023-10-03']);
    $rental->refresh();

    event(new CalculateRental($rental));

    $rental->refresh();
    expect($rental->total_price)->toBe('450.00');
});

test('calculates the price for no items', function () {
    $rental = Rental::first();
    $rental->items()->detach();
    $rental->refresh();

    event(new CalculateRental($rental));

    $rental->refresh();
    expect($rental->total_price)->toBe('0.00');
});
