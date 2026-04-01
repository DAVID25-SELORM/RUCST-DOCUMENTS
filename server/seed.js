// Database seeder for creating sample users
// Run with: node server/seed.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/regent_dms';

// User Schema (simplified for seeding)
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  department: String,
  role: String,
  isActive: Boolean,
});

const User = mongoose.model('User', userSchema);

const users = [
  {
    firstName: 'Registry',
    lastName: 'Admin',
    email: 'registry@regent.edu',
    password: 'registry123',
    department: 'registry',
    role: 'admin',
    isActive: true,
  },
  {
    firstName: 'Accounts',
    lastName: 'Admin',
    email: 'accounts@regent.edu',
    password: 'accounts123',
    department: 'accounts',
    role: 'admin',
    isActive: true,
  },
  {
    firstName: 'Quality',
    lastName: 'Assurance',
    email: 'qa@regent.edu',
    password: 'qa123',
    department: 'quality_assurance',
    role: 'admin',
    isActive: true,
  },
  {
    firstName: 'President',
    lastName: 'Office',
    email: 'president@regent.edu',
    password: 'president123',
    department: 'presidency',
    role: 'admin',
    isActive: true,
  },
  {
    firstName: 'VP',
    lastName: 'Academics',
    email: 'vpacademics@regent.edu',
    password: 'vpacademics123',
    department: 'vp_academics',
    role: 'admin',
    isActive: true,
  },
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@regent.edu',
    password: 'superadmin123',
    department: 'admin',
    role: 'super_admin',
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert users
    await User.insertMany(hashedUsers);
    console.log(`✅ Created ${hashedUsers.length} users successfully!`);

    console.log('\n📋 Login Credentials:');
    console.log('-'.repeat(50));
    users.forEach((user) => {
      console.log(`Department: ${user.department}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('-'.repeat(50));
    });

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

seedDatabase();
