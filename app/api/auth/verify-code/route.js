import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongo";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

/**
 * API route to verify a login code
 * This endpoint receives the email and verification code, and checks if they match
 */
export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Here we would verify the code against what was sent
    // For a real implementation, you'd need to store the codes in a database
    // with expiration times and validate against that
    
    // For now, we'll simulate a successful verification
    // In a real implementation, you would check the code against a stored value
    
    // Check if the user exists in the database, if not create them
    if (connectMongo) {
      const db = await connectMongo;
      const usersCollection = db.collection('users');
      
      // Check if user exists
      const existingUser = await usersCollection.findOne({ email });
      
      if (!existingUser) {
        // Create a new user if they don't exist
        await usersCollection.insertOne({
          email,
          emailVerified: new Date(),
          createdAt: new Date(),
        });
      }
    }
    
    // Return success with the user's email for the client to use in the sign-in process
    return NextResponse.json({ 
      success: true,
      email,
      // Generate a token that will be used for the sign-in process
      // In a real implementation, this would be securely generated and verified
      token: Buffer.from(`${email}:${Date.now()}`).toString('base64')
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying the code" },
      { status: 500 }
    );
  }
}
