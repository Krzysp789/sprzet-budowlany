<?php

namespace App\Rules;

use Closure;
use App\Models\Equipment;
use Illuminate\Contracts\Validation\ValidationRule;

class AvailableEquipment implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $eqCount = Equipment::with('items')->find($value)->items
            ->where('status', 'dostępny')->count();
        if ($eqCount == 0) {
            $fail('Wybrany sprzęt musi mieć dostępny przedmiot.');
        }
    }
}
