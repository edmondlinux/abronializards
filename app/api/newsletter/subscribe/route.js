
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
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

const sendWelcomeEmail = async (email) => {
  try {
    const transporter = createEmailTransport();

    const mailOptions = {
      from: {
        name: 'Abronia Lizards',
        address: process.env.GMAIL_USER
      },
      to: email,
      subject: 'Welcome to Abronia Lizards Newsletter! 🦎',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0; font-size: 28px;">Welcome to Abronia Lizards! 🦎</h1>
            <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #059669, #0d9488); margin: 15px auto; border-radius: 2px;"></div>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
            <h2 style="color: #374151; margin-top: 0;">Thank you for subscribing!</h2>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              Welcome to our community of <strong style="color: #059669;">Abronía</strong> enthusiasts! You're now part of an exclusive group that will receive:
            </p>
            
            <div style="margin: 25px 0;">
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #059669;">
                <span style="margin-right: 10px; font-size: 18px;">🦎</span>
                <span style="color: #374151; font-weight: 500;">Expert care tips and guides</span>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #059669;">
                <span style="margin-right: 10px; font-size: 18px;">🎁</span>
                <span style="color: #374151; font-weight: 500;">Exclusive offers and discounts (20% off your first purchase!)</span>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #059669;">
                <span style="margin-right: 10px; font-size: 18px;">📚</span>
                <span style="color: #374151; font-weight: 500;">Latest discoveries and species updates</span>
              </div>
              
              <div style="display: flex; align-items: center; padding: 12px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #059669;">
                <span style="margin-right: 10px; font-size: 18px;">🛒</span>
                <span style="color: #374151; font-weight: 500;">New product announcements</span>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'}" 
                 style="display: inline-block; background: linear-gradient(90deg, #059669, #0d9488); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;">
                Explore Our Shop
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              Keep an eye on your inbox for weekly updates! You can unsubscribe at any time by clicking the unsubscribe link in our emails.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Abronía Lizards. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, source = 'newsletter' } = await request.json();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { success: false, message: "This email is already subscribed to our newsletter" },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.source = source;
        await existingSubscriber.save();
        
        await sendWelcomeEmail(email);
        
        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated."
        });
      }
    }

    // Create new subscription
    const newSubscriber = new Newsletter({
      email,
      source
    });

    await newSubscriber.save();
    
    // Send welcome email
    await sendWelcomeEmail(email);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! Check your email for a welcome message."
    });

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
