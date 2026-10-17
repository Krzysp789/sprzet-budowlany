<?php

use App\Models\User;
use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

test('user can register', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'first_name' => 'Jan',
        'last_name' => 'Kowalski',
        'phone_no' => '123456789',
        'notes' => 'Test note'
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['header', 'message']);

    $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    $this->assertDatabaseHas('customers', ['phone_no' => '123456789']);
});

test('user can login', function () {
    $user = User::factory()->create([
        'email' => 'login@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'login@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200);
    $this->assertAuthenticated();
});

test('user cannot login with wrong credentials', function () {
    $user = User::factory()->create([
        'email' => 'wrong@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'wrong@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(401)
        ->assertJsonFragment(['message' => 'Logowanie nieudane']);
});

test('user can logout', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->postJson('/api/logout');

    $response->assertStatus(200)
        ->assertJson(['header' => 'wylogowano pomyślnie']);

    $this->assertGuest();
});

test('user can get authenticated user', function () {
    $user = User::factory()->create(['name' => 'John Doe']);
    $this->actingAs($user);

    $response = $this->getJson('/api/user');

    $response->assertStatus(200)
        ->assertJsonStructure(['id', 'name', 'email']);
});

test('user cannot get unauthenticated user', function () {
    $user = User::factory()->create(['name' => 'John Doe']);

    $response = $this->getJson('/api/user');

    $response->assertStatus(401)
        ->assertJsonFragment(['message' => 'Unauthenticated.']);
});

test('email search returns true if email exists', function () {
    User::factory()->create(['email' => 'exists@example.com']);

    $response = $this->getJson('/api/user/searchEmail?val=exists@example.com');

    $response->assertStatus(200)
        ->assertContent('1');
});

test('email search returns false if email does not exist', function () {
    $response = $this->getJson('/api/user/searchEmail?val=notfound@example.com');

    $response->assertNoContent($status = 200);
});
