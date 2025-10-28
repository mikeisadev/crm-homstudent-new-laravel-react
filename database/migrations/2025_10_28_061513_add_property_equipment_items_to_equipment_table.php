<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds property-specific equipment items to the shared equipment table
     */
    public function up(): void
    {
        // Get the highest sort_order from existing equipment items
        $maxSortOrder = DB::table('equipment')->max('sort_order') ?? 0;

        // Property equipment items (distinct from room equipment)
        $propertyEquipmentItems = [
            ['key' => 'elevator', 'name' => 'Ascensore'],
            ['key' => 'kitchen', 'name' => 'Cucina'],
            ['key' => 'oven', 'name' => 'Forno'],
            ['key' => 'microwave', 'name' => 'Forno a microonde'],
            ['key' => 'refrigerator', 'name' => 'Frigorifero'],
            ['key' => 'dishwasher', 'name' => 'Lavastoviglie'],
            ['key' => 'washing_machine', 'name' => 'Lavatrice'],
            ['key' => 'coffee_machine', 'name' => 'Macchinetta caffè'],
            ['key' => 'moka_pot', 'name' => 'Moka da caffè'],
            ['key' => 'pans_and_pots', 'name' => 'Padelle e pentole'],
            ['key' => 'plates_cutlery_glasses', 'name' => 'Piatti, posate e bicchieri'],
            ['key' => 'central_heating', 'name' => 'Riscaldamento centralizzato'],
            ['key' => 'autonomous_heating', 'name' => 'Riscaldamento autonomo'],
            ['key' => 'drying_rack', 'name' => 'Stendibiancheria'],
            ['key' => 'table_with_chairs', 'name' => 'Tavolo con sedie'],
            ['key' => 'television', 'name' => 'Televisione'],
            ['key' => 'terrace', 'name' => 'Terrazzo'],
        ];

        foreach ($propertyEquipmentItems as $index => $item) {
            // Check if equipment item already exists
            $exists = DB::table('equipment')->where('key', $item['key'])->exists();

            if (!$exists) {
                DB::table('equipment')->insert([
                    'key' => $item['key'],
                    'name' => $item['name'],
                    'sort_order' => $maxSortOrder + $index + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove property equipment items
        $propertyEquipmentKeys = [
            'elevator', 'kitchen', 'oven', 'microwave', 'refrigerator',
            'dishwasher', 'washing_machine', 'coffee_machine', 'moka_pot',
            'pans_and_pots', 'plates_cutlery_glasses', 'central_heating',
            'autonomous_heating', 'drying_rack', 'table_with_chairs',
            'television', 'terrace'
        ];

        DB::table('equipment')->whereIn('key', $propertyEquipmentKeys)->delete();
    }
};
