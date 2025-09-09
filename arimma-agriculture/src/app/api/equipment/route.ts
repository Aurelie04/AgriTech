import { NextRequest, NextResponse } from 'next/server';

// Mock equipment data for tractors, harvesters, and drones
const generateEquipmentData = () => {
  const tractors = [
    {
      id: 'tractor-001',
      name: 'John Deere 6120M',
      type: 'tractor',
      category: 'Tractor',
      description: 'Powerful 120HP tractor perfect for plowing, planting, and general farm work. Features advanced hydraulics and comfortable operator cabin.',
      image: '/equipment/tractor-john-deere.jpg',
      specifications: {
        power: '120 HP',
        fuelType: 'Diesel',
        transmission: 'Hydrostatic',
        weight: '4,200 kg',
        maxSpeed: '40 km/h',
        ptoSpeed: '540/1000 RPM'
      },
      pricing: {
        hourly: 450,
        daily: 3200,
        weekly: 18000,
        monthly: 65000
      },
      availability: {
        status: 'Available',
        nextAvailable: '2024-01-15',
        location: 'Pretoria, Gauteng'
      },
      features: [
        '4WD System',
        'Air-conditioned Cab',
        'GPS Ready',
        'Hydraulic Remotes',
        'PTO Shaft',
        'Three-point Hitch'
      ],
      rating: 4.8,
      reviews: 24,
      cooperative: true,
      serviceModel: 'Pay-per-use'
    },
    {
      id: 'tractor-002',
      name: 'Massey Ferguson 4707',
      type: 'tractor',
      category: 'Tractor',
      description: 'Reliable 75HP compact tractor ideal for small to medium farms. Excellent fuel efficiency and easy maintenance.',
      image: '/equipment/tractor-massey-ferguson.jpg',
      specifications: {
        power: '75 HP',
        fuelType: 'Diesel',
        transmission: 'Manual 12F/4R',
        weight: '2,800 kg',
        maxSpeed: '30 km/h',
        ptoSpeed: '540 RPM'
      },
      pricing: {
        hourly: 320,
        daily: 2200,
        weekly: 12000,
        monthly: 42000
      },
      availability: {
        status: 'Available',
        nextAvailable: '2024-01-12',
        location: 'Cape Town, Western Cape'
      },
      features: [
        '2WD/4WD Selectable',
        'Open Station',
        'Mechanical PTO',
        'Category I/II Hitch',
        'Power Steering',
        'Dual Clutch'
      ],
      rating: 4.6,
      reviews: 18,
      cooperative: true,
      serviceModel: 'Pay-per-use'
    },
    {
      id: 'tractor-003',
      name: 'New Holland T7.210',
      type: 'tractor',
      category: 'Tractor',
      description: 'High-tech 210HP tractor with precision farming capabilities. Perfect for large-scale operations and precision agriculture.',
      image: '/equipment/tractor-new-holland.jpg',
      specifications: {
        power: '210 HP',
        fuelType: 'Diesel',
        transmission: 'CVT',
        weight: '6,500 kg',
        maxSpeed: '50 km/h',
        ptoSpeed: '540/1000 RPM'
      },
      pricing: {
        hourly: 680,
        daily: 4800,
        weekly: 28000,
        monthly: 95000
      },
      availability: {
        status: 'Booked',
        nextAvailable: '2024-01-20',
        location: 'Durban, KwaZulu-Natal'
      },
      features: [
        'CVT Transmission',
        'Climate Control Cab',
        'AutoSteer Ready',
        'Variable Rate Control',
        'ISOBUS Compatible',
        'Load Sensing Hydraulics'
      ],
      rating: 4.9,
      reviews: 31,
      cooperative: false,
      serviceModel: 'Equipment-as-a-Service'
    }
  ];

  const harvesters = [
    {
      id: 'harvester-001',
      name: 'John Deere S760',
      type: 'harvester',
      category: 'Combine Harvester',
      description: 'Advanced 300HP combine harvester with 7.6m cutting width. Features advanced grain handling and loss monitoring systems.',
      image: '/equipment/harvester-john-deere.jpg',
      specifications: {
        power: '300 HP',
        cuttingWidth: '7.6 m',
        grainTank: '10,000 L',
        fuelType: 'Diesel',
        weight: '12,500 kg',
        maxSpeed: '25 km/h'
      },
      pricing: {
        hourly: 1200,
        daily: 8500,
        weekly: 45000,
        monthly: 150000
      },
      availability: {
        status: 'Available',
        nextAvailable: '2024-01-18',
        location: 'Bloemfontein, Free State'
      },
      features: [
        '7.6m Cutting Header',
        '10,000L Grain Tank',
        'AutoTrac Guidance',
        'Yield Mapping',
        'Loss Monitoring',
        'Variable Speed Control'
      ],
      rating: 4.9,
      reviews: 42,
      cooperative: true,
      serviceModel: 'Pay-per-use'
    },
    {
      id: 'harvester-002',
      name: 'Case IH 9240',
      type: 'harvester',
      category: 'Combine Harvester',
      description: 'Reliable 240HP combine harvester with 6.1m cutting width. Excellent for wheat, corn, and soybean harvesting.',
      image: '/equipment/harvester-case-ih.jpg',
      specifications: {
        power: '240 HP',
        cuttingWidth: '6.1 m',
        grainTank: '8,500 L',
        fuelType: 'Diesel',
        weight: '10,200 kg',
        maxSpeed: '22 km/h'
      },
      pricing: {
        hourly: 950,
        daily: 6800,
        weekly: 36000,
        monthly: 120000
      },
      availability: {
        status: 'Available',
        nextAvailable: '2024-01-14',
        location: 'Nelspruit, Mpumalanga'
      },
      features: [
        '6.1m Cutting Header',
        '8,500L Grain Tank',
        'Rotor Separation',
        'Grain Loss Sensors',
        'Auto Height Control',
        'Unloading Auger'
      ],
      rating: 4.7,
      reviews: 28,
      cooperative: true,
      serviceModel: 'Pay-per-use'
    }
  ];

  const drones = [
    {
      id: 'drone-001',
      name: 'DJI Agras T40',
      type: 'drone',
      category: 'Spraying Drone',
      description: 'Professional agricultural drone with 40L tank capacity for precision spraying. Features advanced flight control and obstacle avoidance.',
      image: '/equipment/drone-dji-agras.jpg',
      specifications: {
        tankCapacity: '40 L',
        sprayWidth: '11 m',
        flightTime: '18 min',
        maxSpeed: '15 m/s',
        weight: '26 kg',
        battery: 'Lithium Polymer'
      },
      pricing: {
        hourly: 800,
        daily: 5500,
        weekly: 28000,
        monthly: 95000
      },
      availability: {
        status: 'Available',
        nextAvailable: '2024-01-13',
        location: 'Johannesburg, Gauteng'
      },
      features: [
        '40L Spray Tank',
        'Dual Atomizing Spray',
        'RTK GPS Positioning',
        'Obstacle Avoidance',
        'Variable Rate Application',
        'Weather Monitoring'
      ],
      rating: 4.8,
      reviews: 35,
      cooperative: true,
      serviceModel: 'Equipment-as-a-Service'
    },
    {
      id: 'drone-002',
      name: 'Yamaha RMAX II',
      type: 'drone',
      category: 'Spraying Drone',
      description: 'Heavy-duty spraying drone with 16L capacity. Reliable and efficient for large-scale crop protection applications.',
      image: '/equipment/drone-yamaha-rmax.jpg',
      specifications: {
        tankCapacity: '16 L',
        sprayWidth: '8 m',
        flightTime: '25 min',
        maxSpeed: '12 m/s',
        weight: '18 kg',
        battery: 'Gasoline Engine'
      },
      pricing: {
        hourly: 600,
        daily: 4200,
        weekly: 22000,
        monthly: 75000
      },
      availability: {
        status: 'Available',
        nextAvailable: '2024-01-16',
        location: 'Port Elizabeth, Eastern Cape'
      },
      features: [
        '16L Spray Tank',
        'Gasoline Engine',
        'Long Flight Time',
        'Precision Spraying',
        'GPS Navigation',
        'Remote Monitoring'
      ],
      rating: 4.6,
      reviews: 22,
      cooperative: true,
      serviceModel: 'Pay-per-use'
    },
    {
      id: 'drone-003',
      name: 'Parrot Bluegrass Fields',
      type: 'drone',
      category: 'Monitoring Drone',
      description: 'Multispectral imaging drone for crop monitoring and analysis. Perfect for precision agriculture and crop health assessment.',
      image: '/equipment/drone-parrot-bluegrass.jpg',
      specifications: {
        camera: 'Multispectral 4K',
        flightTime: '25 min',
        maxSpeed: '15 m/s',
        weight: '1.5 kg',
        battery: 'Lithium Polymer',
        range: '2 km'
      },
      pricing: {
        hourly: 400,
        daily: 2800,
        weekly: 15000,
        monthly: 50000
      },
      availability: {
        status: 'Available',
        nextAvailable: '2024-01-11',
        location: 'Polokwane, Limpopo'
      },
      features: [
        'Multispectral Imaging',
        'NDVI Analysis',
        'Autonomous Flight',
        'Real-time Data',
        'Cloud Processing',
        'Crop Health Mapping'
      ],
      rating: 4.7,
      reviews: 19,
      cooperative: false,
      serviceModel: 'Equipment-as-a-Service'
    }
  ];

  // Farmer cooperatives data
  const cooperatives = [
    {
      id: 'coop-001',
      name: 'Gauteng Farmers Cooperative',
      location: 'Pretoria, Gauteng',
      members: 45,
      equipment: ['tractor-001', 'tractor-002', 'harvester-001', 'drone-001'],
      benefits: [
        'Shared equipment costs',
        'Priority booking',
        'Bulk maintenance discounts',
        'Technical support'
      ],
      membershipFee: 2500,
      discount: 15
    },
    {
      id: 'coop-002',
      name: 'Western Cape Agri Alliance',
      location: 'Cape Town, Western Cape',
      members: 32,
      equipment: ['tractor-002', 'harvester-002', 'drone-002'],
      benefits: [
        'Equipment sharing',
        'Training programs',
        'Insurance coverage',
        'Market access'
      ],
      membershipFee: 2000,
      discount: 12
    },
    {
      id: 'coop-003',
      name: 'Free State Equipment Pool',
      location: 'Bloemfontein, Free State',
      members: 28,
      equipment: ['tractor-003', 'harvester-001', 'drone-003'],
      benefits: [
        'High-end equipment access',
        'Expert consultation',
        'Maintenance included',
        'Flexible scheduling'
      ],
      membershipFee: 3500,
      discount: 20
    }
  ];

  // Service models
  const serviceModels = [
    {
      id: 'pay-per-use',
      name: 'Pay-per-Use',
      description: 'Rent equipment for specific periods - hourly, daily, weekly, or monthly rates',
      benefits: [
        'No upfront investment',
        'Flexible scheduling',
        'Latest equipment access',
        'Maintenance included'
      ],
      pricing: 'Variable based on duration',
      bestFor: 'Small to medium farms, seasonal work'
    },
    {
      id: 'equipment-as-a-service',
      name: 'Equipment-as-a-Service',
      description: 'Comprehensive equipment management including maintenance, insurance, and support',
      benefits: [
        'Full service package',
        'Predictable costs',
        'Priority support',
        'Technology updates'
      ],
      pricing: 'Fixed monthly fee',
      bestFor: 'Large farms, continuous operations'
    },
    {
      id: 'cooperative-sharing',
      name: 'Cooperative Sharing',
      description: 'Join farmer cooperatives to share equipment costs and access',
      benefits: [
        'Reduced individual costs',
        'Community support',
        'Bulk purchasing power',
        'Knowledge sharing'
      ],
      pricing: 'Membership fee + usage rates',
      bestFor: 'Small farms, cost-conscious farmers'
    }
  ];

  return {
    tractors,
    harvesters,
    drones,
    cooperatives,
    serviceModels,
    totalEquipment: tractors.length + harvesters.length + drones.length,
    lastUpdated: new Date().toISOString()
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // tractor, harvester, drone, all
    const cooperative = searchParams.get('cooperative'); // true, false, all
    const serviceModel = searchParams.get('serviceModel'); // pay-per-use, equipment-as-a-service, cooperative-sharing, all

    const equipmentData = generateEquipmentData();
    
    let filteredData = equipmentData;

    // Filter by equipment type
    if (type && type !== 'all') {
      filteredData = {
        ...equipmentData,
        tractors: type === 'tractor' ? equipmentData.tractors : [],
        harvesters: type === 'harvester' ? equipmentData.harvesters : [],
        drones: type === 'drone' ? equipmentData.drones : []
      };
    }

    // Filter by cooperative availability
    if (cooperative && cooperative !== 'all') {
      const isCooperative = cooperative === 'true';
      filteredData = {
        ...filteredData,
        tractors: filteredData.tractors.filter((item: any) => item.cooperative === isCooperative),
        harvesters: filteredData.harvesters.filter((item: any) => item.cooperative === isCooperative),
        drones: filteredData.drones.filter((item: any) => item.cooperative === isCooperative)
      };
    }

    // Filter by service model
    if (serviceModel && serviceModel !== 'all') {
      filteredData = {
        ...filteredData,
        tractors: filteredData.tractors.filter((item: any) => item.serviceModel === serviceModel),
        harvesters: filteredData.harvesters.filter((item: any) => item.serviceModel === serviceModel),
        drones: filteredData.drones.filter((item: any) => item.serviceModel === serviceModel)
      };
    }

    return NextResponse.json({
      success: true,
      data: filteredData
    });

  } catch (error) {
    console.error('Equipment API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch equipment data' },
      { status: 500 }
    );
  }
}
