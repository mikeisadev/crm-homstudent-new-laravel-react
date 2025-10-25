<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Property;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Proposal>
 */
class ProposalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $propertyType = fake()->randomElement(['property', 'room']);
        $startDate = fake()->dateTimeBetween('now', '+3 months');
        $endDate = fake()->dateTimeBetween($startDate, '+2 years');
        $monthlyRent = fake()->randomFloat(2, 300, 1500);

        $data = [
            'proposal_number' => fake()->unique()->regexify('PROP-[0-9]{4}-[0-9]{4}'),
            'client_id' => Client::factory(),
            'property_type' => $propertyType,
            'proposal_type' => fake()->randomElement(['locazione', 'sublocazione', 'comodato']),
            'status' => fake()->randomElement(['draft', 'sent', 'accepted', 'rejected']),
            'proposed_start_date' => $startDate,
            'proposed_end_date' => $endDate,
            'monthly_rent' => $monthlyRent,
            'deposit_amount' => $monthlyRent * fake()->numberBetween(1, 3),
            'notes' => fake()->boolean(40) ? fake()->paragraph() : null,
        ];

        if ($propertyType === 'property') {
            $data['property_id'] = Property::factory();
            $data['room_id'] = null;
        } else {
            $data['property_id'] = null;
            $data['room_id'] = Room::factory();
        }

        return $data;
    }
}
