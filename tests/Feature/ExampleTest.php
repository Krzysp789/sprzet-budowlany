<?php
use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

test('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertOk();
});

test('address factory', function () {
    \App\Models\Customer::factory()->count(20)->create();
    $result = \App\Models\Customer::all()->count();
    $this->assertEquals(20, $result);
});
