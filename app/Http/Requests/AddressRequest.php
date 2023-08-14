<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddressRequest extends FormRequest
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
            'street_number' => ['required', 'between:2,45'],
            'post_code' => ['required', 'size:6', 'regex:/^\d{2}-\d{3}$/'],
            'town' => ['required', 'between:2,45'],
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
            'street_number' => 'ulica i numer',
            'post_code' => 'kod pocztowy',
            'town' => 'miejscowość'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $this->address == null
            ? $header = 'Nie udało się dodać adresu'
            : $header = 'Nie udało się zaktualizować adresu';

        throw new HttpResponseException(response()->json([
            'header' => $header,
            'message' => implode(' ', $validator->errors()->all())
        ], 422));
    }
}
