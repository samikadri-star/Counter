import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = data.length;
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(len, 0);

  const crcData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePNG(width, height, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image scanlines
  const rowStride = width * 4;
  const rawData = Buffer.alloc((rowStride + 1) * height);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width * (isMaskable ? 0.38 : 0.42);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowStride + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient: Deep slate / indigo
      const t = y / height;
      let r = Math.round(15 * (1 - t) + 30 * t);
      let g = Math.round(23 * (1 - t) + 27 * t);
      let b = Math.round(42 * (1 - t) + 75 * t);
      let a = 255;

      // Inner Icon Circle / Card
      if (dist < radius) {
        // Gradient for inner badge
        const innerT = (y - (centerY - radius)) / (radius * 2);
        r = Math.round(99 * (1 - innerT) + 59 * innerT);
        g = Math.round(102 * (1 - innerT) + 130 * innerT);
        b = Math.round(241 * (1 - innerT) + 246 * innerT);

        // Highlight center square
        const boxSize = radius * 0.55;
        if (Math.abs(dx) < boxSize && Math.abs(dy) < boxSize) {
          if (dy < -boxSize * 0.3) {
            // Display screen area
            r = 15; g = 23; b = 42;
          } else if (dx > 0 && dy > 0) {
            // Emerald accent button
            r = 16; g = 185; b = 129;
          } else {
            // Subtle card surface
            r = Math.min(255, r + 40);
            g = Math.min(255, g + 40);
            b = Math.min(255, b + 40);
          }
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', idatData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePNG(192, 192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePNG(512, 512));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePNG(180, 180));

console.log('Successfully generated all PWA icons in /public!');
