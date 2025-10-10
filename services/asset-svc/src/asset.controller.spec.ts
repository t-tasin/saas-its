import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';
import { AuditService } from './shared/audit.service';

const mockAuditService = {
  log: jest.fn(),
};

describe('AssetController', () => {
  let controller: AssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    controller = module.get<AssetController>(AssetController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Asset CRUD Operations', () => {
    it('should have list method', () => {
      expect(controller.list).toBeDefined();
    });

    it('should have create method', () => {
      expect(controller.create).toBeDefined();
    });

    it('should have assign method', () => {
      expect(controller.assign).toBeDefined();
    });

    it('should have unassign method', () => {
      expect(controller.unassign).toBeDefined();
    });

    it('should have getAssetTypes method', () => {
      expect(controller.getAssetTypes).toBeDefined();
    });

    it('should have getUserAssets method', () => {
      expect(controller.getUserAssets).toBeDefined();
    });
  });

  describe('Audit Service Integration', () => {
    it('should inject AuditService', () => {
      expect(controller['audit']).toBe(mockAuditService);
    });
  });
});

