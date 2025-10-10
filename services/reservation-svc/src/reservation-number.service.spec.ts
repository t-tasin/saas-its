import { Test, TestingModule } from '@nestjs/testing';
import { ReservationNumberService } from './reservation-number.service';

const mockReservationDayCounter = {
  upsert: jest.fn(),
};

const mockPrisma = {
  reservationDayCounter: mockReservationDayCounter,
} as any;

describe('ReservationNumberService', () => {
  let service: ReservationNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationNumberService],
    }).compile();

    service = module.get<ReservationNumberService>(ReservationNumberService);
    jest.clearAllMocks();
  });

  describe('next', () => {
    it('should generate reservation number in RES-YYYY-NNN format', async () => {
      const year = new Date().getFullYear();
      mockReservationDayCounter.upsert.mockResolvedValue({
        yymmdd: `${year}`,
        seq: 1,
      });

      const reservationNumber = await service.next(mockPrisma);

      expect(reservationNumber).toBe(`RES-${year}-001`);
      expect(mockReservationDayCounter.upsert).toHaveBeenCalledWith({
        where: { yymmdd: `${year}` },
        create: { yymmdd: `${year}`, seq: 1 },
        update: { seq: { increment: 1 } },
      });
    });

    it('should pad sequence number with zeros to 3 digits', async () => {
      const year = new Date().getFullYear();
      mockReservationDayCounter.upsert.mockResolvedValue({
        yymmdd: `${year}`,
        seq: 42,
      });

      const reservationNumber = await service.next(mockPrisma);

      expect(reservationNumber).toBe(`RES-${year}-042`);
    });

    it('should handle large sequence numbers', async () => {
      const year = new Date().getFullYear();
      mockReservationDayCounter.upsert.mockResolvedValue({
        yymmdd: `${year}`,
        seq: 999,
      });

      const reservationNumber = await service.next(mockPrisma);

      expect(reservationNumber).toBe(`RES-${year}-999`);
    });

    it('should handle sequence numbers greater than 3 digits', async () => {
      const year = new Date().getFullYear();
      mockReservationDayCounter.upsert.mockResolvedValue({
        yymmdd: `${year}`,
        seq: 1234,
      });

      const reservationNumber = await service.next(mockPrisma);

      expect(reservationNumber).toBe(`RES-${year}-1234`);
    });
  });
});

