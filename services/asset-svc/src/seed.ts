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
      { assetTag: 'MBP-001', assetTypeId: laptop.id, summary: 'MacBook Pro 14', status: 'available' as const },
      { assetTag: 'MBP-002', assetTypeId: laptop.id, summary: 'MacBook Pro 16', status: 'available' as const },
      { assetTag: 'IP-011', assetTypeId: phone.id, summary: 'iPhone 15', status: 'available' as const },
      { assetTag: 'MN-005', assetTypeId: monitor.id, summary: 'Dell 27"', status: 'available' as const },
    ];

    for (const assetData of assets) {
      await tx.asset.upsert({
        where: { assetTag: assetData.assetTag },
        update: {},
        create: assetData,
      });
    }
  });
  console.log('Seeded assets and asset types');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
