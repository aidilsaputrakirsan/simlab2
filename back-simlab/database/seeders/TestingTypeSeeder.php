<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TestingType;

class TestingTypeSeeder extends Seeder
{
    public function run(): void
    {
        $jsonFile = __DIR__ . '/data/testing_type_data.json';

        if (!file_exists($jsonFile)) {
            $this->command->warn("Testing type data file not found. Skipping...");
            return;
        }

        $data = json_decode(file_get_contents($jsonFile), true);

        foreach ($data as $item) {
            TestingType::updateOrCreate(
                ['name' => $item['pengujian']],
                [
                    'testing_category_id' => null, // Old data doesn't have categories
                    'unit' => null, // Old data doesn't have units
                    'student_price' => 0,
                    'lecturer_price' => 0,
                    'external_price' => 0,
                    'created_at' => $item['created_at'],
                    'updated_at' => $item['updated_at'],
                ]
            );
        }

        $this->command->info("Seeded " . count($data) . " testing types.");
    }
}
