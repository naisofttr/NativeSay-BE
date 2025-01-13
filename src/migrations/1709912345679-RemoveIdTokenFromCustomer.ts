import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIdTokenFromCustomer1709912345679 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE customers DROP COLUMN id_token`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE customers ADD id_token nvarchar(max)`);
    }
} 