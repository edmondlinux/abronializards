
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Giveaway from "@/models/Giveaway";
import Newsletter from "@/models/Newsletter";
import nodemailer from "nodemailer";

const createEmailTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

const sendGiveawayConfirmationEmail = async (email, name) => {
  try {
    const transporter = createEmailTransport();

    const mailOptions = {
      from: {
        name: 'Abronia Lizards',
        address: process.env.GMAIL_USER
      },
      to: email,
      subject: '🎉 Giveaway Entry Confirmed - You\'re In!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0; font-size: 28px;">🎉 You're Entered to Win! 🦎</h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #059669, #0d9488); margin: 15px auto; border-radius: 2px;"></div>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
            <h2 style="color: #374151; margin-top: 0;">Hi ${name}!</h2>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              Your entry for our <strong style="color: #059669;">Abronia Lizard Giveaway</strong> has been confirmed! 
              You now have a chance to win one of our 4 beautiful species.
            </p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 25px 0;">
              <h3 style="color: #059669; margin-top: 0; margin-bottom: 15px;">🦎 Species Up for Grabs:</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Abronia Graminea (Green Arboreal Alligator Lizard)</li>
                <li style="margin-bottom: 8px;">Abronia Taeniata (Guatemalan Arboreal Lizard)</li>
                <li style="margin-bottom: 8px;">Abronia Mixteca (Mixtec Arboreal Lizard)</li>
                <li style="margin-bottom: 8px;">Abronia Oaxacae (Oaxacan Arboreal Lizard)</li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-weight: 600;">
                🚀 Want extra entries? Share this giveaway with friends for 2 bonus entries each!
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'}/abronia-care-sheet" 
                 style="display: inline-block; background: linear-gradient(90deg, #059669, #0d9488); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px;">
                📚 Care Guides
              </a>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'}/shop" 
                 style="display: inline-block; background: linear-gradient(90deg, #0d9488, #0891b2); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                🛒 Shop Now
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              We'll announce the winners via email within 48 hours. Good luck! 🍀
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Abronía Lizards. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Giveaway confirmation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending giveaway confirmation email:', error);
    return { success: false, error: error.message };
  }
};

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, name, source = 'giveaway' } = await request.json();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Please provide your name" },
        { status: 400 }
      );
    }

    // Check if already entered
    const existingEntry = await Giveaway.findOne({ email });
    
    if (existingEntry) {
      return NextResponse.json(
        { success: false, message: "You've already entered this giveaway!" },
        { status: 409 }
      );
    }

    // Create giveaway entry
    const newEntry = new Giveaway({
      email,
      name: name.trim(),
      source,
      entries: 1 // Base entry
    });

    await newEntry.save();

    // Also add to newsletter if not already subscribed
    try {
      const existingSubscriber = await Newsletter.findOne({ email });
      if (!existingSubscriber) {
        const newSubscriber = new Newsletter({
          email,
          source: 'giveaway'
        });
        await newSubscriber.save();
      }
    } catch (newsletterError) {
      console.log('Newsletter subscription error (non-critical):', newsletterError);
    }
    
    // Send confirmation email
    await sendGiveawayConfirmationEmail(email, name);

    return NextResponse.json({
      success: true,
      message: "Entry confirmed! Check your email for details. Good luck! 🍀"
    });

  } catch (error) {
    console.error("Giveaway entry error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
