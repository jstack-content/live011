import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

import { response } from './utils/response.js';

export async function handler(event) {
  const { filename } = JSON.parse(event.body);

  if (!filename) {
    return response(400, {
      error: 'Filename is required.',
    });
  }

  const s3Client = new S3Client({ region: 'us-east-2' });
  const command = new PutObjectCommand({
    Bucket: 'mateusilva',
    Key: `uploads/${crypto.randomUUID()}-${filename}`,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return response(200, { url });
}
