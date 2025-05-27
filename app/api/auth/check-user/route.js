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
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MONGODB_URI is not defined in environment variables");
      return NextResponse.json(
        { success: false, message: "Database configuration error" },
        { status: 500 }
      );
    }

    // Basic MongoDB connection options
    const options = {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    };

    // Create a new client for each request (serverless pattern)
    const client = new MongoClient(uri, options);
    
    try {
      // Connect to the database
      await client.connect();
      console.log("Connected to MongoDB");
      
      const db = client.db();
      const usersCollection = db.collection("users");

      // Check if user exists
      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
        console.log(`User found with email: ${email}`);
        await client.close();
        return NextResponse.json(
          { success: true, message: "User exists" },
          { status: 200 }
        );
      } else {
        // Create a new user
        const newUser = {
          email,
          emailVerified: new Date(),
          createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);
        console.log(`Created new user with email: ${email}`);

        await client.close();
        return NextResponse.json(
          { success: true, message: "User created successfully" },
          { status: 201 }
        );
      }
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      await client.close().catch(e => console.error("Error closing client:", e));
      return NextResponse.json(
        { 
          success: false, 
          message: "Database operation failed", 
          error: dbError.message 
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
