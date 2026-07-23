import sharp from 'sharp';

async function convertLogo() {
  const inputPath = 'C:\\Users\\Jumez\\.gemini\\antigravity\\brain\\cb97e390-bff9-47bc-8bfc-87b8dcb395dd\\media__1784837323207.jpg';
  const outputPath = 'c:\\Users\\Jumez\\OneDrive\\Escritorio\\Proyectos Negocios\\PARMA\\parma-italia\\public\\logo.png';

  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = data;
  const len = pixelData.length;

  const cornerR = pixelData[0];
  const cornerG = pixelData[1];
  const cornerB = pixelData[2];
  console.log('Corner pixel RGB:', cornerR, cornerG, cornerB);

  // Flood fill / distance threshold to remove background
  for (let i = 0; i < len; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    const dist = Math.sqrt(
      (r - cornerR) ** 2 +
      (g - cornerG) ** 2 +
      (b - cornerB) ** 2
    );

    if (dist < 40) {
      pixelData[i + 3] = 0; // Transparent
    } else if (dist < 70) {
      const alpha = Math.floor(((dist - 40) / 30) * 255);
      pixelData[i + 3] = alpha;
    }
  }

  await sharp(pixelData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .png()
  .toFile(outputPath);

  console.log('Successfully saved transparent logo to:', outputPath);
}

convertLogo().catch(console.error);
