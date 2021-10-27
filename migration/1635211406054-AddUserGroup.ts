import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserGroup1635211406054 implements MigrationInterface {
    name = 'AddUserGroup1635211406054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_group" ("priveleges" character varying NOT NULL, "user_id" uuid NOT NULL, "group_id" uuid NOT NULL, CONSTRAINT "PK_bd332ba499e012f8d20905f8061" PRIMARY KEY ("user_id", "group_id"))`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_26d387f3e8de5b59428adbbc828"`);
        await queryRunner.query(`ALTER TABLE "group" ALTER COLUMN "owner_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_26d387f3e8de5b59428adbbc828" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_26d387f3e8de5b59428adbbc828"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_3d6b372788ab01be58853003c93"`);
        await queryRunner.query(`ALTER TABLE "group" ALTER COLUMN "owner_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_26d387f3e8de5b59428adbbc828" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "user_group"`);
    }

}
