import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    // Support both AWS S3 and LocalStack for local development
    const isLocal = process.env.NODE_ENV !== 'production';
    
    this.bucketName = process.env.S3_BUCKET_NAME || 'saas-its-ticket-attachments';
    this.region = process.env.AWS_REGION || 'us-east-1';
    
    this.s3Client = new S3Client({
      region: this.region,
      endpoint: isLocal ? 'http://localstack:4566' : undefined,
      forcePathStyle: isLocal, // Required for LocalStack
      credentials: isLocal
        ? {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          }
        : process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined, // Fallback to default AWS credentials
    });
  }

  /**
   * Generate a presigned URL for uploading a file directly from the browser
   * @param filename Original filename
   * @param contentType MIME type
   * @param ticketId Ticket ID for organizing files
   * @returns Upload URL and file key
   */
  async generateUploadUrl(
    filename: string,
    contentType: string,
    ticketId: string,
  ): Promise<{ uploadUrl: string; key: string; attachmentId: string }> {
    const attachmentId = randomUUID();
    const key = `tickets/${ticketId}/${attachmentId}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      Metadata: {
        ticketId,
        originalFilename: filename,
      },
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    return { uploadUrl, key, attachmentId };
  }

  /**
   * Generate a presigned URL for downloading a file
   * @param key S3 object key
   * @returns Download URL
   */
  async generateDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hour
    });
  }

  /**
   * Delete a file from S3
   * @param key S3 object key
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}

