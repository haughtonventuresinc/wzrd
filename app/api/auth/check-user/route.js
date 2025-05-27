import clientPromise from "@/libs/mongo";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email });

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

      const result = await usersCollection.insertOne(newUser);
      console.log(`Created new user with email: ${email}`);

      return NextResponse.json(
        { success: true, message: "User created successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
