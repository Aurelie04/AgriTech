import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      requestType, 
      subject, 
      message, 
      contactEmail, 
      contactPhone 
    } = body;

    // Validate required fields
    if (!requestType || !subject || !message || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert insurance request
    const insertQuery = `
      INSERT INTO insurance_requests 
      (user_id, request_type, subject, message, contact_email, contact_phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [
      userId || null,
      requestType,
      subject,
      message,
      contactEmail,
      contactPhone || null
    ]);

    const requestId = (result as any).insertId;

    // Send email notification
    await sendInsuranceRequestEmail({
      requestId,
      requestType,
      subject,
      message,
      contactEmail,
      contactPhone,
      userId
    });

    // Update email_sent status
    await executeQuery(
      'UPDATE insurance_requests SET email_sent = true WHERE id = ?',
      [requestId]
    );

    return NextResponse.json({
      message: 'Insurance request submitted successfully',
      requestId
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting insurance request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendInsuranceRequestEmail(data: any) {
  try {
    const emailContent = `
New Insurance Request - Arimma Agriculture Platform

Request ID: ${data.requestId}
Type: ${data.requestType}
Subject: ${data.subject}

Contact Information:
Email: ${data.contactEmail}
Phone: ${data.contactPhone || 'Not provided'}
User ID: ${data.userId || 'Guest user'}

Message:
${data.message}

---
This request was submitted through the Arimma Agriculture platform.
Please respond to the customer at: ${data.contactEmail}
    `;

    // In a real implementation, you would use an email service like SendGrid, AWS SES, etc.
    // For now, we'll log the email content
    console.log('Insurance Request Email to gabrielnana084@gmail.com:');
    console.log(emailContent);

    // Simulate email sending
    return { success: true };
  } catch (error) {
    console.error('Error sending insurance request email:', error);
    throw error;
  }
}



