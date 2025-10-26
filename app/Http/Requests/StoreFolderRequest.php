<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFolderRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:100',
                'regex:/^[\w\s\-]+$/u', // Only alphanumeric, spaces, dashes, underscores (Unicode-safe)
            ],
            'parent_folder_id' => [
                'nullable',
                'exists:client_folders,id',
            ],
        ];
    }

    /**
     * Custom validation messages in Italian
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Il nome della cartella è obbligatorio',
            'name.string' => 'Il nome della cartella deve essere una stringa',
            'name.max' => 'Il nome della cartella non può superare i 100 caratteri',
            'name.regex' => 'Il nome della cartella può contenere solo lettere, numeri, spazi, trattini e underscore',
            'parent_folder_id.exists' => 'La cartella padre selezionata non esiste',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $clientId = $this->route('client')->id ?? $this->route('client');

            // Security: Check parent folder belongs to client
            if ($this->parent_folder_id) {
                $parentFolder = \App\Models\ClientFolder::find($this->parent_folder_id);

                if ($parentFolder && $parentFolder->client_id != $clientId) {
                    $validator->errors()->add('parent_folder_id', 'La cartella padre non appartiene a questo cliente');
                }
            }

            // Security: Check for path traversal attempts in folder name
            if ($this->name) {
                if (preg_match('/\.\.\/|\.\.\\\\|\/|\\\\/', $this->name)) {
                    $validator->errors()->add('name', 'Nome cartella non valido: caratteri non consentiti rilevati');
                }
            }

            // Validation: Check for duplicate folder name in same parent
            if ($this->name && $clientId) {
                $duplicateExists = \App\Models\ClientFolder::where('client_id', $clientId)
                    ->where('parent_folder_id', $this->parent_folder_id)
                    ->where('name', $this->name)
                    ->exists();

                if ($duplicateExists) {
                    $validator->errors()->add('name', 'Esiste già una cartella con questo nome in questa posizione');
                }
            }
        });
    }
}
