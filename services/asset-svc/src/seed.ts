/**
 * Seed assets for development.
 * Run: npm run seed
 */
import 'dotenv/config';
import { withTx } from './with-tenant';

async function main() {
  await withTx(async (tx) => {
    // Create asset types
    const laptop = await tx.assetType.upsert({
      where: { name: 'Laptop' },
      update: {},
      create: { name: 'Laptop' },
    });
    
    const phone = await tx.assetType.upsert({
      where: { name: 'Phone' },
      update: {},
      create: { name: 'Phone' },
    });
    
    const monitor = await tx.assetType.upsert({
      where: { name: 'Monitor' },
      update: {},
      create: { name: 'Monitor' },
    });

    // Create assets
    const assets = [
      { assetId: 'MBP-001', assetTypeId: laptop.id, type: 'Laptop', description: 'MacBook Pro 14', fundingDepartment: 'IT', status: 'available' as const },
      { assetId: 'MBP-002', assetTypeId: laptop.id, type: 'Laptop', description: 'MacBook Pro 16', fundingDepartment: 'IT', status: 'available' as const },
      { assetId: 'IP-011', assetTypeId: phone.id, type: 'Phone', description: 'iPhone 15', fundingDepartment: 'IT', status: 'available' as const },
      { assetId: 'MN-005', assetTypeId: monitor.id, type: 'Monitor', description: 'Dell 27"', fundingDepartment: 'IT', status: 'available' as const },
    ];

    for (const assetData of assets) {
      await tx.asset.upsert({
        where: { assetId: assetData.assetId },
        update: {},
        create: assetData,
      });
    }
  });
  console.log('Seeded assets and asset types');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
