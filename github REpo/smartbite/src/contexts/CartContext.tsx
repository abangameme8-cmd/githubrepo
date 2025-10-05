import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/servesoft-api';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) {
      setItems([]);
      setTotal(0);
      return;
    }

    try {
      const response = await cartAPI.getCart();
      const cartItems = response.data.items.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        restaurantId: item.restaurant_id.toString(),
        restaurantName: ''
      }));
      setItems(cartItems);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setItems([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setItems([]);
      setTotal(0);
    }
  }, [user]);

  const addItem = async (newItem: Omit<CartItem, 'quantity'>) => {
    try {
      await cartAPI.addToCart(parseInt(newItem.id), 1);
      await refreshCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await cartAPI.removeFromCart(parseInt(id));
      await refreshCart();
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      await cartAPI.removeFromCart(parseInt(id));

      await cartAPI.addToCart(parseInt(id.split('_')[0]), quantity);
      await refreshCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      await refreshCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}