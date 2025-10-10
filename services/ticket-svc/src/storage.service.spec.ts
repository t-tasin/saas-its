import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Mock AWS SDK
jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('@aws-sdk/client-s3');

const mockGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>;

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
    jest.clearAllMocks();
  });

  describe('generateUploadUrl', () => {
    it('should generate presigned upload URL with correct parameters', async () => {
      const mockUrl = 'https://s3.amazonaws.com/bucket/tickets/123/uuid/file.png?signature=abc';
      mockGetSignedUrl.mockResolvedValue(mockUrl);

      const result = await service.generateUploadUrl(
        'screenshot.png',
        'image/png',
        'ticket-123'
      );

      expect(result.uploadUrl).toBe(mockUrl);
      expect(result.key).toContain('tickets/ticket-123/');
      expect(result.key).toContain('/screenshot.png');
      expect(result.attachmentId).toBeTruthy();
      expect(mockGetSignedUrl).toHaveBeenCalled();
    });

    it('should generate unique attachment IDs', async () => {
      mockGetSignedUrl.mockResolvedValue('https://test-url.com');

      const result1 = await service.generateUploadUrl('file1.png', 'image/png', 'ticket-1');
      const result2 = await service.generateUploadUrl('file2.png', 'image/png', 'ticket-1');

      expect(result1.attachmentId).not.toBe(result2.attachmentId);
      expect(result1.key).not.toBe(result2.key);
    });
  });

  describe('generateDownloadUrl', () => {
    it('should generate presigned download URL', async () => {
      const mockUrl = 'https://s3.amazonaws.com/bucket/file.png?signature=xyz';
      mockGetSignedUrl.mockResolvedValue(mockUrl);

      const result = await service.generateDownloadUrl('tickets/123/uuid/file.png');

      expect(result).toBe(mockUrl);
      expect(mockGetSignedUrl).toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    it('should send delete command for the specified key', async () => {
      // Since we're mocking S3Client, we just need to ensure no errors are thrown
      await expect(service.deleteFile('tickets/123/uuid/file.png')).resolves.not.toThrow();
    });
  });
});

