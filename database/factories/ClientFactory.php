<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['private', 'business']);
        $cities = ['Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 'Napoli', 'Palermo', 'Genova', 'Venezia', 'Verona', 'Padova', 'Trieste', 'Brescia', 'Parma', 'Modena'];
        $city = fake()->randomElement($cities);

        $data = [
            'type' => $type,
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->boolean(70) ? $this->generateItalianPhone() : null,
            'mobile' => fake()->boolean(80) ? $this->generateItalianMobile() : null,
            'address' => fake()->streetAddress(),
            'city' => $city,
            'province' => strtoupper(substr($city, 0, 2)),
            'postal_code' => fake()->numerify('#####'),
            'country' => 'Italia',
            'origin_source' => fake()->randomElement(['website', 'referral', 'social_media', 'advertisement', 'walk_in', 'phone_call']),
            'origin_details' => fake()->boolean(50) ? fake()->sentence() : null,
            'notes' => fake()->boolean(30) ? fake()->paragraph() : null,
        ];

        if ($type === 'business') {
            $data['company_name'] = fake()->company();
            $data['first_name'] = fake()->firstName();
            $data['last_name'] = fake()->lastName();
            $data['vat_number'] = fake()->numerify('###########'); // 11 digits
            $data['tax_code'] = fake()->boolean(50) ? $this->generateTaxCode() : null;
        } else {
            $data['company_name'] = null;
            $data['first_name'] = fake()->firstName();
            $data['last_name'] = fake()->lastName();
            $data['tax_code'] = $this->generateTaxCode();
            $data['vat_number'] = null;
        }

        return $data;
    }

    /**
     * Generate Italian tax code (codice fiscale)
     */
    private function generateTaxCode(): string
    {
        return fake()->regexify('[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]');
    }

    /**
     * Generate Italian phone number
     */
    private function generateItalianPhone(): string
    {
        $formats = [
            '0## ### ####',
            '+39 0## ### ####',
        ];
        return fake()->numerify(fake()->randomElement($formats));
    }

    /**
     * Generate Italian mobile number
     */
    private function generateItalianMobile(): string
    {
        $formats = [
            '3## ### ####',
            '+39 3## ### ####',
        ];
        return fake()->numerify(fake()->randomElement($formats));
    }

    /**
     * State for private client type
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'private',
            'company_name' => null,
            'vat_number' => null,
        ]);
    }

    /**
     * State for business client type
     */
    public function business(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'business',
            'company_name' => fake()->company(),
            'vat_number' => fake()->numerify('###########'),
        ]);
    }
}
