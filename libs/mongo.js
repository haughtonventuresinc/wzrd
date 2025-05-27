import { MongoClient } from "mongodb";

// This lib is used to connect to the database in next-auth and API routes
// Enhanced with better error handling and timeout protection for Vercel deployment

const uri = process.env.MONGODB_URI;

// Configure MongoDB connection options for better reliability
const options = {
  connectTimeoutMS: 10000, // 10 seconds connection timeout
  socketTimeoutMS: 30000,  // 30 seconds socket timeout
  serverSelectionTimeoutMS: 10000, // 10 seconds server selection timeout
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5,  // Maintain at least 5 socket connections
  retryWrites: true,
  retryReads: true,
};

let client;
let clientPromise;

if (!uri) {
  console.group("⚠️ MONGODB_URI missing from .env");
  console.error(
    "MongoDB URI is required for user authentication and data storage."
  );
  console.error(
    "Please add MONGODB_URI to your environment variables."
  );
  console.groupEnd();
  
  // Provide a dummy promise that rejects with a clear error
  clientPromise = Promise.reject(
    new Error("MongoDB URI is not configured. Please add MONGODB_URI to your environment variables.")
  );
} else {
  try {
    if (process.env.NODE_ENV === "development") {
      // In development, we want to reuse connections
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect()
          .catch(err => {
            console.error("Failed to connect to MongoDB:", err);
            throw err;
          });
      }
      clientPromise = global._mongoClientPromise;
    } else {
      // In production (Vercel), create a new connection
      client = new MongoClient(uri, options);
      clientPromise = client.connect()
        .catch(err => {
          console.error("Failed to connect to MongoDB in production:", err);
          throw err;
        });
    }
    
    // Add connection status logging
    clientPromise.then(() => {
      console.log("Successfully connected to MongoDB");
    }).catch(err => {
      console.error("MongoDB connection error:", err);
    });
  } catch (err) {
    console.error("Error setting up MongoDB connection:", err);
    clientPromise = Promise.reject(err);
  }
}

export default clientPromise;
