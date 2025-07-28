import React from 'react';
import EquipmentCard from '../components/EquipmentCard';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

import tractor from '../assets/tractor.jpeg';
import drone from '../assets/drone.png';
import harvest from '../assets/harvest.jpg';

const EquipmentList = () => {
  const equipmentData = [
    { title: 'Tractor', image: tractor },
    { title: 'Harvester', image: harvest },
    { title: 'Drone', image: drone },
  ];

  return (
    <div className="bg-gray-100 min-h-screen text-sm md:text-base">
      {/* Topbar */}
      <Topbar />

      {/* Main content with sidebar and page content */}
      <div className="pt-24 px-4 md:px-8 flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>

        {/* Page content */}
        <div className="flex-1 p-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Equipment Sharing & Mechanisation
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {equipmentData.map((equip) => (
              <EquipmentCard
                key={equip.title}
                title={equip.title}
                image={equip.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;
