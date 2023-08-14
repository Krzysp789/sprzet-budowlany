<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CategoryRequest extends FormRequest
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
            'name' => [
                'required',
                'unique:categories,name,' . $this->category?->id
            ],
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $this->category == null
            ? $header = 'Nie udało się dodać kategorii'
            : $header = 'Nie udało się zaktualizować kategorii';

        throw new HttpResponseException(response()->json([
            'header' => $header,
            'message' => implode(' ', $validator->errors()->all())
        ], 422));
    }
}
