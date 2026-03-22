import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1679512345678 implements MigrationInterface {
    name = 'InitialSchema1679512345678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure uuid extension is available
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // More defensive approach for PG enums
        await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_tier_enum') THEN
                    CREATE TYPE "public"."users_tier_enum" AS ENUM('FREE', 'PREMIUM');
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "apiKey" character varying NOT NULL,
                "tier" "public"."users_tier_enum" NOT NULL DEFAULT 'FREE',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_api_key" UNIQUE ("apiKey"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);

        // Seed with initial users
        await queryRunner.query(`
            INSERT INTO "users" ("name", "apiKey", "tier")
            VALUES 
                ('Free User', 'api_key_free_123', 'FREE'),
                ('Premium User', 'api_premium_free_123', 'PREMIUM')
            ON CONFLICT ("apiKey") DO NOTHING
        `);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_tier_enum"`);
    }
}
