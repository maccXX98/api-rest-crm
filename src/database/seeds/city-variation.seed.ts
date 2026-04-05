import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database');

  // Insert city variations
  await AppDataSource.query(`
    INSERT INTO "city_variation" ("variation", "city_id") VALUES 
      ('lp', 1), ('lpz', 1), ('paz', 1), ('lapaz', 1), ('pax', 1), ('lapax', 1),
      ('alto', 4), ('ea', 4), ('delalto', 4), ('elalto', 4),
      ('scz', 3), ('sc', 3), ('cruz', 3), ('santa', 3), ('stcruz', 3), ('santacruz', 3), ('sta', 3), ('stc', 3),
      ('cocha', 2), ('cochabamba', 2), ('cbb', 2), ('cbba', 2)
  `);
  console.log('Inserted city variations');

  // Update cashOnDelivery for La Paz, El Alto, Santa Cruz, Cochabamba
  await AppDataSource.query(`
    UPDATE "city" SET "cashOnDelivery" = true WHERE "CityID" IN (1, 2, 3, 4)
  `);
  console.log('Updated cashOnDelivery');

  await AppDataSource.destroy();
  console.log('Done!');
}

seed().catch(console.error);
