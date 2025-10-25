<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Contract;
use App\Models\Property;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Deposit>
 */
class DepositFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $propertyType = fake()->randomElement(['property', 'room']);
        $amount = fake()->randomFloat(2, 300, 2000);
        $isRefunded = fake()->boolean(40);

        $data = [
            'contract_id' => fake()->boolean(80) ? Contract::factory() : null,
            'client_id' => Client::factory(),
            'property_type' => $propertyType,
            'amount' => $amount,
            'payment_receipt' => fake()->boolean(70) ? fake()->regexify('REC-[0-9]{8}') : null,
            'refund_date' => $isRefunded ? fake()->dateTimeBetween('-6 months', 'now') : null,
            'refund_amount' => $isRefunded ? $amount * fake()->randomElement([0.8, 0.9, 1.0]) : null,
            'refund_notes' => $isRefunded ? fake()->sentence() : null,
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
