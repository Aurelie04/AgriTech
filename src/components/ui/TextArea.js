import React from "react";

export const TextArea = ({ value, onChange, label }) => {
  return (
    <div>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-300"
        rows="4"
      />
    </div>
  );
};
