<?php

namespace App\Http\Requests;

use App\Enums\ItemStatus;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rules\Enum;

class EquipmentItemRequest extends FormRequest
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
        $equipment = $this->route('equipment');
        return [
            'serial_number'  => [
                'required',
                Rule::unique('items', 'serial_number')->where(
                    fn ($query) => $query->where('equipment_id', $equipment)
                )->ignore($this->item)
            ],
            'status' => ['required', new Enum(ItemStatus::class)],
            'work_time' => ['required', 'numeric', 'min:0']
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
            'serial_number' => 'numer seryjny',
            'work_time' => 'czas pracy'
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
