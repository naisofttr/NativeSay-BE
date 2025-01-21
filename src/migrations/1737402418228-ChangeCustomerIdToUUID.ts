import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCustomerIdToUUID1737402418228 implements MigrationInterface {
    name = 'ChangeCustomerIdToUUID1737402418228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, allow NULL values in prompts.customerId temporarily
        await queryRunner.query(`ALTER TABLE "prompts" DROP CONSTRAINT "FK_5722c56231bb0fceb9656e5e493"`);
        await queryRunner.query(`ALTER TABLE "prompts" ALTER COLUMN "customerId" DROP NOT NULL`);

        // Change customers.id to UUID
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "PK_133ec679a801fab5e070f73d3ea"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")`);

        // Change prompts.customerId to UUID and allow NULL temporarily
        await queryRunner.query(`ALTER TABLE "prompts" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD "customerId" uuid`);

        // Add foreign key constraint back
        await queryRunner.query(`ALTER TABLE "prompts" ADD CONSTRAINT "FK_5722c56231bb0fceb9656e5e493" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prompts" DROP CONSTRAINT "FK_5722c56231bb0fceb9656e5e493"`);
        await queryRunner.query(`ALTER TABLE "prompts" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "PK_133ec679a801fab5e070f73d3ea"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "customers" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD CONSTRAINT "FK_5722c56231bb0fceb9656e5e493" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
