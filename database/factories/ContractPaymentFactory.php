<?php

namespace Database\Factories;

use App\Models\Contract;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContractPayment>
 */
class ContractPaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dueDate = fake()->dateTimeBetween('-6 months', '+6 months');
        $paymentStatus = fake()->randomElement(['pending', 'paid', 'overdue', 'cancelled']);
        $amount = fake()->randomFloat(2, 200, 1000);

        // For paid status, generate paid_at date intelligently
        $paidAt = null;
        if ($paymentStatus === 'paid') {
            // If due date is in the past, paid between due date and now
            // If due date is in the future, paid between now and due date (early payment)
            if ($dueDate < new \DateTime()) {
                $paidAt = fake()->dateTimeBetween($dueDate, 'now');
            } else {
                $paidAt = fake()->dateTimeBetween('-1 month', $dueDate);
            }
        }

        return [
            'contract_id' => Contract::factory(),
            'due_date' => $dueDate,
            'amount' => $amount,
            'payment_status' => $paymentStatus,
            'paid_at' => $paidAt,
            'payment_method' => fake()->randomElement(['bank_transfer', 'cash', 'credit_card', 'direct_debit', 'check']),
            'transaction_reference' => fake()->boolean(60) ? fake()->regexify('[A-Z0-9]{12}') : null,
            'notes' => fake()->boolean(20) ? fake()->sentence() : null,
        ];
    }
}
