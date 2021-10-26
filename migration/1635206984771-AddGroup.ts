import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGroup1635206984771 implements MigrationInterface {
    name = 'AddGroup1635206984771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "owner_id" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_26d387f3e8de5b59428adbbc828" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_26d387f3e8de5b59428adbbc828"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "owner_id"`);
    }

}
