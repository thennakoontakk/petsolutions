import { NextResponse, type NextRequest } from 'next/server';
import { OLD_IMAGE_PATH_MAP } from '@/lib/data/productImageMap';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const requestedFile = path.join('/');
  
  // Try matching full path or file name
  const fullPath = `/images/products/${requestedFile}`;
  const targetUrl =
    OLD_IMAGE_PATH_MAP[fullPath] ||
    OLD_IMAGE_PATH_MAP[requestedFile] ||
    OLD_IMAGE_PATH_MAP[`/images/products/${path[path.length - 1]}`] ||
    OLD_IMAGE_PATH_MAP[path[path.length - 1]];
  
  if (targetUrl) {
    return NextResponse.redirect(targetUrl, 307);
  }
  
  return new NextResponse('Image not found', { status: 404 });
}
