import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomerTable1709912345678 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "customers",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "email",
                        type: "nvarchar",
                        length: "255",
                        isUnique: true
                    },
                    {
                        name: "name",
                        type: "nvarchar",
                        length: "255"
                    },
                    {
                        name: "profile_photo_url",
                        type: "nvarchar",
                        length: "max",
                        isNullable: true
                    },
                    {
                        name: "id_token",
                        type: "nvarchar",
                        length: "max"
                    },
                    {
                        name: "created_at",
                        type: "datetime2",
                        default: "GETDATE()"
                    },
                    {
                        name: "updated_at",
                        type: "datetime2",
                        default: "GETDATE()"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("customers");
    }
} 