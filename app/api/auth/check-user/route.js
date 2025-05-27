import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Simple MongoDB connection without complex timeout logic
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MONGODB_URI is not defined in environment variables");
      return NextResponse.json(
        { success: false, message: "Database configuration error" },
        { status: 500 }
      );
    }
    
    // Log the MongoDB URI (without sensitive parts)
    console.log("MongoDB URI format check:", uri.includes("mongodb+srv") ? "Using SRV format" : "Using standard format");
    
    // Ensure the URI has the correct TLS parameters for Vercel
    if (!uri.includes("tls=true") && !uri.includes("ssl=true")) {
      uri += uri.includes("?") ? "&tls=true&tlsAllowInvalidCertificates=true" : "?tls=true&tlsAllowInvalidCertificates=true";
      console.log("Added TLS parameters to MongoDB URI");
    }

    // Enhanced MongoDB connection options for Vercel
    const options = {
      connectTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 45000,  // Increased timeout
      serverSelectionTimeoutMS: 30000, // Increased timeout
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true, // For development/testing
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    console.log("MongoDB connection options set with TLS/SSL enabled");

    // Create a new client for each request (serverless pattern)
    const client = new MongoClient(uri, options);
    
    try {
      // Detailed connection logging
      console.log("Attempting to connect to MongoDB...");
      console.log("Node.js version:", process.version);
      console.log("Environment:", process.env.NODE_ENV);
      
      // Connect to the database with timeout
      const connectPromise = client.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB connection timeout after 20 seconds')), 20000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log("Successfully connected to MongoDB");
      
      // Get database and collection
      const db = client.db();
      console.log("Database connection established");
      
      const usersCollection = db.collection("users");
      console.log("Users collection accessed");

      // Check if user exists with detailed logging
      console.log(`Searching for user with email: ${email}`);
      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        console.log(`User found with email: ${email}`);
        console.log("User details (excluding sensitive data):", {
          id: existingUser._id?.toString(),
          emailVerified: existingUser.emailVerified,
          createdAt: existingUser.createdAt
        });
        
        await client.close();
        console.log("MongoDB connection closed successfully");
        
        return NextResponse.json(
          { success: true, message: "User exists" },
          { status: 200 }
        );
      } else {
        // Create a new user with detailed logging
        console.log(`User not found, creating new user with email: ${email}`);
        
        const newUser = {
          email,
          emailVerified: new Date(),
          createdAt: new Date(),
        };

        console.log("Attempting to insert new user...");
        const result = await usersCollection.insertOne(newUser);
        console.log(`Created new user with email: ${email}, ID: ${result.insertedId}`);

        await client.close();
        console.log("MongoDB connection closed successfully");
        
        return NextResponse.json(
          { success: true, message: "User created successfully" },
          { status: 201 }
        );
      }
    } catch (dbError) {
      // Detailed error logging
      console.error("Database operation error:", dbError);
      console.error("Error name:", dbError.name);
      console.error("Error message:", dbError.message);
      console.error("Error stack:", dbError.stack);
      
      if (dbError.code) {
        console.error("MongoDB error code:", dbError.code);
      }
      
      if (dbError.name === "MongoServerSelectionError") {
        console.error("Server selection error details:", dbError.reason);
      }
      
      // Close client if possible
      try {
        await client.close();
        console.log("MongoDB connection closed after error");
      } catch (closeError) {
        console.error("Error closing MongoDB client:", closeError);
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: "Database operation failed", 
          error: dbError.message,
          errorType: dbError.name,
          errorCode: dbError.code || "unknown"
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
