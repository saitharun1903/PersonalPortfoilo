// Browser-side helpers for the admin: shrink photos before upload and turn an image into a PDF.
// Everything runs on the owner's device, so large phone photos never have to be uploaded as-is.

export const MAX_UPLOAD_BYTES = 4_000_000;
const MAX_IMAGE_SIDE = 2400;

function loadImage(blob: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('This image could not be read.')); };
    image.src = url;
  });
}

function draw(image: HTMLImageElement, maxSide: number, background?: string) {
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d')!;
  if (background) { context.fillStyle = background; context.fillRect(0, 0, canvas.width, canvas.height); }
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

const encode = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));

/** Resize large photos to at most 2400px and re-encode them as WebP (or JPEG where WebP is unavailable). */
export async function optimizeImage(file: File): Promise<File> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return file;
  const image = await loadImage(file);
  const large = Math.max(image.naturalWidth, image.naturalHeight) > MAX_IMAGE_SIDE;
  if (!large && file.size <= 900_000) return file;
  let canvas = draw(image, MAX_IMAGE_SIDE);
  let blob = await encode(canvas, 'image/webp', 0.88);
  if (!blob || blob.type !== 'image/webp') {
    canvas = draw(image, MAX_IMAGE_SIDE, '#ffffff');
    blob = await encode(canvas, 'image/jpeg', 0.9);
  }
  if (!blob || blob.size >= file.size) return file;
  const name = file.name.replace(/\.[^.]+$/, '') + (blob.type === 'image/webp' ? '.webp' : '.jpg');
  return new File([blob], name, { type: blob.type });
}

/** Build a one-page PDF that shows the image at its own proportions. */
export async function imageToPdf(source: Blob): Promise<File> {
  const image = await loadImage(source);
  const canvas = draw(image, 3000, '#ffffff');
  const jpeg = await encode(canvas, 'image/jpeg', 0.92);
  if (!jpeg) throw new Error('The PDF could not be created.');
  const data = new Uint8Array(await jpeg.arrayBuffer());
  // Page size in points, as if the image were 144 dpi; viewers zoom to fit.
  const width = +(canvas.width / 2).toFixed(2);
  const height = +(canvas.height / 2).toFixed(2);
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: string | Uint8Array) => { const bytes = typeof chunk === 'string' ? encoder.encode(chunk) : chunk; parts.push(bytes); length += bytes.length; };
  const object = (body: string | (() => void)) => { offsets.push(length); push(`${offsets.length} 0 obj\n`); if (typeof body === 'string') push(body); else body(); push('\nendobj\n'); };
  const drawing = `q ${width} 0 0 ${height} 0 0 cm /Im0 Do Q`;
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  object('<< /Type /Catalog /Pages 2 0 R >>');
  object('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  object(() => { push(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${data.length} >>\nstream\n`); push(data); push('\nendstream'); });
  object(`<< /Length ${drawing.length} >>\nstream\n${drawing}\nendstream`);
  const xref = length;
  push(`xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n${offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}`);
  push(`trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  const pdf = new Uint8Array(length);
  let position = 0;
  for (const part of parts) { pdf.set(part, position); position += part.length; }
  return new File([pdf], 'certificate.pdf', { type: 'application/pdf' });
}

export const isImageUrl = (value: string) => /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(value);
export const isPdfUrl = (value: string) => /\.pdf(\?|$)/i.test(value);
