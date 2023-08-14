<?php

namespace App\Http\Requests\Rental;

use App\Enums\Payment;
use App\Enums\Delivery;
use App\Enums\RentStatus;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateRentalRequest extends FormRequest
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
            'customer_id' => ['required', 'exists:customers,id'],
            'address_id' => [
                'required_if:delivery,' . Delivery::dostawa_na_adres->value,
                'exists:addresses,id'
            ],
            'date_rental' => ['required', 'date'],
            'date_deadline' => ['required', 'date', 'after_or_equal:date_rental'],
            'date_return' => ['nullable', 'date', 'after_or_equal:date_rental'],
            'status' => ['required', new Enum(RentStatus::class)],
            'delivery' => ['required', new Enum(Delivery::class)],
            'payment' => ['required', new Enum(Payment::class)],
            'paid' => ['required', 'boolean'],
            'notes' => ['nullable', 'string', 'max:255']
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
            'customer_id' => 'klient',
            'notes' => 'uwagi'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $this->equipment == null
            ? $header = 'Nie udało się dodać przedmiotu'
            : $header = 'Nie udało się zaktualizować przedmiotu';

        throw new HttpResponseException(response()->json([
            'header' => $header,
            'message' => implode(' ', $validator->errors()->all())
        ], 422));
    }
}
