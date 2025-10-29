<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\ManagementContract;

class ManagementContracts extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info("Generating management contracts inside management_contracts database table");

        $this->command->info("Retrieving owner IDs");

        ManagementContract::factory(3)->create();

        $this->command->info("Management contracts created: " . ManagementContract::count());
    }
}
