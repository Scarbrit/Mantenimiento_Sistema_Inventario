import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    sku: '',
    base_price: '',
    image_url: '',
  });

  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({
    variant_name: '',
    sku: '',
    purchase_price: '',
    selling_price: '',
    quantity: '',
    min_stock_level: '10',
  });

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id),
    enabled: isEdit,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandApi.getAll(),
  });

  useEffect(() => {
    if (product?.data) {
      const p = product.data;
      setProductData({
        name: p.name || '',
        description: p.description || '',
        category_id: p.category_id || '',
        brand_id: p.brand_id || '',
        sku: p.sku || '',
        base_price: p.base_price || '',
        image_url: p.image_url || '',
      });
      setVariants(p.variants || []);
    }
  }, [product]);

  const productMutation = useMutation({
    mutationFn: (data) =>
      isEdit ? productApi.update(id, data) : productApi.create(data),
    onSuccess: async (response) => {
      const productId = isEdit ? id : response.data.id;
      
      // Create/update variants
      for (const variant of variants) {
        if (variant.id) {
          await productApi.updateVariant(variant.id, { ...variant, product_id: productId });
        } else {
          await productApi.createVariant({ ...variant, product_id: productId });
        }
      }

      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      navigate('/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error saving product');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    productMutation.mutate(productData);
  };

  const addVariant = () => {
    if (!newVariant.variant_name || !newVariant.sku) {
      toast.error('Variant name and SKU are required');
      return;
    }
    setVariants([...variants, { ...newVariant, id: null }]);
    setNewVariant({
      variant_name: '',
      sku: '',
      purchase_price: '',
      selling_price: '',
      quantity: '',
      min_stock_level: '10',
    });
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6" data-aos="fade-up">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SKU *
            </label>
            <input
              type="text"
              required
              value={productData.sku}
              onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={productData.category_id}
              onChange={(e) => setProductData({ ...productData, category_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select Category</option>
              {categoriesData?.data?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand
            </label>
            <select
              value={productData.brand_id}
              onChange={(e) => setProductData({ ...productData, brand_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select Brand</option>
              {brandsData?.data?.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base Price *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={productData.base_price}
              onChange={(e) => setProductData({ ...productData, base_price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={productData.image_url}
              onChange={(e) => setProductData({ ...productData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={productData.description}
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Variants Section */}
        <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Product Variants
          </h3>
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {variant.variant_name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    SKU: {variant.sku} | Qty: {variant.quantity} | Price: PKR {variant.selling_price}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <input
                type="text"
                placeholder="Variant Name"
                value={newVariant.variant_name}
                onChange={(e) => setNewVariant({ ...newVariant, variant_name: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="SKU"
                value={newVariant.sku}
                onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Purchase Price"
                value={newVariant.purchase_price}
                onChange={(e) => setNewVariant({ ...newVariant, purchase_price: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Selling Price"
                value={newVariant.selling_price}
                onChange={(e) => setNewVariant({ ...newVariant, selling_price: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newVariant.quantity}
                onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={addVariant}
                className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Add Variant
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-6 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={productMutation.isPending}
            className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {productMutation.isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
