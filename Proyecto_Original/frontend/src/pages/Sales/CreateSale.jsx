import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { saleApi } from '../../api/saleApi';
import toast from 'react-hot-toast';

const CreateSale = () => {
  const navigate = useNavigate();
  const [saleData, setSaleData] = useState({
    variant_id: '',
    quantity: '',
    unit_price: '',
    customer_name: '',
    customer_phone: '',
    notes: '',
  });

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getAll(),
  });

  const products = productsData?.data || [];
  const selectedProduct = products.find((p) =>
    p.variants?.some((v) => v.id === saleData.variant_id)
  );
  const selectedVariant = selectedProduct?.variants?.find(
    (v) => v.id === saleData.variant_id
  );

  const saleMutation = useMutation({
    mutationFn: saleApi.create,
    onSuccess: () => {
      toast.success('Sale recorded successfully!');
      navigate('/sales');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error creating sale');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saleMutation.mutate({
      ...saleData,
      quantity: parseInt(saleData.quantity),
      unit_price: parseFloat(saleData.unit_price),
    });
  };

  const handleVariantChange = (variantId) => {
    const variant = products
      .flatMap((p) => p.variants || [])
      .find((v) => v.id === variantId);
    setSaleData({
      ...saleData,
      variant_id: variantId,
      unit_price: variant?.selling_price || '',
    });
  };

  const allVariants = products.flatMap((p) =>
    (p.variants || []).map((v) => ({ ...v, product_name: p.name }))
  );

  return (
    <div className="space-y-6" data-aos="fade-up">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/sales')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          New Sale
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Variant *
            </label>
            <select
              required
              value={saleData.variant_id}
              onChange={(e) => handleVariantChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select Variant</option>
              {allVariants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.product_name} - {variant.variant_name} (Qty: {variant.quantity})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              required
              min="1"
              max={selectedVariant?.quantity || 0}
              value={saleData.quantity}
              onChange={(e) => setSaleData({ ...saleData, quantity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
            {selectedVariant && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Available: {selectedVariant.quantity}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unit Price (PKR) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={saleData.unit_price}
              onChange={(e) => setSaleData({ ...saleData, unit_price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
            {selectedVariant && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Default: PKR {selectedVariant.selling_price}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Amount
            </label>
            <input
              type="text"
              readOnly
              value={
                saleData.quantity && saleData.unit_price
                  ? `PKR ${(parseFloat(saleData.quantity) * parseFloat(saleData.unit_price)).toLocaleString()}`
                  : 'PKR 0'
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-600 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={saleData.customer_name}
              onChange={(e) => setSaleData({ ...saleData, customer_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer Phone
            </label>
            <input
              type="text"
              value={saleData.customer_phone}
              onChange={(e) => setSaleData({ ...saleData, customer_phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            value={saleData.notes}
            onChange={(e) => setSaleData({ ...saleData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/sales')}
            className="px-6 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saleMutation.isPending}
            className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {saleMutation.isPending ? 'Processing...' : 'Record Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSale;
