import { NextRequest, NextResponse } from 'next/server';

// Mock email sending function (in production, use a real email service like SendGrid, Nodemailer, etc.)
const sendEmail = async (bookingData: any) => {
  // In a real application, you would integrate with an email service
  // For now, we'll simulate the email sending and log the data
  console.log('=== EQUIPMENT BOOKING REQUEST ===');
  console.log('To: gabrielnana084@gmail.com');
  console.log('Subject: New Equipment Booking Request');
  console.log('Booking Data:', JSON.stringify(bookingData, null, 2));
  console.log('================================');
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    messageId: `booking_${Date.now()}`,
    message: 'Email sent successfully'
  };
};

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'equipmentId',
      'equipmentName',
      'farmerName',
      'email',
      'phone',
      'startDate',
      'endDate',
      'duration',
      'totalCost',
      'location'
    ];
    
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Format the email content
    const emailContent = {
      to: 'gabrielnana084@gmail.com',
      subject: `New Equipment Booking Request - ${bookingData.equipmentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚜 Equipment Booking Request</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <h2 style="color: #374151; margin-top: 0;">Booking Details</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #10b981; margin-top: 0;">Equipment Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Equipment:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.equipmentName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Type:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.equipmentType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Location:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.equipmentLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Service Model:</td>
                  <td style="padding: 8px 0;">${bookingData.serviceModel}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #10b981; margin-top: 0;">Farmer Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.farmerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Farm Location:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.location}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Farm Size:</td>
                  <td style="padding: 8px 0;">${bookingData.farmSize || 'Not specified'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #10b981; margin-top: 0;">Booking Schedule</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Start Date:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${new Date(bookingData.startDate).toLocaleDateString('en-ZA')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">End Date:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${new Date(bookingData.endDate).toLocaleDateString('en-ZA')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Duration:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.duration}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Preferred Time:</td>
                  <td style="padding: 8px 0;">${bookingData.preferredTime || 'Not specified'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #10b981; margin-top: 0;">Pricing Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Rate Type:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.rateType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Rate:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${bookingData.rate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Total Cost:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 18px; font-weight: bold; color: #10b981;">${bookingData.totalCost}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Payment Method:</td>
                  <td style="padding: 8px 0;">${bookingData.paymentMethod || 'Not specified'}</td>
                </tr>
              </table>
            </div>
            
            ${bookingData.specialRequirements ? `
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #10b981; margin-top: 0;">Special Requirements</h3>
              <p style="margin: 0; color: #374151;">${bookingData.specialRequirements}</p>
            </div>
            ` : ''}
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">📧 Next Steps:</p>
              <ul style="margin: 10px 0 0 0; color: #92400e;">
                <li>Contact the farmer to confirm availability</li>
                <li>Arrange equipment delivery/pickup</li>
                <li>Confirm payment terms and conditions</li>
                <li>Provide equipment operation instructions if needed</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                This booking request was generated from the Arimma Agriculture Equipment Booking System
              </p>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">
                Request ID: ${bookingData.bookingId || `EQ-${Date.now()}`} | 
                Submitted: ${new Date().toLocaleString('en-ZA')}
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Equipment Booking Request - ${bookingData.equipmentName}

Equipment Information:
- Equipment: ${bookingData.equipmentName}
- Type: ${bookingData.equipmentType}
- Location: ${bookingData.equipmentLocation}
- Service Model: ${bookingData.serviceModel}

Farmer Information:
- Name: ${bookingData.farmerName}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}
- Farm Location: ${bookingData.location}
- Farm Size: ${bookingData.farmSize || 'Not specified'}

Booking Schedule:
- Start Date: ${new Date(bookingData.startDate).toLocaleDateString('en-ZA')}
- End Date: ${new Date(bookingData.endDate).toLocaleDateString('en-ZA')}
- Duration: ${bookingData.duration}
- Preferred Time: ${bookingData.preferredTime || 'Not specified'}

Pricing Information:
- Rate Type: ${bookingData.rateType}
- Rate: ${bookingData.rate}
- Total Cost: ${bookingData.totalCost}
- Payment Method: ${bookingData.paymentMethod || 'Not specified'}

${bookingData.specialRequirements ? `Special Requirements: ${bookingData.specialRequirements}` : ''}

Request ID: ${bookingData.bookingId || `EQ-${Date.now()}`}
Submitted: ${new Date().toLocaleString('en-ZA')}
      `
    };
    
    // Send the email
    const emailResult = await sendEmail(emailContent);
    
    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Booking request sent successfully',
        bookingId: bookingData.bookingId || `EQ-${Date.now()}`,
        emailResult
      });
    } else {
      throw new Error('Failed to send email');
    }

  } catch (error) {
    console.error('Booking API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process booking request' 
      },
      { status: 500 }
    );
  }
}
