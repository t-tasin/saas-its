/**
 * seed.ts
 * Seed 3 technicians for testing
 * Run: npm run seed
 */
import { prisma } from './db.js';
import { logger } from './logger.js';

async function main() {
  logger.info('Seeding technicians...');
  
  // Create 3 technicians
  const technicians = [
    {
      id: 'tech_hardware',
      email: 'hardware@test.com',
      name: 'Alex Hardware',
      specialty: 'hardware',
      googleRefreshToken: 'PLACEHOLDER', // Update after OAuth
      calendarId: 'primary',
      timezone: 'America/New_York',
    },
    {
      id: 'tech_general_1',
      email: 'general1@test.com',
      name: 'Sam Support',
      specialty: 'general',
      googleRefreshToken: 'PLACEHOLDER',
      calendarId: 'primary',
      timezone: 'America/New_York',
    },
    {
      id: 'tech_general_2',
      email: 'general2@test.com',
      name: 'Jordan Tech',
      specialty: 'general',
      googleRefreshToken: 'PLACEHOLDER',
      calendarId: 'primary',
      timezone: 'America/New_York',
    },
  ];
  
  for (const tech of technicians) {
    const existing = await prisma.technician.findUnique({
      where: { id: tech.id },
    });
    
    if (existing) {
      logger.info({ id: tech.id }, 'Technician already exists, skipping');
    } else {
      await prisma.technician.create({ data: tech });
      logger.info({ id: tech.id, name: tech.name }, 'Technician created');
    }
  }
  
  logger.info('Seeding complete!');
  logger.info('Next steps:');
  logger.info('1. Start the service: npm run dev');
  logger.info('2. Setup OAuth for each technician:');
  technicians.forEach(tech => {
    logger.info(`   http://localhost:3400/auth/google/start?technicianId=${tech.id}`);
  });
}

main()
  .catch((e) => {
    logger.error(e, 'Seed error');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

