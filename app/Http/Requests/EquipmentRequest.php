<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class EquipmentRequest extends FormRequest
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
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'unique:equipment,name,' . $this->equipment?->id],
            'price' => ['required', 'decimal:0,2'],
            'description' => ['nullable', 'max:255']
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'category_id' => 'kategoria',
            'price' => 'cena',
            'description' => 'opis'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $this->equipment == null
            ? $header = 'Nie udało się dodać sprzętu'
            : $header = 'Nie udało się zaktualizować sprzętu';

        throw new HttpResponseException(response()->json([
            'header' => $header,
            'message' => implode(' ', $validator->errors()->all())
        ], 422));
    }
}
