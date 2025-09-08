import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { cartApi } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch cart data only for customers when authenticated
  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    enabled: isAuthenticated && user?.role === 'customer',
  });

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartApi.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Added to cart successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartApi.updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Cart updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productId) => cartApi.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Cart cleared successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    },
  });

  const addToCart = (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }
    if (user?.role !== 'customer') {
      toast.error('Only customers can add items to cart');
      return;
    }
    addToCartMutation.mutate({ productId, quantity });
  };

  const updateCartItem = (productId, quantity) => {
    if (!isAuthenticated || user?.role !== 'customer') return;
    updateCartItemMutation.mutate({ productId, quantity });
  };

  const removeFromCart = (productId) => {
    if (!isAuthenticated || user?.role !== 'customer') return;
    removeFromCartMutation.mutate(productId);
  };

  const clearCart = () => {
    if (!isAuthenticated || user?.role !== 'customer') return;
    clearCartMutation.mutate();
  };

  const getCartCount = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    items: cartData?.items || [],
    total: getCartTotal(),
    itemCount: getCartCount(),
    loading: cartLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    addToCartLoading: addToCartMutation.isPending,
    updateCartLoading: updateCartItemMutation.isPending,
    removeCartLoading: removeFromCartMutation.isPending,
    clearCartLoading: clearCartMutation.isPending,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
