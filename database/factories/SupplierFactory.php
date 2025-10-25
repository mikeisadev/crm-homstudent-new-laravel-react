<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplier>
 */
class SupplierFactory extends Factory
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

        $types = [
            'cleaning',
            'maintenance',
            'plumbing',
            'electrical',
            'heating',
            'locksmith',
            'painting',
            'gardening',
            'pest_control',
            'security',
            'furniture',
            'appliances',
            'internet',
            'utilities',
            'insurance'
        ];

        return [
            'name' => fake()->company(),
            'type' => fake()->randomElement($types),
            'tax_code' => fake()->boolean(70) ? fake()->regexify('[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]') : null,
            'vat_number' => fake()->numerify('###########'),
            'email' => fake()->unique()->companyEmail(),
            'phone' => fake()->boolean(90) ? fake()->numerify('0## ### ####') : null,
            'mobile' => fake()->boolean(70) ? fake()->numerify('+39 3## ### ####') : null,
            'address' => fake()->streetAddress(),
            'city' => $city,
            'province' => strtoupper(substr($city, 0, 2)),
            'postal_code' => fake()->numerify('#####'),
            'country' => 'Italia',
            'iban' => fake()->boolean(60) ? $this->generateItalianIBAN() : null,
            'notes' => fake()->boolean(30) ? fake()->paragraph() : null,
        ];
    }

    /**
     * Generate Italian IBAN
     */
    private function generateItalianIBAN(): string
    {
        return 'IT' . fake()->numerify('##') . 'X' . fake()->numerify('##########') . 'X' . fake()->numerify('############');
    }
}
