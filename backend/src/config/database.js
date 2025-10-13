import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Using a free MongoDB Atlas cluster that allows all IPs
    const uri = process.env.MONGODB_URI;
    
    console.log('🔄 Attempting to connect to MongoDB...');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000 // 10 second timeout
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
  }
};

export default connectDB;