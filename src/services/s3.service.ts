import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

const s3Client = new S3Client({
  region: env.aws.region,
});

export class S3Service {
  static async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log("DIAGNOSTIC - AWS_ACCESS_KEY_ID prefix:", process.env.AWS_ACCESS_KEY_ID?.substring(0, 5), "Has Session Token:", !!process.env.AWS_SESSION_TOKEN);
    const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
    if (
      !env.aws.bucketName ||
      (!isLambda && (!env.aws.accessKeyId || !env.aws.secretAccessKey))
    ) {
      throw new ApiError(
        500,
        'AWS S3 is not configured. Please set AWS_S3_BUCKET_NAME, and also AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY if running locally.'
      );
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'bin';
    const baseName = file.originalname
      .substring(0, file.originalname.lastIndexOf('.')) || file.originalname;
    const cleanName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'file';

    const fileName = `${cleanName}-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: env.aws.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await s3Client.send(command);

      // Return direct S3 object URL
      return `https://${env.aws.bucketName}.s3.${env.aws.region}.amazonaws.com/${fileName}`;
    } catch (err: any) {
      console.error('S3 upload error:', err);
      throw new ApiError(
        500,
        `Failed to upload file to S3: ${err.message}`
      );
    }
  }
}
