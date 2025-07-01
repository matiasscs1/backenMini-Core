import mongoose from 'mongoose';

async function connectDB() {
  console.log('Connecting to MongoDB');
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://matiaz490:1234@terranovaconect.m881eys.mongodb.net/MiniCore?retryWrites=true&w=majority&appName=terranovaConect', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.log(err);
  }
}

export { connectDB };
