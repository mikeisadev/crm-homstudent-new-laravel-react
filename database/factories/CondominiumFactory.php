<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Condominium>
 */
class CondominiumFactory extends Factory
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
        $streetName = fake()->streetName();

        return [
            'name' => 'Condominio ' . $streetName,
            'tax_code' => fake()->regexify('[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]'),
            'address' => $streetName . ' ' . fake()->buildingNumber(),
            'city' => $city,
            'province' => strtoupper(substr($city, 0, 2)),
            'postal_code' => fake()->numerify('#####'),
            'country' => 'Italia',
            'construction_year' => fake()->numberBetween(1950, 2020),
            'latitude' => fake()->latitude(35, 47),
            'longitude' => fake()->longitude(6, 19),
            'administrator_name' => fake()->name(),
            'administrator_phone' => fake()->boolean(80) ? fake()->numerify('0## ### ####') : null,
            'administrator_mobile' => fake()->boolean(90) ? fake()->numerify('+39 3## ### ####') : null,
            'administrator_toll_free' => fake()->boolean(40) ? fake()->numerify('800 ### ###') : null,
            'administrator_email' => fake()->safeEmail(),
            'administrator_pec' => fake()->boolean(70) ? fake()->userName() . '@pec.it' : null,
            'water_meters_info' => fake()->boolean(50) ? fake()->sentence() : null,
            'electricity_meters_info' => fake()->boolean(50) ? fake()->sentence() : null,
            'gas_meters_info' => fake()->boolean(50) ? fake()->sentence() : null,
            'heating_system_info' => fake()->boolean(60) ? fake()->randomElement(['Centralizzato', 'Autonomo', 'Misto']) : null,
            'notes' => fake()->boolean(30) ? fake()->paragraph() : null,
        ];
    }
}
