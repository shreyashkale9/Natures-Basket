import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderApi } from '../../services/api';
import ShippingForm from '../../components/customer/ShippingForm';
import PaymentForm from '../../components/customer/PaymentForm';
import OrderSummary from '../../components/customer/OrderSummary';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => orderApi.createOrder(orderData),
    onSuccess: (data) => {
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/customer/orders/${data._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setIsProcessing(false);
    },
  });

  const onSubmit = async (data) => {
    if (itemCount === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    const orderData = {
      items: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
      },
      paymentMethod,
      total: total * 1.05, // Including platform fee
      platformFee: total * 0.05,
    };

    createOrderMutation.mutate(orderData);
  };

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some products to your cart before checkout.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/customer/cart')}
          className="btn-outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ShippingForm register={register} errors={errors} />
            <PaymentForm 
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              register={register}
              errors={errors}
            />
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            total={total}
            itemCount={itemCount}
            onSubmit={handleSubmit(onSubmit)}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
