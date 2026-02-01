<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TestingType;
use App\Models\TestingCategory;

class TestingTypeSeeder extends Seeder
{
    public function run(): void
    {
        // Seed categories first
        $categoryFile = __DIR__ . '/data/testing_category_data.json';

        if (!file_exists($categoryFile)) {
            $this->command->warn("Testing category data file not found. Skipping...");
            return;
        }

        $categories = json_decode(file_get_contents($categoryFile), true);
        $categoryMap = [];

        foreach ($categories as $category) {
            $cat = TestingCategory::updateOrCreate(
                ['name' => $category['name']],
                ['name' => $category['name']]
            );
            $categoryMap[$category['code']] = $cat->id;
        }

        $this->command->info("Seeded " . count($categories) . " testing categories.");

        // Seed testing types
        $typeFile = __DIR__ . '/data/testing_type_data.json';

        if (!file_exists($typeFile)) {
            $this->command->warn("Testing type data file not found. Skipping...");
            return;
        }

        $data = json_decode(file_get_contents($typeFile), true);

        foreach ($data as $item) {
            TestingType::updateOrCreate(
                ['name' => $item['name']],
                [
                    'testing_category_id' => $categoryMap[$item['category_code']] ?? null,
                    'unit' => $item['unit'] ?? null,
                    'student_price' => $item['student_price'] ?? 0,
                    'lecturer_price' => $item['lecturer_price'] ?? 0,
                    'external_price' => $item['external_price'] ?? 0,
                ]
            );
        }

        $this->command->info("Seeded " . count($data) . " testing types.");
    }
}
