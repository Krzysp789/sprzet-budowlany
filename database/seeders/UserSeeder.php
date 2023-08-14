<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Address;
use App\Models\Customer;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'employee']);
        Role::create(['name' => 'customer']);

        $user = User::create([
            'name' => 'Admin Testowy',
            'email' => 'admin@test',
            'password' => Hash::make('123456')
        ]);

        $user->assignRole('admin');

        $user = User::create([
            'name' => 'Pracownik Testowy',
            'email' => 'pracownik@test',
            'password' => Hash::make('123456')
        ]);

        $user->assignRole('employee');

        $customer = Customer::create([
            'first_name' => 'Klient',
            'last_name' => 'Testowy',
            'phone_no' => '+48 123456789',
            'email' => 'klient@test',
            'notes' => 'Jest to klient testowy'
        ]);

        Address::factory()->create([
            'customer_id' => $customer->id,
            'active' => true
        ]);

        $user = User::create([
            'name' => 'Klient Testowy',
            'email' => 'klient@test',
            'password' => Hash::make('123456'),
            'customer_id' => $customer->id
        ]);

        $user->assignRole('customer');
    }
}
