<?php

namespace App\Rules;

use Closure;
use App\Models\Equipment;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AvailableEquipment implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            $eqCount = Equipment::with('items')->findOrFail($value)->items
                ->where('status', 'dostępny')->count();
        } catch (ModelNotFoundException $e) {
            $fail('Wybrany sprzęt nie istnieje.');
            $eqCount = null;
        }

        if ($eqCount == 0) {
            $fail('Wybrany sprzęt musi mieć dostępny przedmiot.');
        }
    }
}
