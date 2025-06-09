const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedCitiesAndAreas() {
  console.log('Seeding cities and areas...');

  try {
    // Read the cities and areas data
    const dataPath = path.join(__dirname, '..', 'data', 'egypt-cities-areas.json');
    const citiesData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    for (const cityData of citiesData.cities) {
      console.log(`Processing city: ${cityData.name}`);
      
      // Create or update city
      const city = await prisma.city.upsert({
        where: { id: cityData.id },
        update: {
          name: cityData.name,
          nameAr: cityData.nameAr
        },
        create: {
          id: cityData.id,
          name: cityData.name,
          nameAr: cityData.nameAr
        }
      });

      // Create areas for this city
      for (const areaName of cityData.areas) {
        await prisma.area.upsert({
          where: {
            name_cityId: {
              name: areaName,
              cityId: city.id
            }
          },
          update: {
            name: areaName
          },
          create: {
            name: areaName,
            cityId: city.id
          }
        });
      }

      console.log(`✓ Created city ${cityData.name} with ${cityData.areas.length} areas`);
    }

    console.log('Cities and areas seeded successfully!');
  } catch (error) {
    console.error('Error seeding cities and areas:', error);
    throw error;
  }
}

async function main() {
  await seedCitiesAndAreas();
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedCitiesAndAreas };