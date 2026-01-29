import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://localhost:27017/mastimeet';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_URI;

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  await mongoose.connect(mongoUri, {
    autoIndex: true
  });
};

export default connectDB;
