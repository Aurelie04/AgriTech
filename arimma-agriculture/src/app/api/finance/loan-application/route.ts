import { NextRequest, NextResponse } from 'next/server';

// Mock email sending function for loan applications
const sendLoanApplicationEmail = async (emailContent: any) => {
  console.log('=== LOAN APPLICATION SUBMITTED ===');
  console.log('To: gabrielnana084@gmail.com');
  console.log('Subject: ' + emailContent.subject);
  console.log('Application Data:', JSON.stringify(emailContent, null, 2));
  console.log('================================');
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    messageId: `loan_app_${Date.now()}`,
    message: 'Loan application email sent successfully'
  };
};

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'farmerName',
      'email',
      'phone',
      'farmSize',
      'loanProductId',
      'requestedAmount',
      'loanPurpose',
      'repaymentOption'
    ];
    
    const missingFields = requiredFields.filter(field => !applicationData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Generate application ID
    const applicationId = `LA-${Date.now()}`;
    
    // Format the email content
    const emailContent = {
      to: 'gabrielnana084@gmail.com',
      subject: `New Loan Application - ${applicationData.loanProduct?.name || 'Agricultural Loan'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">💰 Loan Application</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <h2 style="color: #374151; margin-top: 0;">Application Details</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #10b981; margin-top: 0;">Loan Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Loan Product:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${applicationData.loanProduct?.name || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Requested Amount:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">R ${applicationData.requestedAmount?.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Loan Purpose:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${applicationData.loanPurpose}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Repayment Option:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${applicationData.repaymentOption}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Interest Rate:</td>
                  <td style="padding: 8px 0;">${applicationData.loanProduct?.interestRate || 'N/A'}% per annum</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #10b981; margin-top: 0;">Farmer Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${applicationData.farmerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${applicationData.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${applicationData.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Farm Size:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${applicationData.farmSize} hectares</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Farming Experience:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${applicationData.experience || 'Not specified'} years</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Farm Location:</td>
                  <td style="padding: 8px 0;">${applicationData.farmLocation || 'Not specified'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #10b981; margin-top: 0;">Financial Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Annual Income:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">R ${applicationData.annualIncome?.toLocaleString() || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Existing Debts:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">R ${applicationData.existingDebts?.toLocaleString() || 'None'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Bank Account:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${applicationData.bankAccount || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Credit Score:</td>
                  <td style="padding: 8px 0;">${applicationData.creditScore || 'Not calculated'}</td>
                </tr>
              </table>
            </div>
            
            ${applicationData.additionalInfo ? `
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #10b981; margin-top: 0;">Additional Information</h3>
              <p style="margin: 0; color: #374151;">${applicationData.additionalInfo}</p>
            </div>
            ` : ''}
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">📋 Next Steps:</p>
              <ul style="margin: 10px 0 0 0; color: #92400e;">
                <li>Review application details and documentation</li>
                <li>Conduct credit assessment and risk analysis</li>
                <li>Verify farm details and financial information</li>
                <li>Contact farmer for additional information if needed</li>
                <li>Make loan decision and communicate to farmer</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                This loan application was submitted through the Arimma Agriculture Finance System
              </p>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">
                Application ID: ${applicationId} | 
                Submitted: ${new Date().toLocaleString('en-ZA')}
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Loan Application - ${applicationData.loanProduct?.name || 'Agricultural Loan'}

Loan Information:
- Loan Product: ${applicationData.loanProduct?.name || 'N/A'}
- Requested Amount: R ${applicationData.requestedAmount?.toLocaleString()}
- Loan Purpose: ${applicationData.loanPurpose}
- Repayment Option: ${applicationData.repaymentOption}
- Interest Rate: ${applicationData.loanProduct?.interestRate || 'N/A'}% per annum

Farmer Information:
- Name: ${applicationData.farmerName}
- Email: ${applicationData.email}
- Phone: ${applicationData.phone}
- Farm Size: ${applicationData.farmSize} hectares
- Farming Experience: ${applicationData.experience || 'Not specified'} years
- Farm Location: ${applicationData.farmLocation || 'Not specified'}

Financial Information:
- Annual Income: R ${applicationData.annualIncome?.toLocaleString() || 'Not specified'}
- Existing Debts: R ${applicationData.existingDebts?.toLocaleString() || 'None'}
- Bank Account: ${applicationData.bankAccount || 'Not specified'}
- Credit Score: ${applicationData.creditScore || 'Not calculated'}

${applicationData.additionalInfo ? `Additional Information: ${applicationData.additionalInfo}` : ''}

Application ID: ${applicationId}
Submitted: ${new Date().toLocaleString('en-ZA')}
      `
    };
    
    // Send the email
    const emailResult = await sendLoanApplicationEmail(emailContent);
    
    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Loan application submitted successfully',
        applicationId: applicationId,
        emailResult
      });
    } else {
      throw new Error('Failed to send email');
    }

  } catch (error) {
    console.error('Loan application API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process loan application' 
      },
      { status: 500 }
    );
  }
}
