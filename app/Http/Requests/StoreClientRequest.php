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
            // Main client fields
            'type' => 'required|in:private,business',
            'company_name' => 'required_if:type,business|nullable|string|max:255',
            'first_name' => 'required_if:type,private|nullable|string|max:255',
            'last_name' => 'required_if:type,private|nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'mobile' => 'nullable|string|max:50',
            'tax_code' => 'required_if:type,private|nullable|string|max:50',
            'vat_number' => 'required_if:type,business|nullable|string|max:50',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:10',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'origin_source' => 'nullable|string|max:255',
            'origin_details' => 'nullable|string',
            'notes' => 'nullable|string',

            // Meta data
            'meta_data' => 'nullable|array',
            'meta_data.unique_code' => 'nullable|string|max:7',
            'meta_data.document_type' => 'nullable|string|max:255',
            'meta_data.document_number' => 'nullable|string|max:255',
            'meta_data.document_issued_by' => 'nullable|string|max:255',
            'meta_data.birth_date' => 'nullable|date',
            'meta_data.birth_city' => 'nullable|string|max:255',
            'meta_data.birth_province' => 'nullable|string|max:10',
            'meta_data.birth_country' => 'nullable|string|max:255',
            'meta_data.nationality' => 'nullable|string|max:255',
            'meta_data.gender' => 'nullable|in:M,F,',
            'meta_data.father_name' => 'nullable|string|max:255',
            'meta_data.mother_name' => 'nullable|string|max:255',
            'meta_data.civic_number' => 'nullable|string|max:50',

            // Contacts data
            'contacts_data' => 'nullable|array',
            'contacts_data.phone_secondary' => 'nullable|string|max:50',
            'contacts_data.email_secondary' => 'nullable|email|max:255',
            'contacts_data.fax' => 'nullable|string|max:50',
            'contacts_data.pec' => 'nullable|email|max:255',
            'contacts_data.facebook' => 'nullable|string|max:255',
            'contacts_data.linkedin' => 'nullable|string|max:255',

            // Banking data
            'banking_data' => 'nullable|array',
            'banking_data.bank_name' => 'nullable|string|max:255',
            'banking_data.iban' => 'nullable|string|max:34',
            'banking_data.payment_method' => 'nullable|string|max:255',
        ];
    }
}
