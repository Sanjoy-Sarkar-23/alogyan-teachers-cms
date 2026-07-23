'use client';

export type CertificateExportData = {
  certificateId: string;
  studentName: string;
  programName: string;
  grade: string;
  startDate: string;
  endDate: string;
  totalDuration: string;
  issueDate: string;
  dateOfCompletion: string;
  verifyUrl: string;
};

// A4 landscape at 300 DPI: suitable for professional printing.
const WIDTH = 3508;
const HEIGHT = 2480;
const PDF_WIDTH_MM = 297;
const PDF_HEIGHT_MM = 210;
const TEMPLATE_URL = '/certificates/certificates2.svg';
let templatePromise: Promise<HTMLImageElement> | undefined;

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load certificate artwork'));
    image.src = source;
  });
}

function templateImage() {
  templatePromise ??= loadImage(TEMPLATE_URL);
  return templatePromise;
}

function measureSpacedText(
  context: CanvasRenderingContext2D,
  value: string,
  spacing: number
) {
  const characters = Array.from(value);
  const textWidth = characters.reduce(
    (total, character) => total + context.measureText(character).width,
    0
  );

  return textWidth + Math.max(0, characters.length - 1) * spacing;
}

function drawCenteredSpacedText(
  context: CanvasRenderingContext2D,
  value: string,
  centerX: number,
  y: number,
  spacing: number
) {
  const characters = Array.from(value);
  const totalWidth = measureSpacedText(context, value, spacing);

  let currentX = centerX - totalWidth / 2;

  context.textAlign = 'left';

  for (const character of characters) {
    context.fillText(character, currentX, y);
    currentX += context.measureText(character).width + spacing;
  }

  context.textAlign = 'center';
}

function fittedText(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  startingSize: number,
  weight = 500,
  spacing = 0,
  color = '#1a1a1a',
  family = "'Alex Brush', 'Great Vibes', 'Brush Script MT', cursive"
) {
  let size = startingSize;

  context.textBaseline = 'alphabetic';

  while (size > 22) {
    context.font = `${weight} ${size}px ${family}`;

    if (measureSpacedText(context, value, spacing) <= maxWidth) {
      break;
    }

    size -= 2;
  }

  context.fillStyle = color;

  drawCenteredSpacedText(context, value, x, y, spacing);
}

export async function renderCertificate(data: CertificateExportData) {
  const [{ default: QRCode }, artwork] = await Promise.all([
    import('qrcode'),
    templateImage(),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas export is unavailable');

  context.drawImage(artwork, 0, 0, WIDTH, HEIGHT);
  const scaleX = WIDTH / 1118.25;
  const scaleY = HEIGHT / 791.25;
  const fontScale = (scaleX + scaleY) / 2;
  const poppins = "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

  context.textBaseline = 'alphabetic';
  context.textAlign = 'right';
  context.fillStyle = '#1a1a1a';
  context.font = `500 ${13.1 * fontScale}px ${poppins}`;
  context.fillText(data.certificateId, 1040.8 * scaleX, 135.8 * scaleY);

  fittedText(
    context,
    data.studentName,
    555 * scaleX,
    400 * scaleY,
    650 * scaleX,
    32 * fontScale,
    500,
    2.5 * fontScale // Name letter spacing
  );

  context.textAlign = 'center';
  context.font = `400 ${15 * fontScale}px ${poppins}`;
  context.fillText(data.totalDuration, 678 * scaleX, 446 * scaleY);
  context.font = `400 ${16 * fontScale}px ${poppins}`;
  context.fillText(data.grade, 749.5 * scaleX, 472 * scaleY);

  // context.fillStyle = '#ce2127';
  // context.font = `500 ${13 * fontScale}px ${poppins}`;
  // context.fillText(data.programName, 550 * scaleX, 530 * scaleY);
  fittedText(
  context,
  data.programName,
  WIDTH / 2,
  530 * scaleY,
  700 * scaleX,
  13 * fontScale,
  500,
  0,
  '#ce2127',
  poppins
);
  context.fillStyle = '#1a1a1a';
  context.textAlign = 'right';
  context.font = `500 ${10 * fontScale}px ${poppins}`;
  context.fillText(`${data.startDate} -`, 395 * scaleX, 600 * scaleY);
  context.fillText(data.endDate, 450.9 * scaleX, 600 * scaleY);
  context.fillText(data.dateOfCompletion, 643.9 * scaleX, 600 * scaleY);

  const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
  });
  const qr = await loadImage(qrDataUrl);
  context.drawImage(qr, 93 * scaleX, 625 * scaleY, 84 * scaleX, 84 * scaleY);
  return canvas;
}

function safeName(value: string) {
  return value.replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Certificate export failed'))),
      type,
      quality
    )
  );
}

export async function exportCertificatePng(data: CertificateExportData) {
  const canvas = await renderCertificate(data);
  download(
    await canvasBlob(canvas, 'image/png'),
    `${safeName(data.certificateId)}-${safeName(data.studentName)}.png`
  );
}

export async function exportCertificatePdf(data: CertificateExportData) {
  const [{ jsPDF }, canvas] = await Promise.all([import('jspdf'), renderCertificate(data)]);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, PDF_WIDTH_MM, PDF_HEIGHT_MM, undefined, 'FAST');
  pdf.save(`${safeName(data.certificateId)}-${safeName(data.studentName)}.pdf`);
}

export async function exportCertificatesPdf(items: CertificateExportData[]) {
  if (items.length === 0) return;
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
  for (let index = 0; index < items.length; index += 1) {
    if (index > 0) pdf.addPage('a4', 'landscape');
    const canvas = await renderCertificate(items[index]);
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, PDF_WIDTH_MM, PDF_HEIGHT_MM, undefined, 'FAST');
  }
  pdf.save(`batch-certificates-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export async function exportCertificatesZip(
  items: CertificateExportData[],
  format: 'png' | 'pdf' | 'both' = 'png'
) {
  if (items.length === 0) return;
  const [{ default: JSZip }, pdfModule] = await Promise.all([
    import('jszip'),
    format === 'png' ? Promise.resolve(null) : import('jspdf'),
  ]);
  const zip = new JSZip();
  const pngFolder = format === 'both' ? zip.folder('PNG')! : zip;
  const pdfFolder = format === 'both' ? zip.folder('PDF')! : zip;
  for (const item of items) {
    const canvas = await renderCertificate(item);
    const baseName = `${safeName(item.certificateId)}-${safeName(item.studentName)}`;
    if (format === 'png' || format === 'both') {
      pngFolder.file(`${baseName}.png`, await canvasBlob(canvas, 'image/png'));
    }
    if ((format === 'pdf' || format === 'both') && pdfModule) {
      const pdf = new pdfModule.jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        PDF_WIDTH_MM,
        PDF_HEIGHT_MM,
        undefined,
        'FAST'
      );
      pdfFolder.file(`${baseName}.pdf`, pdf.output('arraybuffer'));
    }
  }
  download(
    await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } }),
    `batch-certificates-${format}-${new Date().toISOString().slice(0, 10)}.zip`
  );
}
