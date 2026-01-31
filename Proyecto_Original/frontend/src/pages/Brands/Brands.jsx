import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Award, Edit, Trash2 } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Brands = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const { data: brandsData, refetch } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandApi.getAll(),
  });

  const brands = brandsData?.data || [];

  const createMutation = useMutation({
    mutationFn: brandApi.create,
    onSuccess: () => {
      toast.success('Brand created successfully');
      setShowForm(false);
      setFormData({ name: '', description: '' });
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error creating brand');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => brandApi.update(id, data),
    onSuccess: () => {
      toast.success('Brand updated successfully');
      setEditingId(null);
      setFormData({ name: '', description: '' });
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error updating brand');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: brandApi.delete,
    onSuccess: () => {
      toast.success('Brand deleted successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error deleting brand');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand.id);
    setFormData({ name: brand.name, description: brand.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D4AF37',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6" data-aos="fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Brands
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage product brands
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: '', description: '' });
            }}
            className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{showForm ? 'Cancel' : 'Add Brand'}</span>
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-gold-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', description: '' });
              }}
              className="px-6 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {editingId ? 'Update' : 'Create'} Brand
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            data-aos="fade-up"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6 text-gold-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {brand.name}
                </h3>
              </div>
              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {brand.description && (
              <p className="text-gray-600 dark:text-gray-400">
                {brand.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No brands found</p>
        </div>
      )}
    </div>
  );
};

export default Brands;
