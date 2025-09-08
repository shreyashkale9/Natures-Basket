import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { farmerApi } from '../../services/api';
import AddProductForm from '../../components/farmer/AddProductForm';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const createProductMutation = useMutation({
    mutationFn: (data) => farmerApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmer-products']);
      toast.success('Product created successfully!');
      navigate('/farmer/products');
    },
    onError: (error) => {
      if (error.message?.includes('not approved yet')) {
        toast.error('Your farmer account is not approved yet. Please wait for admin approval.');
        navigate('/farmer/dashboard');
      } else {
        toast.error(error.response?.data?.message || 'Failed to create product');
      }
    },
  });

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      images.forEach((image) => {
        formData.append('images', image.file);
      });

      if (images[0]) {
        formData.append('thumbnail', images[0].file);
      }

      createProductMutation.mutate(formData);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AddProductForm
      onSubmit={onSubmit}
      isSubmitting={createProductMutation.isPending || uploading}
      onCancel={() => navigate('/farmer/products')}
      images={images}
      setImages={setImages}
    />
  );
};

export default AddProduct;
