import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="text-green-700">
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-20 flex flex-col items-start p-4 space-y-4">
          <Link to="/dashboard" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
          <Link to="/signup" onClick={() => setOpen(false)}>Signup</Link>
          <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
        </div>
      )}
    </div>
  );
}
