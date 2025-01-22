import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class ChangePromptIdToUuid1705913802000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable uuid-ossp extension if not already enabled
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create a temporary column for the new UUID values
        await queryRunner.query(`
            ALTER TABLE prompts 
            ADD COLUMN new_id uuid DEFAULT uuid_generate_v4()
        `);

        // Drop the primary key constraint (without assuming constraint name)
        await queryRunner.query(`
            DO $$
            BEGIN
                EXECUTE (
                    SELECT 'ALTER TABLE prompts DROP CONSTRAINT ' || quote_ident(conname)
                    FROM pg_constraint
                    WHERE conrelid = 'prompts'::regclass
                    AND contype = 'p'
                );
            END $$;
        `);

        // Drop the old id column
        await queryRunner.query(`
            ALTER TABLE prompts 
            DROP COLUMN id
        `);

        // Rename new_id to id
        await queryRunner.query(`
            ALTER TABLE prompts 
            RENAME COLUMN new_id TO id
        `);

        // Add primary key constraint to the new UUID column
        await queryRunner.query(`
            ALTER TABLE prompts 
            ADD PRIMARY KEY (id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Create a temporary column for the old numeric id
        await queryRunner.query(`
            ALTER TABLE prompts 
            ADD COLUMN old_id SERIAL
        `);

        // Drop the UUID primary key constraint (without assuming constraint name)
        await queryRunner.query(`
            DO $$
            BEGIN
                EXECUTE (
                    SELECT 'ALTER TABLE prompts DROP CONSTRAINT ' || quote_ident(conname)
                    FROM pg_constraint
                    WHERE conrelid = 'prompts'::regclass
                    AND contype = 'p'
                );
            END $$;
        `);

        // Drop the UUID column
        await queryRunner.query(`
            ALTER TABLE prompts 
            DROP COLUMN id
        `);

        // Rename old_id to id
        await queryRunner.query(`
            ALTER TABLE prompts 
            RENAME COLUMN old_id TO id
        `);

        // Add primary key constraint back to the numeric id
        await queryRunner.query(`
            ALTER TABLE prompts 
            ADD PRIMARY KEY (id)
        `);
    }
}
