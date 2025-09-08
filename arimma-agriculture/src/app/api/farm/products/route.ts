import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        fp.*,
        pc.name as category_name,
        pc.icon as category_icon,
        u.email as seller_email,
        up.first_name as seller_first_name,
        up.last_name as seller_last_name,
        up.business_name as seller_business,
        AVG(pr.rating) as average_rating,
        COUNT(pr.id) as review_count
      FROM farm_products fp
      JOIN product_categories pc ON fp.category_id = pc.id
      JOIN users u ON fp.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN product_reviews pr ON fp.id = pr.product_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (category) {
      query += ' AND pc.name = ?';
      params.push(category);
    }
    
    if (minPrice) {
      query += ' AND fp.price >= ?';
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query += ' AND fp.price <= ?';
      params.push(parseFloat(maxPrice));
    }
    
    if (status) {
      query += ' AND fp.status = ?';
      params.push(status);
    }
    
    if (search) {
      query += ' AND (fp.title LIKE ? OR fp.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (userId) {
      query += ' AND fp.user_id = ?';
      params.push(parseInt(userId));
    }
    
    query += ' GROUP BY fp.id ORDER BY fp.created_at DESC';
    
    // Get total count for pagination
    const countQuery = query.replace(
      'SELECT fp.*, pc.name as category_name, pc.icon as category_icon, u.email as seller_email, up.first_name as seller_first_name, up.last_name as seller_last_name, up.business_name as seller_business, AVG(pr.rating) as average_rating, COUNT(pr.id) as review_count',
      'SELECT COUNT(DISTINCT fp.id) as total'
    );
    
    const countResult = await executeQuery(countQuery, params);
    const total = (countResult as any)[0]?.total || 0;
    
    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const products = await executeQuery(query, params);

    // Ensure we always return a proper pagination object
    const paginationData = {
      page: page || 1,
      limit: limit || 12,
      total: total || 0,
      totalPages: Math.ceil((total || 0) / (limit || 12))
    };

    return NextResponse.json({
      products: products || [],
      pagination: paginationData
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching farm products:', error);
    
    // Check if it's a table doesn't exist error
    if (error instanceof Error && error.message.includes("doesn't exist")) {
      console.log('Database tables not initialized yet, returning empty state');
      return NextResponse.json({
        products: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0
        }
      }, { status: 200 });
    }
    
    return NextResponse.json({
      products: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      },
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const userId = formData.get('userId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const price = formData.get('price') as string;
    const quantity = formData.get('quantity') as string;
    const unit = formData.get('unit') as string;
    const location = formData.get('location') as string;
    const harvestDate = formData.get('harvestDate') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const organic = formData.get('organic') as string;
    const certified = formData.get('certified') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('image') as File;

    // Validate required fields
    if (!userId || !title || !categoryId || !price || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let finalImageUrl = imageUrl || null;

    // Handle file upload
    if (imageFile && imageFile.size > 0) {
      try {
        // Convert file to base64 for storage (in a real app, you'd upload to cloud storage)
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const mimeType = imageFile.type;
        finalImageUrl = `data:${mimeType};base64,${base64}`;
      } catch (fileError) {
        console.error('Error processing image file:', fileError);
        return NextResponse.json(
          { error: 'Error processing image file' },
          { status: 400 }
        );
      }
    }

    const insertQuery = `
      INSERT INTO farm_products 
      (user_id, title, description, category_id, price, quantity, unit, location, harvest_date, expiry_date, organic, certified, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(insertQuery, [
      parseInt(userId),
      title,
      description || null,
      parseInt(categoryId),
      parseFloat(price),
      parseInt(quantity),
      unit || 'kg',
      location || null,
      harvestDate || null,
      expiryDate || null,
      organic === 'true',
      certified === 'true',
      finalImageUrl
    ]);

    const productId = (result as any).insertId;

    return NextResponse.json({
      message: 'Product created successfully',
      productId
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating farm product:', error);
    
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
