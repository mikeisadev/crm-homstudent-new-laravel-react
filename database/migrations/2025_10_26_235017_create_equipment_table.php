<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('key', 50)->unique();
            $table->string('name', 100);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('key');
            $table->index('sort_order');
        });

        // Seed predefined equipment items
        $equipmentItems = [
            ['key' => 'wardrobe_2_door', 'name' => 'Armadio 2 ante', 'sort_order' => 1],
            ['key' => 'wardrobe_3_door', 'name' => 'Armadio 3 ante', 'sort_order' => 2],
            ['key' => 'wardrobe_4_door', 'name' => 'Armadio 4 ante', 'sort_order' => 3],
            ['key' => 'wardrobe_6_door', 'name' => 'Armadio 6 ante', 'sort_order' => 4],
            ['key' => 'double_bed', 'name' => 'Letto matrimoniale', 'sort_order' => 5],
            ['key' => 'bed_half', 'name' => 'Letto piazza e mezza', 'sort_order' => 6],
            ['key' => 'single_bed', 'name' => 'Letto singolo', 'sort_order' => 7],
            ['key' => 'bedside_table', 'name' => 'Comodino', 'sort_order' => 8],
            ['key' => 'bedside_lamp', 'name' => 'Abat-jour comodino', 'sort_order' => 9],
            ['key' => 'floor_lamp', 'name' => 'Lampada da terra', 'sort_order' => 10],
            ['key' => 'desk', 'name' => 'Scrivania', 'sort_order' => 11],
            ['key' => 'desk_lamp', 'name' => 'Lampada da studio', 'sort_order' => 12],
            ['key' => 'chair', 'name' => 'Sedia', 'sort_order' => 13],
            ['key' => 'drawer_unit', 'name' => 'Cassettiera', 'sort_order' => 14],
            ['key' => 'bookcase', 'name' => 'Libreria', 'sort_order' => 15],
            ['key' => 'sofa', 'name' => 'Divano', 'sort_order' => 16],
            ['key' => 'table', 'name' => 'Tavolino', 'sort_order' => 17],
            ['key' => 'curtain', 'name' => 'Tenda', 'sort_order' => 18],
            ['key' => 'chromecast', 'name' => 'Chromecast', 'sort_order' => 19],
            ['key' => 'armchair', 'name' => 'Poltroncina', 'sort_order' => 20],
            ['key' => 'radiator_panel', 'name' => 'Piastra radiante', 'sort_order' => 21],
            ['key' => 'mirror', 'name' => 'Specchio', 'sort_order' => 22],
            ['key' => 'shoe_rack', 'name' => 'Scarpiera', 'sort_order' => 23],
        ];

        foreach ($equipmentItems as $item) {
            DB::table('equipment')->insert([
                'key' => $item['key'],
                'name' => $item['name'],
                'sort_order' => $item['sort_order'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
