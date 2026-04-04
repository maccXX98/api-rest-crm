import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1774816349935 implements MigrationInterface {
  name = 'InitDB1774816349935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "Role"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('administrator', 'marketing', 'sales')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "Role" "public"."user_role_enum" NOT NULL DEFAULT 'sales'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_08af0d04ec2b0945ab7f6d71cb" ON "product_order" ("UserID") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ece50090cf7a0d8354fed3924b" ON "product_order" ("DistributorID") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b000857089edf6cae23b9bc9b8" ON "user" ("Username") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b7eee57d84fb7ed872e660197f" ON "user" ("Email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b7eee57d84fb7ed872e660197f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b000857089edf6cae23b9bc9b8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ece50090cf7a0d8354fed3924b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_08af0d04ec2b0945ab7f6d71cb"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "Role"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "Role" character varying(100) NOT NULL`,
    );
  }
}
