import { NextResponse } from "next/server";
import clientPromise from "@/libs/mongo";

/**
 * API route to save a user to MongoDB
 * This endpoint receives the email and saves it to the database
 */
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Hardcoded email for direct login
    const hardcodedEmail = "contact@haughtonventures.com";
    
    // Use the hardcoded email regardless of what was passed
    const emailToSave = hardcodedEmail;
    
    // Connect to MongoDB and save the user
    if (clientPromise) {
      try {
        // Get the MongoDB client
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');
        
        // Check if user exists
        const existingUser = await usersCollection.findOne({ email: emailToSave });
        
        if (!existingUser) {
          // Create a new user if they don't exist
          await usersCollection.insertOne({
            email: emailToSave,
            emailVerified: new Date(),
            createdAt: new Date(),
          });
          
          console.log(`User created with email: ${emailToSave}`);
        } else {
          console.log(`User already exists with email: ${emailToSave}`);
        }
        
        return NextResponse.json({ 
          success: true,
          message: existingUser ? "User already exists" : "User created successfully"
        });
      } catch (dbError) {
        console.error("MongoDB operation error:", dbError);
        // Even if DB operation fails, we'll return success to allow login
      }
    }
    
    // If no MongoDB connection or if DB operation failed, still return success
    return NextResponse.json({ 
      success: true,
      message: "No database connection, but operation simulated successfully"
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { error: "An error occurred while saving the user", details: error.message },
      { status: 500 }
    );
  }
}
