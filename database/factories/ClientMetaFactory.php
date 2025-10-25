<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClientMeta>
 */
class ClientMetaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Student-specific meta keys
        $studentKeys = [
            'university' => fake()->randomElement(['Politecnico di Milano', 'Università di Bologna', 'Università di Torino', 'La Sapienza Roma', 'Università di Firenze']),
            'faculty' => fake()->randomElement(['Ingegneria', 'Economia', 'Lettere', 'Medicina', 'Giurisprudenza', 'Architettura']),
            'year_of_study' => fake()->numberBetween(1, 5),
            'student_id' => fake()->numerify('######'),
            'expected_graduation' => fake()->year(),
        ];

        // Business-specific meta keys
        $businessKeys = [
            'industry' => fake()->randomElement(['Real Estate', 'Technology', 'Consulting', 'Finance', 'Education', 'Healthcare']),
            'company_size' => fake()->randomElement(['1-10', '11-50', '51-200', '201-500', '500+']),
            'registration_number' => fake()->numerify('########'),
        ];

        // General meta keys
        $generalKeys = [
            'preferred_language' => fake()->randomElement(['Italiano', 'English', 'Español', 'Français']),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => fake()->numerify('+39 3## ### ####'),
            'dietary_restrictions' => fake()->randomElement(['None', 'Vegetarian', 'Vegan', 'Gluten-free']),
            'pets' => fake()->randomElement(['No', 'Cat', 'Dog', 'Other']),
        ];

        $allKeys = array_merge($studentKeys, $businessKeys, $generalKeys);
        $metaKey = fake()->randomElement(array_keys($allKeys));

        return [
            'client_id' => Client::factory(),
            'meta_key' => $metaKey,
            'meta_value' => $allKeys[$metaKey],
        ];
    }
}
