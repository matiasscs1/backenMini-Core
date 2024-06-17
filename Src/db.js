import mongoose from 'mongoose';

async function connectDB() {
  console.log('Connecting to MongoDB');
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://matiaz490:1234@cluster0.jshz0m1.mongodb.net/medicaApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.log(err);
  }
}

export { connectDB };
