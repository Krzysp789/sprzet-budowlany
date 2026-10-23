<?php

use App\Models\Category;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

pest()->use(RefreshDatabase::class);

test('admin can list categories with filtering sorting and pagination', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user);

    Category::factory()->create(['name' => 'Beton']);
    Category::factory()->create(['name' => 'Drewno']);
    Category::factory()->create(['name' => 'Betoniarka']);

    $response = $this->getJson('/api/categories?globalFilter=Bet&sortField=name&sortOrder=1&first=1&rows=1');

    $response->assertOk()
        ->assertJsonPath('total', 2)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'Betoniarka');
});

test('employee can view a category', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'employee']);
    $user->assignRole('employee');

    $this->actingAs($user);
    $category = Category::factory()->create(['name' => 'Koparki']);

    $this->getJson("/api/categories/{$category->id}")
        ->assertOk()
        ->assertJson(['id' => $category->id, 'name' => 'Koparki']);
});

test('admin can create and update a category', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user);

    $created = $this->postJson('/api/categories', ['name' => 'Podnośniki']);
    $created->assertCreated()
        ->assertJsonPath('message', 'Pomyślnie dodano kategorię Podnośniki.')
        ->assertJsonPath('data.name', 'Podnośniki');

    $categoryId = $created->json('data.id');
    $this->putJson("/api/categories/{$categoryId}", ['name' => 'Podesty'])
        ->assertOk()
        ->assertJsonPath('message', 'Pomyślnie zaktualizowano kategorię Podesty.')
        ->assertJsonPath('data.name', 'Podesty');

    $this->assertDatabaseHas('categories', ['id' => $categoryId, 'name' => 'Podesty']);
});

test('category creation requires a unique name', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user);
    Category::factory()->create(['name' => 'Koparki']);

    $this->postJson('/api/categories', ['name' => 'Koparki'])
        ->assertUnprocessable()
        ->assertJsonPath('header', 'Nie udało się dodać kategorii');

    $this->postJson('/api/categories', [])
        ->assertUnprocessable()
        ->assertJsonPath('header', 'Nie udało się dodać kategorii');
});

test('admin can delete a category without equipment', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user);
    $category = Category::factory()->create(['name' => 'Ładowarki']);

    $this->deleteJson("/api/categories/{$category->id}")
        ->assertOk()
        ->assertJsonPath('message', 'Pomyślnie usunięto kategorię Ładowarki.');

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});

test('category with equipment cannot be deleted', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user);
    $category = Category::factory()->create(['name' => 'Wiertnice']);
    Equipment::create([
        'category_id' => $category->id,
        'name' => 'Wiertnica diamentowa',
        'price' => 120,
    ]);

    $this->deleteJson("/api/categories/{$category->id}")
        ->assertStatus(409)
        ->assertJsonPath('message', 'Nie można usunąć kategorii Wiertnice ponieważ ma przypisane sprzęty.');

    $this->assertDatabaseHas('categories', ['id' => $category->id]);
});

test('employee cannot create categories', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'employee']);
    $user->assignRole('employee');

    $this->actingAs($user);

    $this->postJson('/api/categories', ['name' => 'Nowa'])
        ->assertForbidden();
});

test('guests cannot list categories', function () {
    $this->actingAsGuest();

    $this->getJson('/api/categories')->assertUnauthorized();
});

test('category search reports whether the requested value exists', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user);
    Category::factory()->create(['name' => 'Żurawie']);

    $this->getJson('/api/categories/search?attr=name&val=Żurawie')
        ->assertOk()
        ->assertContent('1');

    $this->getJson('/api/categories/search?attr=name&val=Nieistniejąca')
        ->assertOk()
        ->assertNoContent($status = 200);
});
