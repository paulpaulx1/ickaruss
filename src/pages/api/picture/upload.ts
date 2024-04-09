import { put, del } from '@vercel/blob';
import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = session.user;

  if (typeof user.image == 'string' && user.image.length && user.image.includes('vercel-storage.com')) {
    await del(user.image);
  }

  try {
    const protocol = Array.isArray(req.headers['x-forwarded-proto']) ? req.headers['x-forwarded-proto'][0] : req.headers['x-forwarded-proto'] ?? 'http';
    const host: string = req.headers.host ?? ''; // Ensure host is a string and handle potential undefined
    const { searchParams } = new URL(req.url!, `${protocol}://${host}`);
    const filename = searchParams.get('filename');
    if (typeof filename !== 'string') { // Ensure filename is a string
      return res.status(400).json({ error: 'Filename is required and must be a string' });
    }

    let blob;
    try {
      blob = await put(filename, req, {
        access: 'public',
      });
    } catch (putError) {
      console.error('Blob put operation error:', putError);
      return res.status(500).json({ error: 'Failed during blob put operation' });
    }

    // Respond with the URL or any relevant information about the blob
    return res.status(200).json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload picture' });
  }
}