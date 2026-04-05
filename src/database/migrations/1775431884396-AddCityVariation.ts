import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCityVariation1775431884396 implements MigrationInterface {
    name = 'AddCityVariation1775431884396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "city_variation" ("id" SERIAL NOT NULL, "variation" character varying(50) NOT NULL, "city_id" integer NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_038f0d1115bbbd2b41856d05e1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e446a097c74c3df93666119115" ON "city_variation" ("variation") `);
        await queryRunner.query(`ALTER TABLE "city_variation" ADD CONSTRAINT "FK_6f8b4a58bc2dc13164bead90713" FOREIGN KEY ("city_id") REFERENCES "city"("CityID") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "city_variation" DROP CONSTRAINT "FK_6f8b4a58bc2dc13164bead90713"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e446a097c74c3df93666119115"`);
        await queryRunner.query(`DROP TABLE "city_variation"`);
    }

}
