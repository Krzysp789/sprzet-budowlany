<?php

namespace App\Http\Requests\RentalItem;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreRentalItemRequest extends FormRequest
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
        $rental = $this->route('rental');
        return [
            'item_id' => [
                'required',
                'exists:items,id',
                Rule::unique('item_rental', 'item_id')->where(
                    fn ($query) => $query->where('rental_id', $rental)
                )
            ],
            'pivot.price' => ['required', 'decimal:0,2']
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'header' => 'Nie udało się dodać przedmiotu do wypożyczenia',
            'message' => implode(' ', $validator->errors()->all())
        ], 422));
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'item_id' => 'przedmiot',
            'pivot.price' => 'cena'
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
            'pivot.date_rental.after_or_equal' => 'Pole :attribute musi być datą nie
            wcześniejszą od daty dzisiejszej.'
        ];
    }
}
