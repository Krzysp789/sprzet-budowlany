<?php

use App\Enums\RentStatus;

test('returns correct names for RentStatus', function () {
    $expectedNames = ['oczekujący', 'zatwierdzony', 'w_trakcie', 'zakończony'];
    expect(RentStatus::names())->toBe($expectedNames);
});

test('returns correct values for RentStatus', function () {
    $expectedValues = [1, 2, 3, 4];
    expect(RentStatus::values())->toBe($expectedValues);
});

test('returns correct associative array for RentStatus', function () {
    $expectedArray = [
        1 => 'oczekujący',
        2 => 'zatwierdzony',
        3 => 'w_trakcie',
        4 => 'zakończony',
    ];
    expect(RentStatus::array())->toBe($expectedArray);
});
