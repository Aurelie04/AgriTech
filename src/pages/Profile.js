import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    address: '',
    business: '',
  });
  const [message, setMessage] = useState('');

  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (userData && userData.id) {
      axios
        .get(`http://localhost:8081/api/farmer/${userData.id}`)
        .then((res) => {
          if (res.data) {
            setProfile({
              name: res.data.name,
              phone: res.data.phone || '',
              address: res.data.address || '',
              business: res.data.business || '',
            });
          }
        })
        .catch((err) => {
          console.error('Error fetching profile:', err);
        });
    }
  }, [userData]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8081/api/farmer/${userData.id}`, profile)
      .then(() => {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        console.error('Update error:', err);
        setMessage('Failed to update profile.');
        setTimeout(() => setMessage(''), 3000);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-24 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">My Profile</h2>

        {message && (
          <div className="mb-4 text-center text-sm text-blue-600">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Business</label>
            <input
              type="text"
              name="business"
              value={profile.business}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
