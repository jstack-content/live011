import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { response } from './utils/response.js';

export async function handler(event) {
  const { filename } = JSON.parse(event.body);

  if (!filename) {
    return response(400, {
      error: 'Filename is required.',
    });
  }

  const s3Client = new S3Client({ region: 'us-east-2' });
  const command = new GetObjectCommand({
    Bucket: 'mateusilva',
    Key: filename,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 5 });

  return response(200, { url });
}
