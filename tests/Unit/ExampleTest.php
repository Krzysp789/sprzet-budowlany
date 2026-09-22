<?php

use App\Events\CalculateRental;
use App\Models\Rental;
use App\Rules\AvailableEquipment;

test('that true is true', function () {
    expect(true)->toBeTrue();
});

test('sum', function () {
    function sum($x, $y)
    {
        return $x+$y;
    }

    $result = sum(1, 2);

    expect($result)->toBe(3);
});

test('rent status', function () {
    $result = \App\Enums\RentStatus::oczekujący;
    expect($result->value)->toBe(1);
});

test('items status names array', function () {
    $result = \App\Enums\ItemStatus::names();
    expect($result)->toBe(['dostępny','wypożyczony','w_przeglądzie']);
});

test('items status values array', function () {
    $result = \App\Enums\ItemStatus::values();
    expect($result)->toBe([1,2,3]);
});

test('items status combine array', function () {
    $result = \App\Enums\ItemStatus::array();
    expect($result)->toBe([
        1 => 'dostępny',
        2 => 'wypożyczony',
        3 => 'w_przeglądzie'
    ]);
});
