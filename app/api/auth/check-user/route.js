import clientPromise from "@/libs/mongo";
import { NextResponse } from "next/server";

// Helper function with timeout
const connectWithTimeout = async (timeoutMs = 5000) => {
  return Promise.race([
    clientPromise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MongoDB connection timeout')), timeoutMs)
    )
  ]);
};

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB with timeout
    const client = await connectWithTimeout();
    const db = client.db();
    const usersCollection = db.collection("users");

    // Check if user exists with timeout
    const findPromise = usersCollection.findOne({ email });
    const existingUser = await Promise.race([
      findPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB query timeout')), 3000)
      )
    ]);

    if (existingUser) {
      console.log(`User found with email: ${email}`);
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

      const insertPromise = usersCollection.insertOne(newUser);
      const result = await Promise.race([
        insertPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('MongoDB insert timeout')), 3000)
        )
      ]);
      
      console.log(`Created new user with email: ${email}`);

      return NextResponse.json(
        { success: true, message: "User created successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error checking/creating user:", error);
    
    // Check if it's a timeout error
    if (error.message && error.message.includes('timeout')) {
      return NextResponse.json(
        { success: false, message: "Database connection timed out. Please try again." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
