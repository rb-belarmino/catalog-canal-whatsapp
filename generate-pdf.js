import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generatePDF() {
  const catalogData = JSON.parse(fs.readFileSync('src/data/catalog-2026-09-14.json', 'utf-8'));
  const looks = catalogData.looks;

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const pageW = 1080;
  const pageH = 1920;

  // --- COVER PAGE ---
  const page1 = pdfDoc.addPage([pageW, pageH]);
  
  // White background
  page1.drawRectangle({
    x: 0,
    y: 0,
    width: pageW,
    height: pageH,
    color: rgb(1, 1, 1),
  });

  const canalSize = 220;
  const canalText = "CANAL";
  const canalWidth = font.widthOfTextAtSize(canalText, canalSize);
  
  const startX = (pageW - canalWidth) / 2;
  const centerY = pageH / 2 + 100;

  const seasonText = "VERÃO 2027";
  const seasonSize = 48;
  page1.drawText(seasonText, {
    x: startX + 15,
    y: centerY + 30,
    size: seasonSize,
    font: font,
    color: rgb(0, 0, 0),
    opacity: 0.9,
  });

  page1.drawText(canalText, {
    x: startX,
    y: centerY - 150,
    size: canalSize,
    font: font,
    color: rgb(0, 0, 0),
  });

  const conceptText = "C O N C E P T";
  const conceptSize = 42;
  const conceptWidth = font.widthOfTextAtSize(conceptText, conceptSize);
  page1.drawText(conceptText, {
    x: startX + canalWidth - conceptWidth - 10,
    y: centerY - 210,
    size: conceptSize,
    font: font,
    color: rgb(0, 0, 0),
    opacity: 0.9,
  });

  // --- LOOKS PAGES ---
  for (const look of looks) {
    const imgPath = `public${look.imageUrl}`;
    if (!fs.existsSync(imgPath)) continue;

    const imgBytes = fs.readFileSync(imgPath);
    let image;
    try {
      image = imgPath.endsWith('.png') ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
    } catch (e) {
      continue;
    }

    const { width: imgW, height: imgH } = image.scale(1);
    const page = pdfDoc.addPage([pageW, pageH]);
    
    const scaleFactor = Math.max(pageW / imgW, pageH / imgH);
    page.drawImage(image, {
      x: (pageW - imgW * scaleFactor) / 2,
      y: (pageH - imgH * scaleFactor) / 2,
      width: imgW * scaleFactor,
      height: imgH * scaleFactor,
    });

    const pieces = look.pieces || [];
    if (pieces.length === 0) continue;

    // Calculate background rectangle dimensions based on longest text
    let maxTextWidth = 0;
    for (const piece of pieces) {
      const nameW = font.widthOfTextAtSize(piece.name.toUpperCase(), 26);
      const priceW = font.widthOfTextAtSize(piece.formattedPrice, 26);
      if (nameW > maxTextWidth) maxTextWidth = nameW;
      if (priceW > maxTextWidth) maxTextWidth = priceW;
    }

    const padding = 30;
    const boxWidth = maxTextWidth + (padding * 2);
    // Each piece uses about 100 vertical space (name + price + spacing)
    const boxHeight = (pieces.length * 90) + padding;
    
    const textStartX = 60;
    const textStartY = 100; // Bottom margin for the block
    
    // Draw white semi-transparent background for text readability
    page.drawRectangle({
      x: textStartX - padding,
      y: textStartY - padding,
      width: boxWidth,
      height: boxHeight,
      color: rgb(1, 1, 1),
      opacity: 0.8, // 80% opacity white
    });

    let currentY = textStartY + boxHeight - padding - 30; // Start drawing text from top of box

    for (const piece of pieces) {
      page.drawText(piece.name.toUpperCase(), {
        x: textStartX,
        y: currentY,
        size: 26,
        font: font,
        color: rgb(0, 0, 0),
      });
      currentY -= 32;
      page.drawText(piece.formattedPrice, {
        x: textStartX,
        y: currentY,
        size: 26,
        font: font,
        color: rgb(0, 0, 0),
      });
      currentY -= 58; // spacing before next piece
    }
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('public/catalogo.pdf', pdfBytes);
  console.log('PDF generated at public/catalogo.pdf');
}

generatePDF().catch(console.error);
