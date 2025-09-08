'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  user_id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  image_url: string;
  status: string;
  location: string;
  organic: boolean;
  certified: boolean;
  category_name: string;
  category_icon: string;
  seller_email: string;
  seller_profile: any;
  average_rating: number;
  review_count: number;
  harvest_date: string;
  expiry_date: string;
  created_at: string;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/farm/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else {
        router.push('/farm-management');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/farm-management');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOwner = user && product && user.id === product.user_id;

  const handleDeleteProduct = async () => {
    if (!product) return;
    
    if (!confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/farm/products/${product.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        router.push('/farm-management');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error deleting product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h3>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/farm-management')}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Back to Farm Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img 
                src="/arimma-logo.svg" 
                alt="Arimma Agriculture Logo" 
                className="h-16 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/farm-management')}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                ← Back to Farm Management
              </button>
              {isOwner && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={handleDeleteProduct}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={product.image_url || '/placeholder-product.jpg'}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg shadow-sm"
              />
            </div>
            
            {/* Product Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                {product.status.replace('_', ' ').toUpperCase()}
              </span>
              {product.organic && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  🌱 Organic
                </span>
              )}
              {product.certified && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  ✓ Certified
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{product.category_icon}</span>
                <span className="text-sm text-gray-500">{product.category_name}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              {product.description && (
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price and Quantity */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-gray-600">
                  {product.quantity} {product.unit} available
                </span>
              </div>
              
              {product.status === 'available' && (
                <button className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors text-lg font-medium">
                  Contact Seller
                </button>
              )}
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{product.location || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Harvest Date:</span>
                  <span className="font-medium">{formatDate(product.harvest_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className="font-medium">{formatDate(product.expiry_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium">{formatDate(product.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-lg">
                    {product.seller_profile?.first_name?.charAt(0) || product.seller_email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {product.seller_profile?.first_name && product.seller_profile?.last_name
                      ? `${product.seller_profile.first_name} ${product.seller_profile.last_name}`
                      : 'Farm Seller'
                    }
                  </p>
                  <p className="text-sm text-gray-500">{product.seller_email}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {product.review_count > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(product.average_rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.average_rating.toFixed(1)} ({product.review_count} reviews)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Product Form Modal */}
      {showEditForm && product && (
        <EditProductForm 
          product={product}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            fetchProduct();
          }}
        />
      )}
    </div>
  );
}

// Edit Product Form Component
function EditProductForm({ 
  product, 
  onClose, 
  onSuccess 
}: { 
  product: Product; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description || '',
    price: product.price.toString(),
    quantity: product.quantity.toString(),
    unit: product.unit,
    location: product.location || '',
    harvestDate: product.harvest_date ? product.harvest_date.split('T')[0] : '',
    expiryDate: product.expiry_date ? product.expiry_date.split('T')[0] : '',
    organic: product.organic,
    certified: product.certified,
    imageUrl: product.image_url || '',
    status: product.status
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product.image_url || '');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, GIF, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', formData.price);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('location', formData.location || '');
      formDataToSend.append('harvestDate', formData.harvestDate || '');
      formDataToSend.append('expiryDate', formData.expiryDate || '');
      formDataToSend.append('organic', formData.organic.toString());
      formDataToSend.append('certified', formData.certified.toString());
      formDataToSend.append('status', formData.status);
      
      // Add image file if uploaded
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }

      const response = await fetch(`/api/farm/products/${product.id}`, {
        method: 'PUT',
        body: formDataToSend, // Use FormData instead of JSON
      });

      if (response.ok) {
        alert('Product updated successfully!');
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error updating product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Edit Product</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="pieces">pieces</option>
                <option value="dozen">dozen</option>
                <option value="liters">liters</option>
                <option value="bunches">bunches</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
              <input
                type="date"
                value={formData.harvestDate}
                onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove Image
                </button>
              </div>
            )}
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="editImageUpload"
              />
              <label
                htmlFor="editImageUpload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">
                  {imageFile ? 'Change Image' : 'Click to upload new image'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF up to 5MB
                </span>
              </label>
            </div>
            
            {/* Alternative: Image URL (fallback) */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Or enter image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="https://example.com/image.jpg (optional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.organic}
                onChange={(e) => setFormData({...formData, organic: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Organic</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.certified}
                onChange={(e) => setFormData({...formData, certified: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Certified</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
