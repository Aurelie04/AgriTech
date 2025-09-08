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
      supportingDocuments 
    } = body;

    // Validate required fields
    if (!policyId || !claimType || !incidentDate || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate claim number
    const claimNumber = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Insert insurance claim
    const insertQuery = `
      INSERT INTO insurance_claims 
      (policy_id, claim_number, claim_type, incident_date, reported_date, description, estimated_loss, supporting_documents)
      VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [
      policyId,
      claimNumber,
      claimType,
      incidentDate,
      description,
      estimatedLoss || null,
      supportingDocuments ? JSON.stringify(supportingDocuments) : null
    ]);

    const claimId = (result as any).insertId;

    // Send email notification for claim
    await sendClaimNotificationEmail({
      claimId,
      claimNumber,
      claimType,
      incidentDate,
      description,
      estimatedLoss
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
    const emailContent = `
New Insurance Claim - Arimma Agriculture Platform

Claim ID: ${data.claimId}
Claim Number: ${data.claimNumber}
Type: ${data.claimType}
Incident Date: ${data.incidentDate}
Reported Date: ${new Date().toISOString().split('T')[0]}

Description:
${data.description}

Estimated Loss: ${data.estimatedLoss ? `$${data.estimatedLoss}` : 'Not specified'}

---
This claim was submitted through the Arimma Agriculture platform.
Please review and process the claim accordingly.
    `;

    console.log('Insurance Claim Email to gabrielnana084@gmail.com:');
    console.log(emailContent);

    return { success: true };
  } catch (error) {
    console.error('Error sending claim notification email:', error);
    throw error;
  }
}
