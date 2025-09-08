import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    const query = `
      SELECT 
        fp.*,
        pc.name as category_name,
        pc.icon as category_icon,
        u.email as seller_email,
        u.profile as seller_profile,
        AVG(pr.rating) as average_rating,
        COUNT(pr.id) as review_count
      FROM farm_products fp
      JOIN product_categories pc ON fp.category_id = pc.id
      JOIN users u ON fp.user_id = u.id
      LEFT JOIN product_reviews pr ON fp.id = pr.product_id
      WHERE fp.id = ?
      GROUP BY fp.id
    `;

    const products = await executeQuery(query, [productId]);

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: products[0] }, { status: 200 });

  } catch (error) {
    console.error('Error fetching farm product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const quantity = formData.get('quantity') as string;
    const unit = formData.get('unit') as string;
    const location = formData.get('location') as string;
    const harvestDate = formData.get('harvestDate') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const organic = formData.get('organic') as string;
    const certified = formData.get('certified') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const status = formData.get('status') as string;
    const imageFile = formData.get('image') as File;

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

    const updateQuery = `
      UPDATE farm_products 
      SET title = ?, description = ?, price = ?, quantity = ?, 
          unit = ?, location = ?, harvest_date = ?, expiry_date = ?, 
          organic = ?, certified = ?, image_url = ?, status = ?
      WHERE id = ?
    `;
    
    await executeQuery(updateQuery, [
      title,
      description,
      parseFloat(price),
      parseInt(quantity),
      unit,
      location,
      harvestDate,
      expiryDate,
      organic === 'true',
      certified === 'true',
      finalImageUrl,
      status,
      productId
    ]);

    return NextResponse.json({
      message: 'Product updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating farm product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    await executeQuery('DELETE FROM farm_products WHERE id = ?', [productId]);

    return NextResponse.json({
      message: 'Product deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting farm product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
