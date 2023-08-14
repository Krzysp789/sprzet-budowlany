<?php

use App\Models\Equipment;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SelfRentController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\RentalItemController;
use App\Http\Controllers\SelfAddressController;
use App\Http\Controllers\EquipmentItemController;
use App\Http\Controllers\CustomerAddressController;
use App\Http\Controllers\RentalEquipmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('register', [AuthController::class, 'register']);
Route::get('user/searchEmail', [AuthController::class, 'searchEmail']);
Route::get('user', [AuthController::class, 'user'])->middleware(['auth:sanctum']);
Route::get('customers/{customer}/addresses/search', [CustomerAddressController::class, 'search'])
    ->where('customer', '[0-9]+')->middleware(['auth:sanctum']);

Route::controller(SelfRentController::class)->group(function () {
    Route::get('/offer', 'offerIndex');
    Route::get('/offer/{equipment}', 'offerShow')->where('equipment', '[0-9]+');
    Route::get('/selfCategories', 'selfCategories');
    Route::get('/customerRents', 'customerRents')->middleware(['auth:sanctum', 'role:customer']);
    Route::post('/storeRent', 'storeRent')->middleware(['auth:sanctum', 'role:customer']);
});

Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::get('selfAddresses/active', [SelfAddressController::class, 'showActive']);
    Route::post('selfAddresses/{address}/active', [SelfAddressController::class, 'setActive'])->where(['address' => '[0-9]+']);

    Route::apiResource('selfAddresses', SelfAddressController::class);
});

Route::middleware(['auth:sanctum', 'role:admin|employee'])->group(function () {
    Route::get('categories/search', [CategoryController::class, 'search']);
    Route::get('equipment/search', [EquipmentController::class, 'search']);
    Route::get('equipment/{equipment}/items/search', [EquipmentItemController::class, 'search'])
        ->where('equipment', '[0-9]+');
    Route::get('customers/search', [CustomerController::class, 'search']);
    Route::get('rentals/{rental}/items/search', [RentalItemController::class, 'search'])
        ->where('rental', '[0-9]+');

    Route::apiResource('customers.addresses', CustomerAddressController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('equipment', EquipmentController::class);
    Route::apiResource('equipment.items', EquipmentItemController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('rentals', RentalController::class);
    Route::apiResource('rentals.items', RentalItemController::class);
    Route::apiResource('rentals.equipment', RentalEquipmentController::class)->only(['store', 'destroy']);
});
