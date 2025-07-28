import React from "react";

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <select
      className="border border-gray-300 p-2 rounded-md w-full"
      value={value}
      onChange={onChange}
      required
    >
      <option value="">Select...</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export { Select };
