  import React, { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';

  const ProductDetails = () => {
    const { productId } = useParams();
    const [uploadedImages, setUploadedImages] = useState([]);
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [uploader, setUploader] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
      const fetchProductDetails = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
          alert('Please register or login');
          navigate('/register');
          return;
        }

        try {
          const response = await axios.get(`/api/view-product/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setProduct(response.data.product);
          setUser(response.data.user);

          
          const filePathArray = response.data.filePath.split(',');
          setUploadedImages(filePathArray);

          setUploader(response.data.userId.userId);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching product details:', error);
          setError('Error fetching product details.');
          setLoading(false);
        }
      };

      fetchProductDetails();
    }, [productId, navigate]);

    const handleAddToCart = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        };

        const data = {
          productId: product._id,
        };

        const response = await axios.post('/api/add-to-cart', data, config);

        if (response.status === 200) {
          alert('Successfully added to cart!');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding to cart.');
      }
    };

    const handleDeleteProduct = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          alert('Please register or login');
          navigate('/register');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.delete(`/api/delete-product/${productId}`, config);

        if (response.status === 200) {
          alert('Product deleted successfully!');
          navigate('/');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product.');
      }
    };

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (!product) {
      return <p>Product not found</p>;
    }

    console.log("aaa",uploadedImages);
    const isUploader = uploader === product.userId;

    return (
      <div>
        <h2>{product.title}</h2>
        <img src={product.thumbnail} alt={product.title} />
        <p>{product.description}</p>
        <p>Stock: {product.stock}</p>
        <p>Username: {user.username}</p>

        <h3>Uploaded Images:</h3>
        <div>
          {uploadedImages.map((image, index) => (
            <img
              key={index}
              src={image.trim()} 
              alt={`Image ${index + 1}`}
              style={{ width: '300px', margin: '10px', height:'300px' }}
            />
          ))}
        </div>

        {!isUploader && <button onClick={handleAddToCart}>Add to Cart</button>}
        {isUploader && <button onClick={handleDeleteProduct}>Delete Product</button>}
      </div>
    );
  };

  export default ProductDetails;
