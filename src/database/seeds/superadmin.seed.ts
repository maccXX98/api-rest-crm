import 'reflect-metadata';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Client } from 'pg';

config();

enum Role {
  ADMIN = 'administrator',
  MARKETING = 'marketing',
  SALES = 'sales',
}

async function seedSuperadmin() {
  if (process.env.NODE_ENV !== 'development') {
    console.log('⛔ Superadmin seeder only runs in development mode');
    process.exit(0);
  }

  console.warn('⚠️ WARNING: Running superadmin seeder in development mode');
  console.warn('⚠️ This will create/update a superadmin user');

  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    await client.connect();
    console.log('✅ Database connected');

    const hashedPassword = await bcrypt.hash('SuperAdmin123!', 15);

    // Check if user exists
    const existingResult = await client.query(
      'SELECT "UserID" FROM "user" WHERE "Username" = $1',
      ['superadmin'],
    );

    if (existingResult.rows.length > 0) {
      // Update existing user
      await client.query(
        `UPDATE "user" SET "FirstName" = $1, "LastName" = $2, "Phone" = $3, "Role" = $4, "Email" = $5, "Password" = $6 WHERE "Username" = $7`,
        [
          'Super',
          'Admin',
          '0000000000',
          Role.ADMIN,
          'superadmin@crm.local',
          hashedPassword,
          'superadmin',
        ],
      );
      console.log('✅ Superadmin user updated');
    } else {
      // Insert new user with UUID
      const { v4: uuidv4 } = await import('uuid');
      const userId = uuidv4();
      await client.query(
        `INSERT INTO "user" ("UserID", "FirstName", "LastName", "Phone", "Role", "Username", "Email", "Password")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          'Super',
          'Admin',
          '0000000000',
          Role.ADMIN,
          'superadmin',
          'superadmin@crm.local',
          hashedPassword,
        ],
      );
      console.log('✅ Superadmin user created');
    }

    console.log('📋 Superadmin credentials:');
    console.log('   Username: superadmin');
    console.log('   Password: SuperAdmin123!');

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    await client.end();
    process.exit(1);
  }
}

seedSuperadmin();
