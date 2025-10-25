<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Contract;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Penalty>
 */
class PenaltyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issueDate = fake()->dateTimeBetween('-6 months', 'now');
        $dueDate = fake()->dateTimeBetween($issueDate, '+30 days');
        $paymentStatus = fake()->randomElement(['pending', 'paid', 'waived', 'cancelled']);

        return [
            'contract_id' => fake()->boolean(80) ? Contract::factory() : null,
            'client_id' => Client::factory(),
            'penalty_type' => fake()->randomElement(['late_payment', 'damage', 'noise_complaint', 'rule_violation', 'early_termination', 'other']),
            'description' => fake()->sentence(),
            'amount' => fake()->randomFloat(2, 50, 500),
            'issue_date' => $issueDate,
            'due_date' => $dueDate,
            'paid_date' => $paymentStatus === 'paid' ? fake()->dateTimeBetween($issueDate, '+60 days') : null,
            'payment_status' => $paymentStatus,
            'notes' => fake()->boolean(40) ? fake()->paragraph() : null,
        ];
    }
}
