<?php

namespace App\Http\Requests;

use App\Models\Equipment;
use App\Rules\AvailableEquipment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RentalEquipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $eqCount = Equipment::with('items')->find($this->get('equipment_id'))->items
            ->where('status', 'dostępny')->count();
        return [
            'equipment_id' => ['required', 'exists:equipment,id', new AvailableEquipment],
            'quantity' => ['required', 'integer', 'min:1', 'max:' . $eqCount],
            'pivot.price' => ['required', 'decimal:0,2']
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'header' => 'Nie udało się dodać przedmiotów do wypożyczenia',
            'message' => implode(' ', $validator->errors()->all())
        ], 422));
    }
}
