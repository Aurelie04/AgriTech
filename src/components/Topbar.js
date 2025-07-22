import React from 'react';
import { Link } from 'react-router-dom';

export default function Topbar() {
  return (
    <header className="fixed w-full bg-transparent backdrop-blur-sm p-4 z-10 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-bold text-green-700">Arimma</h1>
      <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
        <Link to="/dashboard">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}
