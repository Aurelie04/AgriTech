'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
  average_rating: number;
  review_count: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  product_count: number;
}

export default function FarmManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    status: 'available',
    myProducts: false
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/farm/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });
      
      if (filters.myProducts && user) {
        params.append('userId', user.id.toString());
      }
      
      const response = await fetch(`/api/farm/products?${params}`);
      
      console.log('Products API Response Status:', response.status);
      
      if (!response.ok) {
        // Handle different error status codes gracefully
        if (response.status === 500) {
          console.warn('Server error - likely database not initialized. Using empty state.');
          setProducts([]);
          setPagination(prev => ({
            ...prev,
            total: 0,
            totalPages: 0
          }));
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products API Response Data:', data);
      
      // Ensure data is valid before accessing properties
      if (!data || typeof data !== 'object') {
        console.warn('Invalid response data, using empty state');
        setProducts([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalPages: 0
        }));
        return;
      }
      
      // Set products with fallback to empty array
      setProducts(data.products || []);
      
      // Set pagination with proper fallbacks
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      // Set fallback values on error
      setProducts([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleProductClick = (productId: number) => {
    router.push(`/farm-management/products/${productId}`);
  };

  const handleDeleteProduct = async (productId: number, productTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/farm/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh the product list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error deleting product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading farm products...</p>
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
              <a href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                Dashboard
              </a>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Farm Management</h1>
          <p className="text-gray-600 mb-4">
            Browse, search, and manage your agricultural products. Connect with buyers and grow your business.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-800">
                <strong>User-Generated Content:</strong> All products are added by real farmers. No sample data - everything is authentic and user-created.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Categories</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name} ({category.product_count})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No categories available yet</option>
                )}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Min price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.myProducts}
                  onChange={(e) => handleFilterChange('myProducts', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">My Products Only</span>
              </label>
            </div>
            
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                minPrice: '',
                maxPrice: '',
                status: 'available',
                myProducts: false
              })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const isOwner = user && user.id === product.user_id;
            
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <div 
                    className="aspect-w-16 aspect-h-9 cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                  
                  {/* Owner Action Buttons */}
                  {isOwner && (
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/farm-management/products/${product.id}`);
                        }}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                        title="Edit Product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id, product.title);
                        }}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-sm"
                        title="Delete Product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{product.category_icon} {product.category_name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h3 
                    className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{product.location}</span>
                    <div className="flex space-x-2">
                      {product.organic && <span className="text-green-600">🌱 Organic</span>}
                      {product.certified && <span className="text-blue-600">✓ Certified</span>}
                    </div>
                  </div>
                  
                  {product.average_rating > 0 && (
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {product.average_rating.toFixed(1)} ({product.review_count} reviews)
                      </span>
                    </div>
                  )}
                  
                  {/* Seller Info */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        by {product.seller_email}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filters.myProducts ? "Start Your Farm Management Journey" : "Welcome to Farm Management"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {filters.myProducts 
                ? "You haven't added any products yet. Start by adding your first agricultural product to begin managing your farm inventory and connecting with buyers."
                : "No products have been added yet. Be the first to add your agricultural products and start building your farm's online presence. All products are user-generated to ensure authenticity and real farm-to-market connections."
              }
            </p>
            
            {/* Database Setup Notice */}
            {categories.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p><strong>Database Setup Required:</strong> The farm management database tables need to be created first.</p>
                    <p className="mt-1">Please run the database schema: <code className="bg-yellow-100 px-1 rounded">database/farm_management_schema.sql</code></p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors text-lg font-medium"
                disabled={categories.length === 0}
              >
                {filters.myProducts ? "Add Your First Product" : "Add Your First Product"}
              </button>
              {!filters.myProducts && (
                <div className="text-sm text-gray-500">
                  <p>💡 <strong>Tip:</strong> All products are added by real farmers like you</p>
                  <p>🔒 <strong>Secure:</strong> Only authenticated users can add products</p>
                  <p>🌍 <strong>Global:</strong> Connect with buyers worldwide</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                  className={`px-3 py-2 border rounded-md text-sm ${
                    page === pagination.page
                      ? 'bg-green-600 text-white border-green-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add Product Form Modal */}
      {showAddForm && (
        <AddProductForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchProducts();
          }}
          categories={categories}
        />
      )}
    </div>
  );
}

// Add Product Form Component
function AddProductForm({ 
  onClose, 
  onSuccess, 
  categories 
}: { 
  onClose: () => void; 
  onSuccess: () => void;
  categories: Category[];
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    quantity: '',
    unit: 'kg',
    location: '',
    harvestDate: '',
    expiryDate: '',
    organic: false,
    certified: false,
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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

  const createCategory = async () => {
    const nameInput = document.getElementById('newCategoryName') as HTMLInputElement;
    const iconInput = document.getElementById('newCategoryIcon') as HTMLInputElement;
    
    if (!nameInput.value.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      const response = await fetch('/api/farm/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          icon: iconInput.value.trim() || '📦'
        }),
      });

      if (response.ok) {
        alert('Category created successfully!');
        nameInput.value = '';
        iconInput.value = '';
        // Refresh categories
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || 'Error creating category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user.id.toString());
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('location', formData.location || '');
      formDataToSend.append('harvestDate', formData.harvestDate || '');
      formDataToSend.append('expiryDate', formData.expiryDate || '');
      formDataToSend.append('organic', formData.organic.toString());
      formDataToSend.append('certified', formData.certified.toString());
      
      // Add image file if uploaded
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }

      const response = await fetch('/api/farm/products', {
        method: 'POST',
        body: formDataToSend, // Use FormData instead of JSON
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Product added successfully:', result);
        alert('Product added successfully!');
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Error adding product:', errorData);
        alert(errorData.error || 'Error adding product. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold">Add New Product</h3>
            <p className="text-sm text-gray-600 mt-1">Enter your own farm product details</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Input Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Notice</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Please enter your own authentic farm product information. All data must be accurate and represent your actual agricultural products. This ensures trust and authenticity in the marketplace.</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              {categories.length > 0 ? (
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-3 py-2 border border-yellow-300 rounded-md bg-yellow-50">
                  <p className="text-yellow-800 text-sm mb-2">
                    No categories available yet. Create your first category:
                  </p>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Category name (e.g., Vegetables)"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      id="newCategoryName"
                    />
                    <input
                      type="text"
                      placeholder="Icon (e.g., 🥬)"
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      id="newCategoryIcon"
                    />
                    <button
                      type="button"
                      onClick={createCategory}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
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
              placeholder="Farm or location name"
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
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">
                  {imageFile ? 'Change Image' : 'Click to upload image'}
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
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
