import mongoose from 'mongoose';

// Directly hardcoding your URI to bypass local .env read issues
const MONGODB_URI = "mongodb+srv://anjanboro811_db_user:RGxFxXNTnnaSRXB3@cluster0.tkgi8ho.mongodb.net/portfolio?retryWrites=true&w=majority";

if (!MONGODB_URI || MONGODB_URI.includes("<username>")) {
  throw new Error('Please put your actual MongoDB connection string inside lib/mongodb.js');
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;