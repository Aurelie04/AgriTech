import React from 'react';
import { useNavigate } from 'react-router-dom';

const EquipmentCard = ({ title, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/equipment/${title.toLowerCase()}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer border shadow-md p-4 rounded hover:shadow-lg">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <h2 className="text-xl font-bold mt-2 text-center">{title}</h2>
    </div>
  );
};

export default EquipmentCard;
