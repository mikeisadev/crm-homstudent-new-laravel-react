<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Owner>
 */
class OwnerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['private', 'business']);
        $cities = ['Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 'Napoli', 'Palermo', 'Genova', 'Venezia', 'Verona'];
        $city = fake()->randomElement($cities);
        $banks = ['Intesa Sanpaolo', 'UniCredit', 'Banco BPM', 'BPER Banca', 'Monte dei Paschi di Siena'];

        $data = [
            'type' => $type,
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->boolean(70) ? fake()->numerify('0## ### ####') : null,
            'mobile' => fake()->boolean(80) ? fake()->numerify('+39 3## ### ####') : null,
            'address' => fake()->streetAddress(),
            'city' => $city,
            'province' => strtoupper(substr($city, 0, 2)),
            'postal_code' => fake()->numerify('#####'),
            'country' => 'Italia',
            'bank_name' => fake()->boolean(70) ? fake()->randomElement($banks) : null,
            'iban' => fake()->boolean(70) ? $this->generateItalianIBAN() : null,
            'notes' => fake()->boolean(20) ? fake()->paragraph() : null,
        ];

        if ($type === 'business') {
            $data['company_name'] = fake()->company();
            $data['first_name'] = fake()->firstName();
            $data['last_name'] = fake()->lastName();
            $data['vat_number'] = fake()->numerify('###########');
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
     * Generate Italian IBAN
     */
    private function generateItalianIBAN(): string
    {
        return 'IT' . fake()->numerify('##') . 'X' . fake()->numerify('##########') . 'X' . fake()->numerify('############');
    }
}
