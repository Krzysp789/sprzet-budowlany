<?php

namespace App\Http\Requests;

use App\Enums\Payment;
use App\Enums\Delivery;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreRentRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'equipment.*.id' => ['required', 'exists:equipment,id'],
            'equipment.*.quantity' => ['required', 'numeric', 'min:1'],
            'address_id' => [
                'required_if:delivery,' . Delivery::dostawa_na_adres->value,
                'exists:addresses,id'
            ],
            'dateRental' => ['required', 'date', 'after_or_equal:today'],
            'dateDeadline' => ['required', 'date', 'after_or_equal:date_rental'],
            'delivery' => ['required', new Enum(Delivery::class)],
            'payment' => ['required', new Enum(Payment::class)],
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
            'equipment.*.id' => 'id sprzętu',
            'equipment.*.quantity' => 'ilość sprzętu',
            'address_id' => 'adres',
            'dateRental' => 'data wypożyczenia',
            'dateDeadline' => 'termin zwrotu',
            'delivery' => 'dostawa',
            'payment' => 'płatność'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'address_id.required_if' => 'Pole :attribute jest wymagane kiedy dostawa jest na adres',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'header' => 'Nie udało się zrealizować wypożyczenia',
            'message' => implode(' ', $validator->errors()->all())
        ], 422));
    }
}
