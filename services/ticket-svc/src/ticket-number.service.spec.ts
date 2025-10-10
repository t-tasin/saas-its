
import { Test, TestingModule } from '@nestjs/testing';
import { TicketNumberService } from './ticket-number.service';

const mockTicketDayCounter = {
  upsert: jest.fn(),
};

const mockTx = {
  ticketDayCounter: mockTicketDayCounter,
} as any;

describe('TicketNumberService', () => {
  let service: TicketNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketNumberService],
    }).compile();

    service = module.get<TicketNumberService>(TicketNumberService);
    jest.clearAllMocks();
  });

  describe('next', () => {
    it('should generate ticket number in TKT-YYYY-NNNNNN format', async () => {
      const year = new Date().getFullYear();
      mockTicketDayCounter.upsert.mockResolvedValue({
        yymmdd: `${year}`,
        seq: 1,
      });

      const ticketNumber = await service.next(mockTx);

      expect(ticketNumber).toBe(`TKT-${year}-000001`);
      expect(mockTicketDayCounter.upsert).toHaveBeenCalledWith({
        where: { yymmdd: `${year}` },
        create: { yymmdd: `${year}`, seq: 1 },
        update: { seq: { increment: 1 } },
      });
    });

    it('should pad sequence number with zeros', async () => {
      const year = new Date().getFullYear();
      mockTicketDayCounter.upsert.mockResolvedValue({
        yymmdd: `${year}`,
        seq: 42,
      });

      const ticketNumber = await service.next(mockTx);

      expect(ticketNumber).toBe(`TKT-${year}-000042`);
    });

    it('should handle large sequence numbers', async () => {
      const year = new Date().getFullYear();
      mockTicketDayCounter.upsert.mockResolvedValue({
        yymmdd: `${year}`,
        seq: 123456,
      });

      const ticketNumber = await service.next(mockTx);

      expect(ticketNumber).toBe(`TKT-${year}-123456`);
    });

    it('should handle sequence numbers greater than 6 digits', async () => {
      const year = new Date().getFullYear();
      mockTicketDayCounter.upsert.mockResolvedValue({
        yymmdd: `${year}`,
        seq: 9999999,
      });

      const ticketNumber = await service.next(mockTx);

      expect(ticketNumber).toBe(`TKT-${year}-9999999`);
    });
  });
});

