<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration fixes the equipment table to properly distinguish between
     * room equipment and property equipment by adding a 'for_entity' column.
     * It also adds missing property equipment items (Divano, Poltrona).
     */
    public function up(): void
    {
        // Step 1: Add for_entity column (if it doesn't exist)
        if (!Schema::hasColumn('equipment', 'for_entity')) {
            Schema::table('equipment', function (Blueprint $table) {
                $table->enum('for_entity', ['room', 'property'])->default('room')->after('name');
            });
        }

        // Step 2: Update existing room equipment (items 1-23) to have for_entity='room'
        // These are already set by default, but let's be explicit
        $roomEquipmentNames = [
            'Armadio 2 ante',
            'Armadio 3 ante',
            'Armadio 4 ante',
            'Armadio 6 ante',
            'Letto matrimoniale',
            'Letto piazza e mezza',
            'Letto singolo',
            'Comodino',
            'Abat-jour comodino',
            'Lampada da terra',
            'Scrivania',
            'Lampada da studio',
            'Sedia',
            'Cassettiera',
            'Libreria',
            'Divano',
            'Tavolino',
            'Tenda',
            'Chromecast',
            'Poltroncina',
            'Piastra radiante',
            'Specchio',
            'Scarpiera',
        ];

        DB::table('equipment')
            ->whereIn('name', $roomEquipmentNames)
            ->update(['for_entity' => 'room']);

        // Step 3: Update existing property equipment (items 24-40) to have for_entity='property'
        $propertyEquipmentNames = [
            'Ascensore',
            'Cucina',
            'Forno',
            'Forno a microonde',
            'Frigorifero',
            'Lavastoviglie',
            'Lavatrice',
            'Macchinetta caffè',
            'Moka da caffè',
            'Padelle e pentole',
            'Piatti, posate e bicchieri',
            'Riscaldamento centralizzato',
            'Riscaldamento autonomo',
            'Stendibiancheria',
            'Tavolo con sedie',
            'Televisione',
            'Terrazzo',
        ];

        DB::table('equipment')
            ->whereIn('name', $propertyEquipmentNames)
            ->update(['for_entity' => 'property']);

        // Step 4: Add missing property equipment items
        // These were in the spec but not in the original seeding
        $missingPropertyEquipment = [
            ['key' => 'sofa_property', 'name' => 'Divano (immobile)', 'for_entity' => 'property', 'sort_order' => 41],
            ['key' => 'armchair', 'name' => 'Poltrona', 'for_entity' => 'property', 'sort_order' => 42],
        ];

        foreach ($missingPropertyEquipment as $equipment) {
            // Check if item already exists with this name and for_entity
            $exists = DB::table('equipment')
                ->where('name', $equipment['name'])
                ->where('for_entity', $equipment['for_entity'])
                ->exists();

            if (!$exists) {
                DB::table('equipment')->insert(array_merge($equipment, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the added equipment items
        DB::table('equipment')
            ->whereIn('name', ['Divano (immobile)', 'Poltrona'])
            ->where('for_entity', 'property')
            ->delete();

        // Drop the for_entity column
        Schema::table('equipment', function (Blueprint $table) {
            $table->dropColumn('for_entity');
        });
    }
};
