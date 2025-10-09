/**
 * Minimal audit logger for asset-svc.
 */
import { Injectable } from '@nestjs/common';
import type { Tx } from '../db';

@Injectable()
export class AuditService {
  async log(
    tx: Tx,
    data: { entity: string; entityId: string; action: string; actorId?: string; metadata?: any }
  ) {
    await tx.auditLog.create({
      data: {
        entity: data.entity,
        entityId: data.entityId,
        action: data.action,
        actorId: data.actorId ?? null,
        metadata: data.metadata ?? null,
      },
    });
  }
}
