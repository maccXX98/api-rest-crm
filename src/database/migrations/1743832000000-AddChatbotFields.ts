import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChatbotFields1743832000000 implements MigrationInterface {
  name = 'AddChatbotFields1743832000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // City.variations
    await queryRunner.query(`ALTER TABLE "city" ADD "variations" text`);
    await queryRunner.query(
      `ALTER TABLE "city" ADD "cashOnDelivery" boolean DEFAULT false`,
    );

    // PaymentMethod.variations
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD "variations" text`,
    );

    // conversations table
    await queryRunner.query(`
      CREATE TABLE "conversations" (
        "id" SERIAL PRIMARY KEY,
        "phone" VARCHAR(20) NOT NULL,
        "currentStep" VARCHAR(50) NOT NULL DEFAULT 'IDLE',
        "lastProductId" INT NULL,
        "lastWaMessageId" VARCHAR(255) NULL,
        "lastWaMessageTimestamp" VARCHAR(255) NULL,
        "metadata" JSONB NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "conversations_phone_currentStep_idx" ON "conversations" ("phone", "currentStep")`,
    );

    // message_logs table
    await queryRunner.query(`
      CREATE TABLE "message_logs" (
        "id" SERIAL PRIMARY KEY,
        "direction" VARCHAR(20) NOT NULL,
        "phone" VARCHAR(20) NOT NULL,
        "messageType" VARCHAR(50) NOT NULL,
        "content" TEXT NULL,
        "waMessageId" VARCHAR(255) NULL,
        "waMessageTimestamp" VARCHAR(255) NULL,
        "rawPayload" JSONB NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "message_logs_phone_createdAt_idx" ON "message_logs" ("phone", "createdAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "message_logs_waMessageId_idx" ON "message_logs" ("waMessageId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "message_logs"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP COLUMN "variations"`,
    );
    await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "cashOnDelivery"`);
    await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "variations"`);
  }
}
