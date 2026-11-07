import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height) {
  // Simple PNG encoder in pure JS
  function crc32(buf) {
    let table = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ -1) >>> 0;
  }

  function chunk(type, data) {
    let len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    let t = Buffer.from(type);
    let body = Buffer.concat([t, data]);
    let crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body), 0);
    return Buffer.concat([len, body, crc]);
  }

  // Generate Image Scanlines (RGB format)
  // Each scanline begins with a filter byte (0 = None)
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;

      // Background gradient: Midnight Navy (#040614) to Deep Royal Purple (#1c0a35)
      const grad = y / height;
      let r = Math.floor(4 + (28 - 4) * grad);
      let g = Math.floor(6 + (10 - 6) * grad);
      let b = Math.floor(20 + (53 - 20) * grad);

      // Central radial glow: Warm Golden / Amber halo
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2.2) / (height / 2.2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.0) {
        const glow = Math.pow(1.0 - dist, 2);
        r = Math.min(255, Math.floor(r + 255 * glow * 0.4));
        g = Math.min(255, Math.floor(g + 180 * glow * 0.35));
        b = Math.min(255, Math.floor(b + 50 * glow * 0.2));
      }

      // Border golden frame glow
      if (x < 12 || x > width - 13 || y < 12 || y > height - 13) {
        r = 218; g = 165; b = 32;
      }

      // Sparkles and stars
      const starSeed = (x * 37 + y * 97) % 1999;
      if (starSeed === 42 || starSeed === 777) {
        r = 255; g = 240; b = 180;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
    }
  }

  const idatData = zlib.deflateSync(rawData, { level: 9 });

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: 2 (Truecolor RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = chunk('IHDR', ihdrData);
  const idat = chunk('IDAT', idatData);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const buffer = createPNG(1200, 630);
fs.writeFileSync('public/og-image.png', buffer);
console.log('og-image.png generated successfully, size:', buffer.length);
