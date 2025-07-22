import React from 'react';
import EquipmentCard from '../components/EquipmentCard';
import tractor from '../assets/tractor.jpeg'
import drone from '../assets/drone.png';
import harvest from '../assets/harvest.jpg';

const EquipmentList = () => {
  const equipmentData = [
    { title: 'Tractor', image: tractor },
    { title: 'Harvester', image: harvest },
    { title: 'Drone', image: drone },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Equipment Sharing & Mechanisation</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {equipmentData.map(equip => (
          <EquipmentCard key={equip.title} title={equip.title} image={equip.image} />
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
