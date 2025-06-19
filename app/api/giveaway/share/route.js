
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Giveaway from "@/models/Giveaway";

export async function POST(request) {
  try {
    await connectDB();
    
    const { email } = await request.json();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Find the user's giveaway entry
    const entry = await Giveaway.findOne({ email });
    
    if (!entry) {
      return NextResponse.json(
        { success: false, message: "Entry not found" },
        { status: 404 }
      );
    }

    // Add 2 bonus entries for sharing
    entry.entries += 2;
    entry.referrals += 1;
    await entry.save();

    return NextResponse.json({
      success: true,
      message: "Thanks for sharing! You've earned 2 bonus entries.",
      totalEntries: entry.entries
    });

  } catch (error) {
    console.error("Share tracking error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
