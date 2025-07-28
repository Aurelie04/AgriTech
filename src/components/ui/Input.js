import React from "react";

export const Input = ({ type = "text", value, onChange, placeholder, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-300"
      {...props}
    />
  );
};
