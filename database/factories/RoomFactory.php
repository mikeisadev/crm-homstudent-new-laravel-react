<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $monthlyPrice = fake()->randomFloat(2, 250, 800);

        return [
            'property_id' => Property::factory(),
            'internal_code' => fake()->regexify('[A-Z][0-9]{2}'),
            'room_type' => fake()->randomElement(['single', 'double', 'triple', 'suite']),
            'surface_area' => fake()->numberBetween(12, 35),
            'monthly_price' => $monthlyPrice,
            'weekly_price' => $monthlyPrice / 4,
            'daily_price' => $monthlyPrice / 30,
            'minimum_stay_type' => fake()->randomElement(['days', 'weeks', 'months', 'years']),
            'minimum_stay_number' => fake()->numberBetween(1, 12),
            'deposit_amount' => $monthlyPrice * fake()->numberBetween(1, 3),
            'entry_fee' => fake()->randomFloat(2, 0, 200),
            'min_age' => fake()->randomElement([18, 18, 20, 21]),
            'max_age' => fake()->randomElement([0, 30, 35, 40]),
            'smoking_allowed' => fake()->boolean(20),
            'pets_allowed' => fake()->boolean(30),
            'musical_instruments_allowed' => fake()->boolean(40),
            'gender_preference' => fake()->randomElement(['male', 'female', 'couple', 'family', 'any']),
            'occupant_type' => fake()->randomElement(['student', 'worker', 'professional', 'any']),
            'has_double_bed' => fake()->boolean(50),
            'cancellation_notice_months' => fake()->randomElement([1, 2, 3]),
            'fiscal_regime' => fake()->randomElement(['ordinario', 'cedolare_secca']),
            'fiscal_rate' => fake()->randomElement([10, 21]),
            'is_published_web' => fake()->boolean(40),
            'availability_type' => fake()->randomElement(['available', 'occupied', 'forced_free', 'auto_from_contracts']),
            'available_from' => fake()->boolean(70) ? fake()->dateTimeBetween('now', '+3 months') : null,
            'notes' => fake()->boolean(30) ? fake()->paragraph() : null,
        ];
    }
}
