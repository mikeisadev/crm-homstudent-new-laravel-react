<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issueDate = fake()->dateTimeBetween('-1 year', 'now');
        $dueDate = fake()->dateTimeBetween($issueDate, '+30 days');
        $isPaid = fake()->boolean(60);

        return [
            'property_id' => Property::factory(),
            'invoice_type' => fake()->randomElement(['condominium_fees', 'utilities', 'maintenance', 'insurance', 'tax', 'other']),
            'invoice_number' => fake()->unique()->numerify('INV-####-####'),
            'issue_date' => $issueDate,
            'due_date' => $dueDate,
            'months_covered' => fake()->numberBetween(1, 12),
            'amount' => fake()->randomFloat(2, 50, 2000),
            'description' => fake()->sentence(),
            'payment_date' => $isPaid ? fake()->dateTimeBetween($issueDate, '+60 days') : null,
            'payment_method' => $isPaid ? fake()->randomElement(['bank_transfer', 'cash', 'check', 'direct_debit']) : null,
            'file_path' => fake()->boolean(50) ? 'invoices/' . fake()->uuid() . '.pdf' : null,
        ];
    }
}
