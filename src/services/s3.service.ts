import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  },
  region: env.aws.region,
});

export class S3Service {
  static async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!env.aws.accessKeyId || !env.aws.secretAccessKey || !env.aws.bucketName) {
      throw new ApiError(500, 'AWS S3 is not configured in this environment. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME in the env.');
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: env.aws.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await s3Client.send(command);
      if (env.aws.cloudfrontUrl) {
        const cfBase = env.aws.cloudfrontUrl.replace(/\/$/, '');
        return `${cfBase}/${fileName}`;
      }
      return `https://${env.aws.bucketName}.s3.${env.aws.region}.amazonaws.com/${fileName}`;
    } catch (err: any) {
      console.error('S3 upload error:', err);
      throw new ApiError(500, `Failed to upload image to S3: ${err.message}`);
    }
  }
}
