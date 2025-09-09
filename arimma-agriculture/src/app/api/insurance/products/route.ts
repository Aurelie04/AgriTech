import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    let query = `
      SELECT 
        ip.*,
        ic.name as category_name,
        ic.description as category_description
      FROM insurance_products ip
      JOIN insurance_categories ic ON ip.category_id = ic.id
      WHERE ip.is_active = true
    `;
    
    const params: any[] = [];
    
    if (type) {
      query += ' AND ip.coverage_type = ?';
      params.push(type);
    }
    
    if (category) {
      query += ' AND ic.name = ?';
      params.push(category);
    }
    
    query += ' ORDER BY ip.name';

    const products = await executeQuery(query, params);

    return NextResponse.json({ products }, { status: 200 });

  } catch (error) {
    console.error('Error fetching insurance products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

