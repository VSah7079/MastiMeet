import dotenv from 'dotenv';
import path from 'path';
import connectDB from '../db.js';
import User from '../models/User.js';

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

const emailArg = process.argv[2];
const adminEmail = emailArg || process.env.ADMIN_EMAIL;

if (!adminEmail) {
  console.error('Missing admin email. Usage: node scripts/setAdmin.js user@example.com');
  process.exit(1);
}

const promote = async () => {
  try {
    await connectDB();

    const user = await User.findOne({ email: String(adminEmail).toLowerCase() });
    if (!user) {
      console.error(`User not found for email: ${adminEmail}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Admin role assigned to ${user.email}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to set admin role:', err);
    process.exit(1);
  }
};

promote();
