const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define User schema
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create User model
const User = mongoose.model('User', UserSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/orchideya_dv';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test authentication
const testAuth = async () => {
  try {
    // Find admin user
    const admin = await User.findOne({ email: 'admin@example.com' });
    
    if (!admin) {
      console.log('Admin user not found');
      return;
    }
    
    console.log('Admin user found:', admin.email);
    
    // Test password
    const isMatch = await admin.matchPassword('admin123');
    console.log('Password match:', isMatch);
    
    // Create admin user if it doesn't exist
    if (!isMatch) {
      console.log('Creating new admin user...');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // Update admin user
      admin.password = hashedPassword;
      await admin.save();
      
      console.log('Admin user updated with new password');
    }
  } catch (error) {
    console.error('Error testing authentication:', error);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await testAuth();
  process.exit(0);
};

run();
