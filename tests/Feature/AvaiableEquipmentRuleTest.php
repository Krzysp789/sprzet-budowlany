<?php

use App\Models\Category;
use App\Models\Equipment;
use App\Models\Item;
use App\Rules\AvailableEquipment;
use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

test('rule pass, when equipment has items available', function () {
    Category::factory()->create();
    $equipment = Equipment::factory()->create();
    Item::factory([
        'status' => 'dostępny',
        'equipment_id' => $equipment->id
    ])->create();

    $validator = Validator::make(
        ['equipment_id' => $equipment->id],
        ['equipment_id' => [new AvailableEquipment()]]
    );

    expect($validator->passes())->toBeTrue();
});

test('rule fail, when equipment does not contain any items', function () {
    Category::factory()->create();
    $equipment = Equipment::factory()->create();

    $validator = Validator::make(
        ['equipment_id' => $equipment->id],
        ['equipment_id' => [new AvailableEquipment()]]
    );

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->first('equipment_id'))->toBe('Wybrany sprzęt musi mieć dostępny przedmiot.');
});

test('rule fail, when equipment contains only occupied items', function () {
    Category::factory()->create();
    $equipment = Equipment::factory()->create();
    Item::factory([
        'status' => 'wypożyczony',
        'equipment_id' => $equipment->id
    ])->create();

    Item::factory([
        'status' => 'w_przeglądzie',
        'equipment_id' => $equipment->id
    ])->create();

    $validator = Validator::make(
        ['equipment_id' => $equipment->id],
        ['equipment_id' => [new AvailableEquipment()]]
    );

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->first('equipment_id'))
        ->toBe('Wybrany sprzęt musi mieć dostępny przedmiot.');
});

test('rule fail, when equipment does not exist', function () {
    $validator = Validator::make(
        ['equipment_id' => 1],
        ['equipment_id' => [new AvailableEquipment()]]
    );

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->first('equipment_id'))
        ->toBe('Wybrany sprzęt nie istnieje.');
});
