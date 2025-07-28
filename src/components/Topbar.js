import React from 'react';
import { Link } from 'react-router-dom';
import sitelogo from '../assets/sitelogo.png'; // Adjust path if needed

export default function Topbar() {
  return (
    <header className="fixed w-full bg-white backdrop-blur-sm px-4 py-2 z-10 flex justify-between items-center shadow-sm h-20">
      <div className="flex items-center">
        <img
          src={sitelogo}
          alt="Site Logo"
          className="h-14 w-14 object-contain"
        />
      </div>

      <nav className="hidden md:flex gap-6 text-gray-700 font-medium pr-4">
        <Link to="/dashboard" className="hover:text-green-700">Home</Link>
        <Link to="/profile" className="hover:text-green-700">Profile</Link>
        <Link to="/signup" className="hover:text-green-700">Signup</Link>
        <Link to="/login" className="hover:text-green-700">Login</Link>
      </nav>
    </header>
  );
}
