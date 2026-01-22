<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\StudyProgram;
use Illuminate\Database\Seeder;

class DosenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Loading dosen data from JSON...');

        $jsonPath = database_path('seeders/data/dosen_data.json');
        if (!file_exists($jsonPath)) {
            $this->command->error("File dosen_data.json not found!");
            return;
        }

        $dosens = json_decode(file_get_contents($jsonPath), true);
        $studyPrograms = StudyProgram::pluck('id', 'name')->toArray();

        foreach ($dosens as $dosen) {
            // Validate essential data
            if (empty($dosen['email']) || empty($dosen['name']))
                continue;

            $prodiName = $dosen['prodi'];

            // Handle inconsistent naming if any (though parser handled map)
            // Fuzzy match or exact match from parser map
            $studyProgramId = $studyPrograms[$prodiName] ?? null;

            if (!$studyProgramId) {
                // Try finding by LIKE query if not found in cache (fallback)
                $sp = StudyProgram::where('name', 'LIKE', "%$prodiName%")->first();
                $studyProgramId = $sp?->id;
            }

            User::updateOrCreate(
                ['email' => $dosen['email']],
                [
                    'name' => $dosen['name'],
                    'email' => $dosen['email'],
                    'password' => bcrypt('123123'), // Default password
                    'role' => 'dosen',
                    'identity_num' => $dosen['nip'],
                    'study_program_id' => $studyProgramId,
                    'institution_id' => null,
                    'is_manager' => false,
                    'is_active' => 'Active',
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('Dosen seeding completed: ' . count($dosens) . ' records processed.');
    }
}
