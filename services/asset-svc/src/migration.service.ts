/**
 * Migration Service
 * Handles automatic one-time migrations for the asset service
 */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { withTx } from './with-tenant';

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly logger = new Logger(MigrationService.name);
  private migrationCompleted = false;

  /**
   * Run migrations automatically on module initialization
   */
  async onModuleInit() {
    try {
      await this.migrateAssetTypes();
    } catch (error) {
      this.logger.error('Migration failed', error);
      // Don't throw - allow the service to start even if migration fails
    }
  }

  /**
   * Migrate existing asset type strings to AssetType records
   * This is a one-time migration that:
   * 1. Finds all unique type values from existing assets
   * 2. Creates AssetType records for each unique type
   * 3. Updates assets to link to the created AssetType records
   */
  async migrateAssetTypes() {
    if (this.migrationCompleted) {
      return;
    }

    this.logger.log('Starting asset type migration...');

    return withTx(async (tx) => {
      // Check if migration is needed by looking for assets without assetTypeId
      const assetsNeedingMigration = await tx.asset.count({
        where: {
          assetTypeId: null,
          type: { not: '' },
        },
      });

      if (assetsNeedingMigration === 0) {
        this.logger.log('No assets need migration. Skipping.');
        this.migrationCompleted = true;
        return;
      }

      // Get all unique type values from assets
      const uniqueTypes = await tx.asset.groupBy({
        by: ['type'],
        where: {
          type: { not: '' },
        },
      });

      let typesCreated = 0;
      let assetsUpdated = 0;

      for (const { type } of uniqueTypes) {
        try {
          // Check if AssetType already exists (case-insensitive)
          let assetType = await tx.assetType.findFirst({
            where: { name: { equals: type, mode: 'insensitive' } },
          });

          // Create AssetType if it doesn't exist
          if (!assetType) {
            assetType = await tx.assetType.create({
              data: { name: type },
            });
            typesCreated++;
            this.logger.log(`Created AssetType: ${type}`);
          }

          // Update all assets with this type to link to the AssetType
          const updateResult = await tx.asset.updateMany({
            where: {
              type: { equals: type, mode: 'insensitive' },
              assetTypeId: null, // Only update assets that aren't already linked
            },
            data: {
              assetTypeId: assetType.id,
            },
          });

          assetsUpdated += updateResult.count;
        } catch (error: any) {
          this.logger.error(`Error migrating type "${type}": ${error.message}`);
        }
      }

      this.logger.log(
        `Migration completed: Created ${typesCreated} asset types, updated ${assetsUpdated} assets`,
      );
      this.migrationCompleted = true;
    });
  }
}
