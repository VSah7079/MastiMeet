import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/mastimeet';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_URI;

  mongoose.connection.on('connected', () => {
    console.log('✓ MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('✗ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, not IPv6
    });
  } catch (err) {
    console.error('✗ Failed to connect to MongoDB at:', mongoUri);
    console.error('✗ Make sure MongoDB is running on 127.0.0.1:27017');
    throw err;
  }
};

export default connectDB;
