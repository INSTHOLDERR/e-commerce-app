import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setProfileData(response.data.user);
        setProducts(response.data.products);
        console.log(response.data.products);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {loading && <p>Loading...</p>}
      {profileData && (
        <div className="profile-details">
          <img src={profileData.image} alt="Profile" className="profile-image" />
          <p><strong>Username:</strong> {profileData.username}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Phone:</strong> {profileData.phone}</p>

          <h3>Your Products</h3>

          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id}>
                <p><strong>Title:</strong> {product.title}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Description:</strong> {product.description}</p>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
