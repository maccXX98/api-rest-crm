import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
});

enum Role {
  ADMIN = 'administrator',
  MARKETING = 'marketing',
  SALES = 'sales',
}

interface User {
  UserID?: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  Photo?: Buffer;
  Role: Role;
  Username: string;
  Email: string;
  Password: string;
  createdAt?: Date;
}

async function seedSuperadmin() {
  if (process.env.NODE_ENV !== 'development') {
    console.log('⛔ Superadmin seeder only runs in development mode');
    process.exit(0);
  }

  console.warn('⚠️ WARNING: Running superadmin seeder in development mode');
  console.warn('⚠️ This will create/update a superadmin user');

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const repository = dataSource.getRepository('User');

    const existingAdmin = await repository.findOne({
      where: { Username: 'superadmin' },
    });

    const hashedPassword = await bcrypt.hash('SuperAdmin123!', 15);

    const superadmin: User = {
      FirstName: 'Super',
      LastName: 'Admin',
      Phone: '0000000000',
      Role: Role.ADMIN,
      Username: 'superadmin',
      Email: 'superadmin@crm.local',
      Password: hashedPassword,
    };

    if (existingAdmin) {
      superadmin.UserID = existingAdmin.UserID;
      await repository.save(superadmin);
      console.log('✅ Superadmin user updated');
    } else {
      await repository.save(superadmin);
      console.log('✅ Superadmin user created');
    }

    console.log('📋 Superadmin credentials:');
    console.log('   Username: superadmin');
    console.log('   Password: SuperAdmin123!');

    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seedSuperadmin();
