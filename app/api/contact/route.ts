import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email template for contact form
const createEmailTemplate = (formData: any) => {
  const { name, email, phone, subject, interest, message } = formData;

  return {
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3DD56D, #2bb757); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #2bb757; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #3DD56D; }
            .footer { margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 4px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 New Contact Form Submission</h1>
              <p>GREAN WORLD Energy Technology PLC</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Full Name:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email Address:</div>
                <div class="value">${email}</div>
              </div>
              
              ${
                phone
                  ? `
              <div class="field">
                <div class="label">📱 Phone Number:</div>
                <div class="value">${phone}</div>
              </div>
              `
                  : ""
              }
              
              <div class="field">
                <div class="label">📋 Subject:</div>
                <div class="value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="label">🎯 Interest Area:</div>
                <div class="value">${interest}</div>
              </div>
              
              <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value">${message}</div>
              </div>
              
              <div class="footer">
                <p><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>🌐 Source:</strong> GREAN WORLD Website Contact Form</p>
                <p><strong>⚡ Action Required:</strong> Please respond within 24 hours as promised to the customer.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Contact Form Submission - GREAN WORLD Energy Technology PLC

Full Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
Subject: ${subject}
Interest Area: ${interest}

Message:
${message}

Submitted: ${new Date().toLocaleString()}
Source: GREAN WORLD Website Contact Form
Action Required: Please respond within 24 hours as promised to the customer.
    `,
  };
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let formData;
    try {
      formData = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid request format. Please try again." },
        { status: 400 },
      );
    }

    // Extract and validate required fields
    const { name, email, subject, interest, message, phone } = formData;

    // Detailed field validation
    const errors: string[] = [];

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!email || typeof email !== "string") {
      errors.push("Email is required");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push("Please enter a valid email address");
      }
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      errors.push("Subject must be at least 3 characters long");
    }

    if (!interest || typeof interest !== "string") {
      errors.push("Please select what you are interested in");
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      errors.push("Message must be at least 10 characters long");
    }

    // Validate phone if provided
    if (phone && typeof phone === "string" && phone.trim().length > 0) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
      if (!phoneRegex.test(phone.trim())) {
        errors.push("Please enter a valid phone number");
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: `Validation failed: ${errors.join(", ")}` },
        { status: 400 },
      );
    }

    // Check for spam/suspicious content
    const suspiciousPatterns = [
      /https?:\/\//gi, // URLs
      /\b(viagra|casino|lottery|winner|congratulations)\b/gi, // Common spam words
      /(.)\1{10,}/gi, // Repeated characters
    ];

    const fullText = `${name} ${email} ${subject} ${message}`.toLowerCase();
    const isSuspicious = suspiciousPatterns.some((pattern) =>
      pattern.test(fullText),
    );

    if (isSuspicious) {
      console.warn("Suspicious form submission detected:", {
        email,
        name,
        subject,
      });
      return NextResponse.json(
        {
          error:
            "Message appears to contain suspicious content. Please contact us directly if this is a legitimate inquiry.",
        },
        { status: 400 },
      );
    }

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration missing");
      return NextResponse.json(
        {
          error:
            "Email service is temporarily unavailable. Please contact us directly at info@greanworld.com",
        },
        { status: 500 },
      );
    }

    // Create email transporter
    let transporter;
    try {
      transporter = createTransporter();
      // Verify transporter configuration
      await transporter.verify();
    } catch (verifyError) {
      console.error("Email transporter verification failed:", verifyError);
      return NextResponse.json(
        {
          error:
            "Email service configuration error. Please contact us directly at info@greanworld.com",
        },
        { status: 500 },
      );
    }

    // Sanitize data for email
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      subject: subject.trim(),
      interest: interest.trim(),
      message: message.trim(),
    };

    // Create email content
    const emailTemplate = createEmailTemplate(sanitizedData);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@greanworld.com",
      to: process.env.EMAIL_TO || "info@greanworld.com",
      replyTo: sanitizedData.email,
      subject: `${process.env.EMAIL_SUBJECT_PREFIX || "[GREAN WORLD Contact]"} ${sanitizedData.subject} - ${sanitizedData.interest}`,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    // Send email to team
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to send email to team:", emailError);
      return NextResponse.json(
        {
          error:
            "Failed to send message to our team. Please try again or contact us directly at info@greanworld.com",
        },
        { status: 500 },
      );
    }

    // Send auto-reply to customer
    const autoReplyOptions = {
      from: process.env.EMAIL_FROM || "noreply@greanworld.com",
      to: sanitizedData.email,
      subject: "Thank you for contacting GREAN WORLD Energy Technology PLC",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Thank You - GREAN WORLD</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3DD56D, #2bb757); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
              .highlight { background: #e8f5e8; padding: 15px; border-radius: 4px; border-left: 4px solid #3DD56D; margin: 15px 0; }
              .contact-info { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🌱 Thank You for Contacting Us!</h1>
                <p>GREAN WORLD Energy Technology PLC</p>
              </div>
              <div class="content">
                <p>Dear ${sanitizedData.name},</p>

                <p>Thank you for your interest in <strong>${sanitizedData.interest}</strong>. We have received your message and our team will get back to you within 24 hours.</p>

                <div class="highlight">
                  <h3>📋 Your Submission Summary:</h3>
                  <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
                  <p><strong>Interest:</strong> ${sanitizedData.interest}</p>
                  <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                </div>

                <p>In the meantime, feel free to explore our website to learn more about our sustainable energy solutions.</p>

                <div class="contact-info">
                  <h3>📞 Contact Information:</h3>
                  <p><strong>Phone:</strong> (+251) 913 330000 | (+251) 910 212989</p>
                  <p><strong>Email:</strong> info@greanworld.com | sileshi@greanworld.com</p>
                  <p><strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</p>
                </div>

                <p>Best regards,<br>
                <strong>GREAN WORLD Energy Technology PLC Team</strong><br>
                🌍 Transforming Ethiopia's Energy Landscape</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Send auto-reply (don't fail the whole request if this fails)
    try {
      await transporter.sendMail(autoReplyOptions);
    } catch (autoReplyError) {
      console.warn("Failed to send auto-reply email:", autoReplyError);
      // Continue with success response even if auto-reply fails
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Message sent successfully! We will get back to you within 24 hours. Please check your email for confirmation.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);

    // Determine error type and provide appropriate message
    let errorMessage =
      "An unexpected error occurred. Please try again or contact us directly at info@greanworld.com";
    let statusCode = 500;

    if (error instanceof Error) {
      if (
        error.message.includes("ENOTFOUND") ||
        error.message.includes("ECONNREFUSED")
      ) {
        errorMessage =
          "Email service is temporarily unavailable. Please contact us directly at info@greanworld.com or call (+251) 913 330000";
      } else if (error.message.includes("Invalid login")) {
        errorMessage =
          "Email service configuration error. Please contact us directly at info@greanworld.com";
      } else if (error.message.includes("timeout")) {
        errorMessage =
          "Request timed out. Please try again or contact us directly.";
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: statusCode },
    );
  }
}
