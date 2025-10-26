<?php

namespace Database\Seeders;

use App\Models\Cancellation;
use App\Models\Client;
use App\Models\ClientAddress;
use App\Models\ClientBanking;
use App\Models\ClientContact;
use App\Models\ClientMeta;
use App\Models\Condominium;
use App\Models\Contract;
use App\Models\ContractPayment;
use App\Models\Deposit;
use App\Models\Invoice;
use App\Models\Owner;
use App\Models\Penalty;
use App\Models\Property;
use App\Models\PropertyOwner;
use App\Models\Proposal;
use App\Models\Room;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('Starting database seeding...');

        // Create or use existing admin user
        $user = User::firstOrCreate(
            ['email' => 'admin@crm-homstudent.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ]
        );

        $this->command->info($user->wasRecentlyCreated ? 'Created admin user' : 'Using existing admin user');

        // Step 1: Create base entities (no foreign key dependencies)
        $this->command->info('Creating clients...');
        $clients = Client::factory(50)->create();

        $this->command->info('Creating owners...');
        $owners = Owner::factory(20)->create();

        $this->command->info('Creating suppliers...');
        Supplier::factory(10)->create();

        $this->command->info('Creating condominiums...');
        $condominiums = Condominium::factory(5)->create();

        // Step 2: Create client-related data
        $this->command->info('Creating client metadata, addresses, contacts, and banking...');
        foreach ($clients as $client) {
            // Create 1-3 meta entries per client
            ClientMeta::factory(rand(1, 3))->create([
                'client_id' => $client->id,
            ]);

            // Create 1-2 addresses per client
            $addressCount = rand(1, 2);
            for ($i = 0; $i < $addressCount; $i++) {
                ClientAddress::factory()->create([
                    'client_id' => $client->id,
                    'is_primary' => $i === 0, // First address is primary
                ]);
            }

            // Create 1-2 contacts per client
            $contactCount = rand(1, 2);
            for ($i = 0; $i < $contactCount; $i++) {
                ClientContact::factory()->create([
                    'client_id' => $client->id,
                    'is_primary' => $i === 0, // First contact is primary
                ]);
            }

            // Create 0-1 banking entries per client
            if (rand(0, 1)) {
                ClientBanking::factory()->create([
                    'client_id' => $client->id,
                    'is_primary' => true,
                ]);
            }
        }

        // Step 3: Create properties (some with condominiums, some without)
        $this->command->info('Creating properties...');
        $properties = collect();

        // 20 properties with condominiums
        foreach ($condominiums as $condominium) {
            $propertyCount = rand(3, 6);
            for ($i = 0; $i < $propertyCount; $i++) {
                $properties->push(
                    Property::factory()->create([
                        'condominium_id' => $condominium->id,
                    ])
                );
            }
        }

        // 10 standalone properties (no condominium)
        for ($i = 0; $i < 10; $i++) {
            $properties->push(
                Property::factory()->create([
                    'condominium_id' => null,
                ])
            );
        }

        // Step 4: Create rooms for properties
        $this->command->info('Creating rooms...');
        $rooms = collect();
        foreach ($properties->random(25) as $property) {
            $roomCount = rand(1, 4);
            for ($i = 0; $i < $roomCount; $i++) {
                $rooms->push(
                    Room::factory()->create([
                        'property_id' => $property->id,
                    ])
                );
            }
        }

        // Step 5: Create property-owner relationships
        $this->command->info('Creating property-owner relationships...');
        foreach ($properties as $property) {
            $ownerCount = rand(1, 2);
            $selectedOwners = $owners->random($ownerCount);

            if ($ownerCount === 1) {
                // Single owner - 100% ownership
                PropertyOwner::create([
                    'property_id' => $property->id,
                    'owner_id' => $selectedOwners->first()->id,
                    'ownership_percentage' => 100,
                    'is_primary' => true,
                ]);
            } else {
                // Multiple owners - split ownership
                $ownership = 100 / $ownerCount;
                foreach ($selectedOwners as $index => $owner) {
                    PropertyOwner::create([
                        'property_id' => $property->id,
                        'owner_id' => $owner->id,
                        'ownership_percentage' => $ownership,
                        'is_primary' => $index === 0,
                    ]);
                }
            }
        }

        // Step 6: Create proposals
        $this->command->info('Creating proposals...');
        $proposals = collect();
        for ($i = 0; $i < 40; $i++) {
            $propertyType = rand(0, 1) ? 'property' : 'room';

            $proposalData = [
                'client_id' => $clients->random()->id,
                'property_type' => $propertyType,
            ];

            if ($propertyType === 'property') {
                $proposalData['property_id'] = $properties->random()->id;
                $proposalData['room_id'] = null;
            } else {
                $proposalData['property_id'] = null;
                $proposalData['room_id'] = $rooms->random()->id;
            }

            $proposals->push(Proposal::factory()->create($proposalData));
        }

        // Step 7: Create contracts
        $this->command->info('Creating contracts...');
        $contracts = collect();
        for ($i = 0; $i < 30; $i++) {
            $propertyType = ['condominium', 'property', 'room'][rand(0, 2)];

            $contractData = [
                'client_id' => $clients->random()->id,
                'property_type' => $propertyType,
                'proposal_id' => rand(0, 1) ? $proposals->random()->id : null,
                'secondary_client_id' => rand(0, 4) === 0 ? $clients->random()->id : null, // 20% chance of secondary client
            ];

            if ($propertyType === 'condominium') {
                $contractData['condominium_id'] = $condominiums->random()->id;
                $contractData['property_id'] = null;
                $contractData['room_id'] = null;
            } elseif ($propertyType === 'property') {
                $contractData['condominium_id'] = null;
                $contractData['property_id'] = $properties->random()->id;
                $contractData['room_id'] = null;
            } else {
                $contractData['condominium_id'] = null;
                $contractData['property_id'] = null;
                $contractData['room_id'] = $rooms->random()->id;
            }

            $contracts->push(Contract::factory()->create($contractData));
        }

        // Step 8: Create contract payments
        $this->command->info('Creating contract payments...');
        foreach ($contracts as $contract) {
            $paymentCount = rand(3, 12);
            for ($i = 0; $i < $paymentCount; $i++) {
                ContractPayment::factory()->create([
                    'contract_id' => $contract->id,
                ]);
            }
        }

        // Step 9: Create invoices for properties
        $this->command->info('Creating invoices...');
        foreach ($properties->random(20) as $property) {
            $invoiceCount = rand(2, 6);
            for ($i = 0; $i < $invoiceCount; $i++) {
                Invoice::factory()->create([
                    'property_id' => $property->id,
                ]);
            }
        }

        // Step 10: Create deposits
        $this->command->info('Creating deposits...');
        foreach ($contracts->random(20) as $contract) {
            $propertyType = rand(0, 1) ? 'property' : 'room';

            $depositData = [
                'contract_id' => $contract->id,
                'client_id' => $contract->client_id,
                'property_type' => $propertyType,
            ];

            if ($propertyType === 'property') {
                $depositData['property_id'] = $properties->random()->id;
                $depositData['room_id'] = null;
            } else {
                $depositData['property_id'] = null;
                $depositData['room_id'] = $rooms->random()->id;
            }

            Deposit::factory()->create($depositData);
        }

        // Step 11: Create cancellations for some contracts
        $this->command->info('Creating cancellations...');
        foreach ($contracts->random(10) as $contract) {
            Cancellation::factory()->create([
                'contract_id' => $contract->id,
            ]);
        }

        // Step 12: Create penalties
        $this->command->info('Creating penalties...');
        foreach ($contracts->random(15) as $contract) {
            $penaltyCount = rand(1, 2);
            for ($i = 0; $i < $penaltyCount; $i++) {
                Penalty::factory()->create([
                    'contract_id' => $contract->id,
                    'client_id' => $contract->client_id,
                ]);
            }
        }

        $this->command->info('Database seeding completed successfully!');
        $this->command->info('Summary:');
        $this->command->info('- Clients: ' . Client::count());
        $this->command->info('- Owners: ' . Owner::count());
        $this->command->info('- Suppliers: ' . Supplier::count());
        $this->command->info('- Condominiums: ' . Condominium::count());
        $this->command->info('- Properties: ' . Property::count());
        $this->command->info('- Rooms: ' . Room::count());
        $this->command->info('- Proposals: ' . Proposal::count());
        $this->command->info('- Contracts: ' . Contract::count());
        $this->command->info('- Contract Payments: ' . ContractPayment::count());
        $this->command->info('- Invoices: ' . Invoice::count());
        $this->command->info('- Deposits: ' . Deposit::count());
        $this->command->info('- Cancellations: ' . Cancellation::count());
        $this->command->info('- Penalties: ' . Penalty::count());
    }
}
