const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding subscription pricing...');

  // Create subscription pricing plans
  const subscriptionPlans = [
    {
      plan: 'FREE',
      price: 0,
      currency: 'EGP',
      features: {
        pharmacist: [
          'Basic profile creation',
          'CV upload',
          'Basic search visibility',
          'Limited job applications'
        ],
        pharmacyOwner: [
          'Basic pharmacy profile',
          'Limited product listings (up to 10)',
          'Basic search visibility',
          'Standard support'
        ]
      }
    },
    {
      plan: 'STANDARD',
      price: 20,
      currency: 'EGP',
      features: {
        pharmacist: [
          'Enhanced profile features',
          'Priority in search results',
          'Unlimited job applications',
          'Advanced analytics',
          'Email notifications'
        ],
        pharmacyOwner: [
          'Enhanced pharmacy profile',
          'Unlimited product listings',
          'Priority in search results',
          'Advanced analytics',
          'Email notifications',
          'Priority support'
        ]
      }
    },
    {
      plan: 'PREMIUM',
      price: 40,
      currency: 'EGP',
      features: {
        pharmacyOwner: [
          'Premium pharmacy profile',
          'Unlimited product listings',
          'Top priority in search results',
          'Advanced analytics & insights',
          'Real-time notifications',
          'Premium support',
          'Featured pharmacy badge',
          'Custom branding options',
          'API access'
        ]
      }
    }
  ];

  for (const planData of subscriptionPlans) {
    await prisma.subscriptionPricing.upsert({
      where: { plan: planData.plan },
      update: {
        price: planData.price,
        currency: planData.currency,
        features: planData.features
      },
      create: planData
    });
    console.log(`Created/Updated ${planData.plan} plan - ${planData.price} ${planData.currency}`);
  }

  console.log('Subscription pricing seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });