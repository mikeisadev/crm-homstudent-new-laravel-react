<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'condominium_id' => 'nullable|exists:condominiums,id',
            'internal_code' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'property_type' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'province' => 'nullable|string|max:2',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:2',
            'surface_area' => 'nullable|numeric',
            'floor_number' => 'nullable|integer',
            'notes' => 'nullable|string',
        ];
    }
}
