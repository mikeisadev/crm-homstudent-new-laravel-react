<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClientBanking>
 */
class ClientBankingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $banks = [
            'Intesa Sanpaolo',
            'UniCredit',
            'Banco BPM',
            'BPER Banca',
            'Monte dei Paschi di Siena',
            'Crédit Agricole Italia',
            'BNL-BNP Paribas',
            'Mediobanca',
            'UBI Banca',
            'Poste Italiane'
        ];

        return [
            'client_id' => Client::factory(),
            'bank_name' => fake()->randomElement($banks),
            'iban' => $this->generateItalianIBAN(),
            'payment_method' => fake()->randomElement(['bank_transfer', 'direct_debit', 'standing_order', 'cash', 'check']),
            'is_primary' => false,
        ];
    }

    /**
     * Generate Italian IBAN
     */
    private function generateItalianIBAN(): string
    {
        return 'IT' . fake()->numerify('##') . 'X' . fake()->numerify('##########') . 'X' . fake()->numerify('############');
    }

    /**
     * Mark banking as primary
     */
    public function primary(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_primary' => true,
        ]);
    }
}
