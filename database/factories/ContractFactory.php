<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\Proposal;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contract>
 */
class ContractFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $propertyType = fake()->randomElement(['condominium', 'property', 'room']);
        $year = fake()->numberBetween(2020, 2025);
        $sequentialNumber = fake()->numberBetween(1, 999);
        $startDate = fake()->dateTimeBetween('-1 year', '+6 months');
        $endDate = fake()->dateTimeBetween($startDate, '+2 years');
        $monthlyRent = fake()->randomFloat(2, 300, 1500);

        $data = [
            'contract_number' => sprintf('%04d-%03d', $year, $sequentialNumber),
            'year' => $year,
            'sequential_number' => $sequentialNumber,
            'proposal_id' => fake()->boolean(60) ? Proposal::factory() : null,
            'client_id' => Client::factory(),
            'secondary_client_id' => fake()->boolean(20) ? Client::factory() : null,
            'property_type' => $propertyType,
            'contract_type' => fake()->randomElement(['locazione', 'sublocazione', 'comodato']),
            'status' => fake()->randomElement(['draft', 'active', 'ended', 'cancelled']),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'cancellation_notice_months' => fake()->randomElement([1, 2, 3]),
            'monthly_rent' => $monthlyRent,
            'deposit_amount' => $monthlyRent * fake()->numberBetween(1, 3),
            'entry_fee' => fake()->randomFloat(2, 0, 200),
            'deposit_refund_percentage' => fake()->randomElement([100, 90, 80]),
            'html_content' => fake()->boolean(50) ? '<html><body>Contract content here</body></html>' : null,
            'pdf_path' => fake()->boolean(40) ? 'contracts/' . fake()->uuid() . '.pdf' : null,
            'origin' => fake()->randomElement(['manual', 'proposal', 'import']),
        ];

        // Set property references based on type
        if ($propertyType === 'condominium') {
            $data['condominium_id'] = Condominium::factory();
            $data['property_id'] = null;
            $data['room_id'] = null;
        } elseif ($propertyType === 'property') {
            $data['condominium_id'] = null;
            $data['property_id'] = Property::factory();
            $data['room_id'] = null;
        } else { // room
            $data['condominium_id'] = null;
            $data['property_id'] = null;
            $data['room_id'] = Room::factory();
        }

        return $data;
    }
}
