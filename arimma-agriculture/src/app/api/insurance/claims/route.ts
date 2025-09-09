import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      policyId, 
      claimType, 
      incidentDate, 
      description, 
      estimatedLoss,
      contactPhone,
      farmLocation,
      witnessName,
      witnessPhone,
      additionalInfo,
      supportingDocuments,
      userId
    } = body;

    console.log('Received claim data:', body);

    // Validate required fields
    const requiredFields = ['policyId', 'claimType', 'incidentDate', 'description', 'contactPhone', 'farmLocation'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate claim number
    const claimNumber = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // For now, we'll use mock data since we don't have the actual database tables set up
    // In a real application, this would insert into the insurance_claims table
    const claimId = Date.now();

    // Send email notification for claim
    await sendClaimNotificationEmail({
      claimId,
      claimNumber,
      claimType,
      incidentDate,
      description,
      estimatedLoss,
      contactPhone,
      farmLocation,
      witnessName,
      witnessPhone,
      additionalInfo,
      userId
    });

    return NextResponse.json({
      message: 'Insurance claim submitted successfully',
      claimId,
      claimNumber
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting insurance claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        ic.*,
        uip.policy_number,
        uip.coverage_amount,
        ip.name as product_name
      FROM insurance_claims ic
      JOIN user_insurance_policies uip ON ic.policy_id = uip.id
      JOIN insurance_products ip ON uip.product_id = ip.id
      WHERE uip.user_id = ?
      ORDER BY ic.created_at DESC
    `;

    const claims = await executeQuery(query, [userId]);

    return NextResponse.json({ claims }, { status: 200 });

  } catch (error) {
    console.error('Error fetching insurance claims:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendClaimNotificationEmail(data: any) {
  try {
    const claimTypeLabels = {
      'crop_damage': '🌱 Crop Damage',
      'asset_damage': '🚜 Asset Damage', 
      'weather_loss': '🌤️ Weather Loss',
      'other': '📋 Other'
    };

    const emailContent = `
New Insurance Claim - Arimma Agriculture Platform

=== CLAIM DETAILS ===
Claim ID: ${data.claimId}
Claim Number: ${data.claimNumber}
Claim Type: ${claimTypeLabels[data.claimType as keyof typeof claimTypeLabels] || data.claimType}
Incident Date: ${data.incidentDate}
Reported Date: ${new Date().toISOString().split('T')[0]}

=== INCIDENT INFORMATION ===
Description:
${data.description}

Estimated Loss: ${data.estimatedLoss ? `R${data.estimatedLoss.toLocaleString()}` : 'Not specified'}

=== CONTACT INFORMATION ===
Contact Phone: ${data.contactPhone}
Farm Location: ${data.farmLocation}

${data.witnessName ? `=== WITNESS INFORMATION ===
Witness Name: ${data.witnessName}
Witness Phone: ${data.witnessPhone || 'Not provided'}` : ''}

${data.additionalInfo ? `=== ADDITIONAL INFORMATION ===
${data.additionalInfo}` : ''}

=== SYSTEM INFORMATION ===
User ID: ${data.userId}
Submitted: ${new Date().toLocaleString('en-ZA')}

---
This claim was submitted through the Arimma Agriculture platform.
Please review and process the claim accordingly.

Next Steps:
1. Review claim details and supporting documentation
2. Contact the farmer for additional information if needed
3. Conduct on-site inspection if required
4. Process the claim and communicate decision to farmer
    `;

    console.log('=== INSURANCE CLAIM SUBMITTED ===');
    console.log('To: gabrielnana084@gmail.com');
    console.log('Subject: New Insurance Claim - ' + data.claimNumber);
    console.log('================================');
    console.log(emailContent);
    console.log('================================');

    return { success: true };
  } catch (error) {
    console.error('Error sending claim notification email:', error);
    throw error;
  }
}
