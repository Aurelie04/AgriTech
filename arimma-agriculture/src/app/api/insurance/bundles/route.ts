import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT 
        bip.*,
        GROUP_CONCAT(
          CONCAT('{"id":', ip.id, ',"name":"', ip.name, '","type":"', ip.coverage_type, '"}')
          SEPARATOR ','
        ) as products_info
      FROM bundled_insurance_packages bip
      LEFT JOIN insurance_products ip ON JSON_CONTAINS(bip.base_products, CAST(ip.id AS JSON))
      WHERE bip.is_active = true
      GROUP BY bip.id
      ORDER BY bip.discount_percentage DESC
    `;

    const bundles = await executeQuery(query, []);

    // Parse the products_info JSON
    const formattedBundles = bundles.map((bundle: any) => ({
      ...bundle,
      products: bundle.products_info ? 
        JSON.parse(`[${bundle.products_info}]`) : []
    }));

    return NextResponse.json({ bundles: formattedBundles }, { status: 200 });

  } catch (error) {
    console.error('Error fetching insurance bundles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
