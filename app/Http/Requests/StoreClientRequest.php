<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
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
            'type' => 'required|in:private,business',
            'company_name' => 'nullable|string|max:255',
            'first_name' => 'required_if:type,private|string|max:255',
            'last_name' => 'required_if:type,private|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'mobile' => 'nullable|string|max:50',
            'tax_code' => 'nullable|string|max:50',
            'vat_number' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:2',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:2',
            'origin_source' => 'nullable|string|max:255',
            'origin_details' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }
}
