<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('testing_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->onDelete('cascade');
            $table->foreignId('requestor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('laboran_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->char('phone_number', 14);
            $table->string('activity_name');
            $table->string('supervisor')->nullable();
            $table->string('supervisor_email')->nullable();
            $table->dateTime('testing_time');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'revision']);
            $table->text('information');
            $table->string('result_file');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testing_request');
    }
};
