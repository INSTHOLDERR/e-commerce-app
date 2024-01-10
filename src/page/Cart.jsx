import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchCartItems = async () => {
    try {
      const response = await axios.get('/api/get-cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCartItems(response.data.cartDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);
  console.log("avvv", cartItems);


  const handleIncrement = async (cartItems) => {

    let productId = cartItems.productId;
    let userId = cartItems.userId;
    console.log(productId,userId);

    try {

      const response = await axios.post('/api/increment-cart', {
        productId,
        userId,
      });

      if (response.status === 200) {
        alert('Successfully added to cart!');
      }

      fetchCartItems();
    } catch (error) {
      console.error('Error incrementing cart item count:', error);
      alert('Error incrementing cart item count. Please try again.');
    }
  };


  const handleDecrement = async (cartItems) => {
    let productId = cartItems.productId;
    let userId = cartItems.userId;
    console.log(productId,userId);

    try {
     const response = await axios.post('/api/decrement-cart', {
        productId,
        userId,
      });
      if (response.status === 200) {
        alert(response.data.msg);  
        
      }
      fetchCartItems();
    } catch (error) {
      console.error('Error decrementing cart item count:', error);
      alert(response.data.msg)
    }
  };



  return (
    <div>
      <h2>Your Cart</h2>
      {loading && <p>Loading...</p>}
      {!loading && cartItems.length === 0 && <p>Your cart is empty.</p>}
      {!loading && cartItems.length > 0 && (
        <ul>
          {cartItems.map((cartItem) => (
            <li key={cartItem._id}>
              <p>Product ID: {cartItem.productId}</p>
              <p>User ID: {cartItem.userId}</p>
              <p>
                Count: {cartItem.count}
                <button onClick={() => handleIncrement(cartItem)}>+</button>
                <button onClick={() => handleDecrement(cartItem)}>-</button>
              </p>
              {cartItem.product && (
                <div>
                  <p>
                    <strong>Title:</strong> {cartItem.product.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {cartItem.product.description}
                  </p>

                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
