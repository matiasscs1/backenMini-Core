import mongoose from 'mongoose';

async function connectDB() {
  console.log('Connecting to MongoDB');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.log(err);
  }
}

export { connectDB };
