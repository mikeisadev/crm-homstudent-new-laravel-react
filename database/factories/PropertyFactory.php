<?php

namespace Database\Factories;

use App\Models\Condominium;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
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
        $buildingNumber = fake()->buildingNumber();

        return [
            'condominium_id' => fake()->boolean(60) ? Condominium::factory() : null,
            'internal_code' => fake()->unique()->regexify('PROP[0-9]{4}'),
            'name' => 'Appartamento ' . $streetName,
            'property_type' => fake()->randomElement(['apartment', 'villa', 'office', 'studio', 'loft', 'attic']),
            'address' => $streetName . ' ' . $buildingNumber,
            'portal_address' => $streetName . ', ' . $buildingNumber,
            'city' => $city,
            'province' => strtoupper(substr($city, 0, 2)),
            'postal_code' => fake()->numerify('#####'),
            'country' => 'Italia',
            'zone' => fake()->randomElement(['Centro', 'Semicentro', 'Periferia', 'Zona Nord', 'Zona Sud', 'Zona Est', 'Zona Ovest']),
            'intended_use' => fake()->randomElement(['residential', 'commercial', 'mixed']),
            'layout' => fake()->randomElement(['bilocale', 'trilocale', 'quadrilocale', 'pentalocale', 'open_space']),
            'surface_area' => fake()->numberBetween(30, 250),
            'property_status' => fake()->randomElement(['available', 'rented', 'maintenance', 'reserved']),
            'floor_number' => fake()->numberBetween(0, 10),
            'total_floors' => fake()->numberBetween(3, 12),
            'construction_year' => fake()->numberBetween(1950, 2022),
            'condition' => fake()->randomElement(['excellent', 'good', 'fair', 'poor', 'to_renovate']),
            'bathrooms_with_tub' => fake()->numberBetween(0, 2),
            'bathrooms' => fake()->numberBetween(1, 3),
            'balconies' => fake()->numberBetween(0, 3),
            'has_concierge' => fake()->boolean(40),
            'is_published_web' => fake()->boolean(30),
            'web_address' => fake()->boolean(30) ? fake()->url() : null,
            'description' => fake()->boolean(70) ? fake()->paragraph(3) : null,
            'cadastral_section' => fake()->regexify('[A-Z]'),
            'cadastral_sheet' => fake()->numerify('####'),
            'cadastral_particle' => fake()->numerify('###'),
            'cadastral_subordinate' => fake()->boolean(50) ? fake()->numerify('##') : null,
            'cadastral_category' => fake()->randomElement(['A/2', 'A/3', 'A/4', 'C/1', 'C/2']),
            'cadastral_income' => fake()->randomFloat(2, 300, 2000),
            'energy_certificate' => fake()->randomElement(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
            'heating_type' => fake()->randomElement(['autonomous', 'centralized', 'none']),
            'cooling_type' => fake()->randomElement(['air_conditioning', 'fan', 'none']),
            'hot_water_type' => fake()->randomElement(['boiler', 'centralized', 'solar', 'electric']),
            'cold_water_meter' => fake()->boolean(70) ? fake()->numerify('########') : null,
            'electricity_pod' => fake()->boolean(70) ? fake()->regexify('IT[0-9]{12}[A-Z]') : null,
            'gas_pdr' => fake()->boolean(70) ? fake()->numerify('##############') : null,
            'water_supplier' => fake()->boolean(60) ? fake()->randomElement(['Metropolitana Milanese', 'ACEA', 'SMAT', 'Hera']) : null,
            'water_contract_details' => fake()->boolean(40) ? fake()->sentence() : null,
            'gas_supplier' => fake()->boolean(60) ? fake()->randomElement(['Enel Energia', 'ENI', 'A2A', 'Edison']) : null,
            'gas_contract_details' => fake()->boolean(40) ? fake()->sentence() : null,
            'electricity_supplier' => fake()->boolean(60) ? fake()->randomElement(['Enel Energia', 'ENI', 'A2A', 'Edison']) : null,
            'electricity_contract_details' => fake()->boolean(40) ? fake()->sentence() : null,
            'notes' => fake()->boolean(30) ? fake()->paragraph() : null,
        ];
    }
}
