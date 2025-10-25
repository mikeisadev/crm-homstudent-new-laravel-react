<?php

namespace Database\Factories;

use App\Models\Contract;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cancellation>
 */
class CancellationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cancellationDate = fake()->dateTimeBetween('-6 months', 'now');
        $noticeGivenDate = fake()->dateTimeBetween('-9 months', $cancellationDate);
        $effectiveDate = fake()->dateTimeBetween($cancellationDate, '+3 months');

        return [
            'contract_id' => Contract::factory(),
            'cancellation_date' => $cancellationDate,
            'requested_by' => fake()->randomElement(['client', 'owner', 'company']),
            'reason' => fake()->sentence(),
            'notice_given_date' => $noticeGivenDate,
            'effective_date' => $effectiveDate,
            'penalty_amount' => fake()->boolean(50) ? fake()->randomFloat(2, 100, 1000) : 0,
            'deposit_refund_amount' => fake()->randomFloat(2, 0, 2000),
            'notes' => fake()->boolean(60) ? fake()->paragraph() : null,
        ];
    }
}
