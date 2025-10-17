import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.vehicleDocument.deleteMany();
  await prisma.vehicleInsurance.deleteMany();
  await prisma.vehicleRefuelLog.deleteMany();
  await prisma.vehicleServiceLog.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.owner.deleteMany();

  // Create Owners
  console.log('👤 Creating owners...');
  const owner1 = await prisma.owner.create({
    data: {
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      address: '123 Main St, New York, NY 10001',
      dob: new Date('1985-05-15'),
    },
  });

  const owner2 = await prisma.owner.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      dob: new Date('1990-08-22'),
    },
  });

  const owner3 = await prisma.owner.create({
    data: {
      firstName: 'Robert',
      middleName: 'James',
      lastName: 'Johnson',
      email: 'robert.johnson@example.com',
      phone: '+1234567892',
      address: '789 Pine Rd, Chicago, IL 60601',
      dob: new Date('1978-03-10'),
    },
  });

  console.log(`✅ Created ${3} owners`);

  // Create Vehicles
  console.log('🚗 Creating vehicles...');
  const vehicle1 = await prisma.vehicle.create({
    data: {
      ownerId: owner1.id,
      make: 'Toyota',
      model: 'Camry',
      variant: 'XLE',
      fuelType: 'Petrol',
      color: 'Silver',
      yearOfManufacture: 2020,
      chassisNumber: 'CHAS123456789',
      engineNumber: 'ENG123456789',
      odometer: 25000,
      vehicleType: 'Sedan',
      rtoLocation: 'NY-RTO-001',
      registrationNumber: 'NY-1234-AB',
      insurancePolicyNumber: 'INS-2020-001',
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      ownerId: owner1.id,
      make: 'Honda',
      model: 'CR-V',
      variant: 'EX',
      fuelType: 'Diesel',
      color: 'Black',
      yearOfManufacture: 2019,
      chassisNumber: 'CHAS987654321',
      engineNumber: 'ENG987654321',
      odometer: 42000,
      vehicleType: 'SUV',
      rtoLocation: 'NY-RTO-001',
      registrationNumber: 'NY-5678-CD',
      insurancePolicyNumber: 'INS-2019-002',
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      ownerId: owner2.id,
      make: 'Tesla',
      model: 'Model 3',
      variant: 'Long Range',
      fuelType: 'Electric',
      color: 'White',
      yearOfManufacture: 2022,
      chassisNumber: 'CHAS111222333',
      engineNumber: 'ENG111222333',
      odometer: 8000,
      vehicleType: 'Sedan',
      rtoLocation: 'CA-RTO-002',
      registrationNumber: 'CA-9999-EF',
      insurancePolicyNumber: 'INS-2022-003',
    },
  });

  const vehicle4 = await prisma.vehicle.create({
    data: {
      ownerId: owner3.id,
      make: 'Ford',
      model: 'F-150',
      variant: 'Raptor',
      fuelType: 'Petrol',
      color: 'Red',
      yearOfManufacture: 2021,
      chassisNumber: 'CHAS444555666',
      engineNumber: 'ENG444555666',
      odometer: 15000,
      vehicleType: 'Truck',
      rtoLocation: 'IL-RTO-003',
      registrationNumber: 'IL-7777-GH',
      insurancePolicyNumber: 'INS-2021-004',
    },
  });

  const vehicle5 = await prisma.vehicle.create({
    data: {
      ownerId: owner2.id,
      make: 'BMW',
      model: 'X5',
      variant: 'M Sport',
      fuelType: 'Diesel',
      color: 'Blue',
      yearOfManufacture: 2023,
      chassisNumber: 'CHAS777888999',
      engineNumber: 'ENG777888999',
      odometer: 5000,
      vehicleType: 'SUV',
      rtoLocation: 'CA-RTO-002',
      registrationNumber: 'CA-1111-IJ',
      insurancePolicyNumber: 'INS-2023-005',
    },
  });

  console.log(`✅ Created ${5} vehicles`);

  // Create Service Logs
  console.log('🔧 Creating service logs...');
  await prisma.vehicleServiceLog.createMany({
    data: [
      {
        vehicleId: vehicle1.id,
        serviceDate: new Date('2023-03-15'),
        serviceType: 'Oil Change',
        stationName: 'Quick Service Center',
        stationAddress: '100 Service Rd, NY',
        odometerAtService: 20000,
        cost: 75.50,
        notes: 'Regular oil change with synthetic oil',
      },
      {
        vehicleId: vehicle1.id,
        serviceDate: new Date('2023-09-10'),
        serviceType: 'Tire Rotation',
        stationName: 'Quick Service Center',
        stationAddress: '100 Service Rd, NY',
        odometerAtService: 24500,
        cost: 45.00,
        notes: 'Rotated all four tires',
      },
      {
        vehicleId: vehicle2.id,
        serviceDate: new Date('2023-05-20'),
        serviceType: 'Full Service',
        stationName: 'Honda Authorized Service',
        stationAddress: '200 Auto Lane, NY',
        odometerAtService: 38000,
        cost: 350.00,
        notes: 'Full service including brake inspection',
      },
      {
        vehicleId: vehicle3.id,
        serviceDate: new Date('2023-07-01'),
        serviceType: 'Software Update',
        stationName: 'Tesla Service Center',
        stationAddress: '300 Tech Blvd, CA',
        odometerAtService: 6000,
        cost: 0.00,
        notes: 'Free software update',
      },
    ],
  });

  console.log(`✅ Created service logs`);

  // Create Refuel Logs
  console.log('⛽ Creating refuel logs...');
  await prisma.vehicleRefuelLog.createMany({
    data: [
      {
        vehicleId: vehicle1.id,
        refuelDate: new Date('2024-01-05'),
        fuelType: 'Petrol',
        quantityLitres: 45.5,
        totalCost: 68.25,
        odometerAtRefuel: 24800,
        stationName: 'Shell Gas Station',
        location: 'NY Downtown',
      },
      {
        vehicleId: vehicle1.id,
        refuelDate: new Date('2024-02-10'),
        fuelType: 'Petrol',
        quantityLitres: 42.0,
        totalCost: 63.00,
        odometerAtRefuel: 25000,
        stationName: 'Exxon',
        location: 'NY Highway',
      },
      {
        vehicleId: vehicle2.id,
        refuelDate: new Date('2024-01-15'),
        fuelType: 'Diesel',
        quantityLitres: 55.0,
        totalCost: 77.00,
        odometerAtRefuel: 41500,
        stationName: 'BP Gas Station',
        location: 'NY Central',
      },
      {
        vehicleId: vehicle4.id,
        refuelDate: new Date('2024-02-01'),
        fuelType: 'Petrol',
        quantityLitres: 75.0,
        totalCost: 112.50,
        odometerAtRefuel: 14800,
        stationName: 'Marathon',
        location: 'IL Main St',
      },
    ],
  });

  console.log(`✅ Created refuel logs`);

  // Create Insurances
  console.log('📋 Creating insurance records...');
  await prisma.vehicleInsurance.createMany({
    data: [
      {
        vehicleId: vehicle1.id,
        policyNumber: 'POL-2023-001',
        provider: 'State Farm',
        premiumAmount: 1200.00,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2024-01-01'),
        isActive: true,
      },
      {
        vehicleId: vehicle2.id,
        policyNumber: 'POL-2023-002',
        provider: 'Geico',
        premiumAmount: 1450.00,
        startDate: new Date('2023-03-15'),
        endDate: new Date('2024-03-15'),
        isActive: true,
      },
      {
        vehicleId: vehicle3.id,
        policyNumber: 'POL-2023-003',
        provider: 'Progressive',
        premiumAmount: 1800.00,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-06-01'),
        isActive: true,
      },
      {
        vehicleId: vehicle4.id,
        policyNumber: 'POL-2023-004',
        provider: 'Allstate',
        premiumAmount: 1350.00,
        startDate: new Date('2023-02-10'),
        endDate: new Date('2024-02-10'),
        isActive: true,
      },
      {
        vehicleId: vehicle5.id,
        policyNumber: 'POL-2023-005',
        provider: 'Liberty Mutual',
        premiumAmount: 2100.00,
        startDate: new Date('2023-08-01'),
        endDate: new Date('2024-08-01'),
        isActive: true,
      },
    ],
  });

  console.log(`✅ Created insurance records`);

  // Create Documents
  console.log('📄 Creating vehicle documents...');
  await prisma.vehicleDocument.createMany({
    data: [
      {
        vehicleId: vehicle1.id,
        docType: 'Registration Certificate',
        fileUrl: '/documents/registration-vehicle1.pdf',
        fileName: 'registration-vehicle1.pdf',
        validFrom: new Date('2020-01-01'),
        validTill: new Date('2030-01-01'),
      },
      {
        vehicleId: vehicle1.id,
        docType: 'Insurance Policy',
        fileUrl: '/documents/insurance-vehicle1.pdf',
        fileName: 'insurance-vehicle1.pdf',
        validFrom: new Date('2023-01-01'),
        validTill: new Date('2024-01-01'),
      },
      {
        vehicleId: vehicle3.id,
        docType: 'Registration Certificate',
        fileUrl: '/documents/registration-vehicle3.pdf',
        fileName: 'registration-vehicle3.pdf',
        validFrom: new Date('2022-06-01'),
        validTill: new Date('2032-06-01'),
      },
    ],
  });

  console.log(`✅ Created vehicle documents`);

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Owners: 3`);
  console.log(`   - Vehicles: 5`);
  console.log(`   - Service Logs: 4`);
  console.log(`   - Refuel Logs: 4`);
  console.log(`   - Insurance Records: 5`);
  console.log(`   - Documents: 3`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
