import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ReservationService } from './reservation.service';

const mockEquipmentAvailability = {
  findUnique: jest.fn(),
};

const mockReservation = {
  findMany: jest.fn(),
};

const mockPrisma = {
  equipmentAvailability: mockEquipmentAvailability,
  reservation: mockReservation,
} as any;

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationService],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    jest.clearAllMocks();
  });

  describe('checkAvailability', () => {
    it('should return available if equipment has sufficient quantity', async () => {
      const equipmentType = 'Laptop';
      const requestedQty = 2;
      const startDate = new Date('2025-01-15');
      const endDate = new Date('2025-01-20');

      mockEquipmentAvailability.findUnique.mockResolvedValue({
        assetTypeName: equipmentType,
        totalQuantity: 10,
      });

      mockReservation.findMany.mockResolvedValue([
        { quantity: 3, status: 'active' },
        { quantity: 2, status: 'approved' },
      ]);

      const result = await service.checkAvailability(
        mockPrisma,
        equipmentType,
        requestedQty,
        startDate,
        endDate
      );

      expect(result.available).toBe(true);
      expect(result.totalQuantity).toBe(10);
      expect(result.reserved).toBe(5);
      expect(result.availableQuantity).toBe(5);
    });

    it('should return unavailable if equipment has insufficient quantity', async () => {
      const equipmentType = 'Projector';
      const requestedQty = 5;

      mockEquipmentAvailability.findUnique.mockResolvedValue({
        assetTypeName: equipmentType,
        totalQuantity: 3,
      });

      mockReservation.findMany.mockResolvedValue([]);

      const result = await service.checkAvailability(
        mockPrisma,
        equipmentType,
        requestedQty,
        new Date(),
        new Date()
      );

      expect(result.available).toBe(false);
      expect(result.totalQuantity).toBe(3);
      expect(result.availableQuantity).toBe(3);
    });

    it('should throw BadRequestException if equipment type not found', async () => {
      mockEquipmentAvailability.findUnique.mockResolvedValue(null);

      await expect(
        service.checkAvailability(
          mockPrisma,
          'NonExistentType',
          1,
          new Date(),
          new Date()
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should exclude cancelled and denied reservations from count', async () => {
      mockEquipmentAvailability.findUnique.mockResolvedValue({
        assetTypeName: 'Monitor',
        totalQuantity: 20,
      });

      mockReservation.findMany.mockResolvedValue([
        { quantity: 5, status: 'active' },
        { quantity: 3, status: 'cancelled' }, // Should be excluded
        { quantity: 2, status: 'denied' },    // Should be excluded
      ]);

      const result = await service.checkAvailability(
        mockPrisma,
        'Monitor',
        3,
        new Date(),
        new Date()
      );

      expect(result.reserved).toBe(5);
      expect(result.availableQuantity).toBe(15);
    });
  });
});

