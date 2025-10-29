<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ManagementContract;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ManagementContract>
 */
class ManagementContractFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = fake()->numberBetween(2020, 2025);
        $sequentialNumber = fake()->numberBetween(1, 999);
        $startDate = fake()->dateTimeBetween('-1 year', '+6 months');
        $endDate = fake()->dateTimeBetween($startDate, '+2 years');
        $monthlyFee = fake()->randomFloat(2, 300, 1500);
        $statuses = ['active', 'expired', 'terminated'];

        $rawOwners = DB::table('owners')->select('id')->get()->toArray();
        $owners = array_map(fn ($data) => $data->id, $rawOwners);

        $data = [
            'property_id' => $owners[ array_rand($owners, 1) ],
            'contract_number' => 'Contratto ' . sprintf('%04d-%03d', $year, $sequentialNumber),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'monthly_fee' => $monthlyFee,
            'commission_percentage' => fake()->randomFloat(2, 5, 80),
            'status' => fake()->randomElement($statuses),
            'services_included' => fake()->company(),
            'notes' => fake()->paragraph()
        ];

        return $data;
    }
}
