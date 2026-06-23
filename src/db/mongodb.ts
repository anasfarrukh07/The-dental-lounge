import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase(): Promise<boolean> {
  if (isConnected) {
    return true;
  }

  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    console.warn(
      'DATABASE STATUS: No MONGODB_URI found in environment. Falling back to local high-performance file-based storage for live application demo.'
    );
    return false;
  }

  try {
    // Avoid re-connecting if already connection state is positive
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return true;
    }

    await mongoose.connect(mongodbUri, {
      serverSelectionTimeoutMS: 4000, // Quick timeout to prevent blocking startup
    });

    isConnected = true;
    console.log('✅ DATABASE STATUS: Connected successfully to MongoDB via Mongoose!');
    return true;
  } catch (error) {
    console.error('❌ DATABASE connection failed:', error instanceof Error ? error.message : error);
    console.warn('DATABASE STATUS: Reverting automatically to secure local file storage.');
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
