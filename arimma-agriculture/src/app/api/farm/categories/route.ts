import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT 
        pc.*,
        COUNT(fp.id) as product_count
      FROM product_categories pc
      LEFT JOIN farm_products fp ON pc.id = fp.category_id AND fp.status = 'available'
      GROUP BY pc.id
      ORDER BY pc.name
    `;

    const categories = await executeQuery(query, []);

    return NextResponse.json({ categories }, { status: 200 });

  } catch (error) {
    console.error('Error fetching product categories:', error);
    
    // Check if it's a table doesn't exist error
    if (error instanceof Error && error.message.includes("doesn't exist")) {
      console.log('Database tables not initialized yet, returning empty categories');
      return NextResponse.json({ categories: [] }, { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await executeQuery(
      'SELECT id FROM product_categories WHERE name = ?',
      [name]
    );

    if ((existingCategory as any[]).length > 0) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO product_categories (name, description, icon)
      VALUES (?, ?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [
      name,
      description || null,
      icon || '📦'
    ]);

    const categoryId = (result as any).insertId;

    return NextResponse.json({
      message: 'Category created successfully',
      categoryId
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product category:', error);
    
    // Check if it's a table doesn't exist error
    if (error instanceof Error && error.message.includes("doesn't exist")) {
      return NextResponse.json(
        { error: 'Database tables not initialized. Please run the database schema first.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}