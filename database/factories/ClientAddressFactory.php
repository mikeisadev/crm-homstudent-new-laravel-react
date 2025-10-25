<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClientAddress>
 */
class ClientAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cities = ['Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 'Napoli', 'Palermo', 'Genova', 'Venezia', 'Verona'];
        $city = fake()->randomElement($cities);

        return [
            'client_id' => Client::factory(),
            'type' => fake()->randomElement(['residence', 'domicile', 'billing', 'other']),
            'address' => fake()->streetName(),
            'civic_number' => fake()->buildingNumber(),
            'city' => $city,
            'province' => strtoupper(substr($city, 0, 2)),
            'postal_code' => fake()->numerify('#####'),
            'country' => 'Italia',
            'latitude' => fake()->latitude(35, 47),
            'longitude' => fake()->longitude(6, 19),
            'is_primary' => false,
        ];
    }

    /**
     * Mark address as primary
     */
    public function primary(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_primary' => true,
        ]);
    }
}
