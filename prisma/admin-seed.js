const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding admin user and wallet configuration...');

  // Create wallet configuration
  const walletConfig = await prisma.walletConfig.upsert({
    where: { walletAddress: '01026454497' },
    update: {},
    create: {
      walletAddress: '01026454497',
      currency: 'EGP',
      isActive: true,
      description: 'Main payment wallet for subscription upgrades'
    }
  });

  console.log('Wallet configuration created:', walletConfig);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pharmaproject.com' },
    update: {},
    create: {
      email: 'admin@pharmaproject.com',
      password: hashedPassword,
      role: 'ADMIN',
      adminProfile: {
        create: {
          firstName: 'System',
          lastName: 'Administrator'
        }
      }
    },
    include: {
      adminProfile: true
    }
  });

  console.log('Admin user created:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });