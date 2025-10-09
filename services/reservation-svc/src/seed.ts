/**
 * Seed data for reservation service
 */
import 'dotenv/config';
import { withTx } from './with-tenant';

async function main() {
  await withTx(async (tx) => {
    // Seed some equipment availability (these would normally sync from asset service)
    // Using fixed UUIDs for testing
    const types = [
      { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Laptop', total: 10, assigned: 3, reserved: 2 },
      { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Phone', total: 20, assigned: 8, reserved: 3 },
      { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Monitor', total: 15, assigned: 5, reserved: 1 },
      { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Projector', total: 5, assigned: 1, reserved: 1 },
    ];

    for (const type of types) {
      await tx.equipmentAvailability.upsert({
        where: { assetTypeId: type.id },
        update: {},
        create: {
          assetTypeId: type.id,
          assetTypeName: type.name,
          totalCount: type.total,
          assignedCount: type.assigned,
          reservedCount: type.reserved,
          availableCount: type.total - type.assigned - type.reserved,
        },
      });
    }

    console.log('Seeded equipment availability');
  });
  
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

