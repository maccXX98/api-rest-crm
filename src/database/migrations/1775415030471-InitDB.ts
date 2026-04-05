import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1775415030471 implements MigrationInterface {
  name = 'InitDB1775415030471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" DROP CONSTRAINT "FK_2d4f1d84a1f7825c208aefca7ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" DROP CONSTRAINT "FK_5d49fc6e0d2f37c5ef96fe726d8"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_images" ("ProductImageID" SERIAL NOT NULL, "originalPath" character varying(500) NOT NULL, "whatsappPath" character varying(500) NOT NULL, "webPath" character varying(500) NOT NULL, "thumbPath" character varying(500) NOT NULL, "productId" integer, "productLinkId" integer, "jobId" integer, "originalSize" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0390ed82dbc871317729015f36d" PRIMARY KEY ("ProductImageID"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."message_logs_direction_enum" AS ENUM('INBOUND', 'OUTBOUND')`,
    );
    await queryRunner.query(
      `CREATE TABLE "message_logs" ("id" SERIAL NOT NULL, "direction" "public"."message_logs_direction_enum" NOT NULL, "phone" character varying(20) NOT NULL, "messageType" character varying(50) NOT NULL, "content" text, "waMessageId" character varying, "waMessageTimestamp" character varying, "rawPayload" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f0aae0d876a96fa1da0a1b97444" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15e5bb6a2e04b7f7bfa8aa3a32" ON "message_logs" ("phone") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_06fc964756eaf98576815abb6a" ON "message_logs" ("waMessageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fe9756d92d6c304eaf76f3890a" ON "message_logs" ("phone", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."conversations_currentstep_enum" AS ENUM('IDLE', 'AWAITING_CITY', 'AWAITING_PAYMENT', 'COMPLETED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" SERIAL NOT NULL, "phone" character varying(20) NOT NULL, "currentStep" "public"."conversations_currentstep_enum" NOT NULL DEFAULT 'IDLE', "lastProductId" integer, "lastWaMessageId" character varying, "lastWaMessageTimestamp" character varying, "metadata" jsonb, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4fe4d998cfc43d6044b24eb0ea" ON "conversations" ("phone") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e5d361f1b0cf0cc24d29927e4" ON "conversations" ("phone", "currentStep") `,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" DROP COLUMN "customerOrderCustomerOrderID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" DROP COLUMN "productProductID"`,
    );
    await queryRunner.query(`ALTER TABLE "city" ADD "variations" text`);
    await queryRunner.query(
      `ALTER TABLE "city" ADD "cashOnDelivery" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD "variations" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ALTER COLUMN "CustomerOrderID" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ALTER COLUMN "ProductID" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ADD CONSTRAINT "FK_35d580dbb351f54f28927ddce0c" FOREIGN KEY ("CustomerOrderID") REFERENCES "customer_order"("CustomerOrderID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ADD CONSTRAINT "FK_0d05e60ff76547c016c24861057" FOREIGN KEY ("ProductID") REFERENCES "product"("ProductID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD CONSTRAINT "FK_b367708bf720c8dd62fc6833161" FOREIGN KEY ("productId") REFERENCES "product"("ProductID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_images" DROP CONSTRAINT "FK_b367708bf720c8dd62fc6833161"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" DROP CONSTRAINT "FK_0d05e60ff76547c016c24861057"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" DROP CONSTRAINT "FK_35d580dbb351f54f28927ddce0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ALTER COLUMN "ProductID" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ALTER COLUMN "CustomerOrderID" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP COLUMN "variations"`,
    );
    await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "cashOnDelivery"`);
    await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "variations"`);
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ADD "productProductID" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ADD "customerOrderCustomerOrderID" integer`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e5d361f1b0cf0cc24d29927e4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4fe4d998cfc43d6044b24eb0ea"`,
    );
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(
      `DROP TYPE "public"."conversations_currentstep_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fe9756d92d6c304eaf76f3890a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_06fc964756eaf98576815abb6a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_15e5bb6a2e04b7f7bfa8aa3a32"`,
    );
    await queryRunner.query(`DROP TABLE "message_logs"`);
    await queryRunner.query(`DROP TYPE "public"."message_logs_direction_enum"`);
    await queryRunner.query(`DROP TABLE "product_images"`);
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ADD CONSTRAINT "FK_5d49fc6e0d2f37c5ef96fe726d8" FOREIGN KEY ("productProductID") REFERENCES "product"("ProductID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_order_detail" ADD CONSTRAINT "FK_2d4f1d84a1f7825c208aefca7ce" FOREIGN KEY ("customerOrderCustomerOrderID") REFERENCES "customer_order"("CustomerOrderID") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
