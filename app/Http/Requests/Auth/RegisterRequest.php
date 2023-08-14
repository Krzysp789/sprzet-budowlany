<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:45'],
            'email' => ['required', 'email', 'unique:users,email', 'max:255'],
            'password' => ['required'],
            'first_name' => ['required', 'string', 'max:45'],
            'last_name' => ['required', 'string', 'max:45'],
            'phone_no' => [
                'required', 'string', 'unique:customers,phone_no',
                'regex:/^[+]\d{1,3}[ ]\d{9}$|^\d{9}$/'
            ],
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
            'name' => 'nazwa',
            'password' => 'hasło',
            'first_name' => 'imie',
            'last_name' => 'nazwisko',
            'phone_no' => 'nr telefonu',
            'notes' => 'informacje'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'header' => 'Rejestracja nieudana',
            'message' => implode(' ', $validator->errors()->all())
        ], 422));
    }
}
