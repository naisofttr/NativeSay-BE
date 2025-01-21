import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1737463355658 implements MigrationInterface {
    name = 'InitialMigration1737463355658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "profilePhotoUrl" character varying, "refreshToken" character varying, "refreshTokenExpiryDate" TIMESTAMP, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prompts" ("id" SERIAL NOT NULL, "customerId" uuid NOT NULL, "text" text NOT NULL, "languageCode" character varying(50) NOT NULL, "servicePromptResponse" text NOT NULL, CONSTRAINT "PK_21f33798862975179e40b216a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD CONSTRAINT "FK_5722c56231bb0fceb9656e5e493" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prompts" DROP CONSTRAINT "FK_5722c56231bb0fceb9656e5e493"`);
        await queryRunner.query(`DROP TABLE "prompts"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
