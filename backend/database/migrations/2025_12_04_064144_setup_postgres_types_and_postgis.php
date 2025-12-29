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

        // ENUM types

DB::statement("DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
      CREATE TYPE verification_status AS ENUM ('pending','verified','rejected');
   END IF;
END$$;");
       // DB::statement("CREATE TYPE verification_status AS ENUM ('pending','verified','rejected');");
       DB::statement("DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
      CREATE TYPE account_status AS ENUM ('active','suspended','flagged');
   END IF;
END$$;");
       // DB::statement("CREATE TYPE account_status AS ENUM ('active','suspended','flagged');");
       DB::statement("DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
      CREATE TYPE report_status AS ENUM ('pending','resolved','dismissed');
   END IF;
END$$;");
      //  DB::statement("CREATE TYPE report_status AS ENUM ('pending','resolved','dismissed');");
      DB::statement("DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_type') THEN
      CREATE TYPE report_type AS ENUM ('wrong_availability','wrong_location','wrong_contact','other');
   END IF;
END$$;");
      // DB::statement("CREATE TYPE report_type AS ENUM ('wrong_availability','wrong_location','wrong_contact','other');");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP TYPE IF EXISTS user_role;");
        DB::statement('DROP TYPE IF EXISTS verification_status;');
        DB::statement('DROP TYPE IF EXISTS account_status;');
        DB::statement('DROP TYPE IF EXISTS report_status;');
        DB::statement('DROP TYPE IF EXISTS report_type;');

    }
};
