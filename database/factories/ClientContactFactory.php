<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClientContact>
 */
class ClientContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['phone_secondary', 'mobile_secondary', 'fax', 'email_secondary', 'pec', 'facebook', 'linkedin', 'other']);

        $value = match($type) {
            'phone_secondary' => fake()->numerify('0## ### ####'),
            'mobile_secondary' => fake()->numerify('+39 3## ### ####'),
            'fax' => fake()->numerify('0## ### ####'),
            'email_secondary', 'pec' => fake()->safeEmail(),
            'facebook', 'linkedin' => fake()->url(),
            'other' => fake()->phoneNumber(),
            default => fake()->phoneNumber(),
        };

        return [
            'client_id' => Client::factory(),
            'type' => $type,
            'value' => $value,
            'label' => fake()->randomElement(['Personal', 'Work', 'Home', 'Other']),
            'is_primary' => false,
        ];
    }

    /**
     * Mark contact as primary
     */
    public function primary(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_primary' => true,
        ]);
    }
}
