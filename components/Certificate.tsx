'use client';

import { useEffect, useState } from 'react';

import type { CertificateExportData } from '@/lib/certificate-export';

const VIEWBOX_WIDTH = 842.25;
const VIEWBOX_HEIGHT = 595.5;

export default function Certificate(data: CertificateExportData) {
  const [qr, setQr] = useState('');

  useEffect(() => {
    let active = true;
    import('qrcode').then(({ default: QRCode }) =>
      QRCode.toDataURL(data.verifyUrl, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: 'H',
      }).then((value) => {
        if (active) setQr(value);
      })
    );
    return () => {
      active = false;
    };
  }, [data.verifyUrl]);

  const poppins = "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

  return (
    <div
      className="relative w-full overflow-hidden rounded-[3px] bg-white shadow-sm"
      style={{ aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}` }}
      aria-label={`Certificate for ${data.studentName}`}
    >
      <div
        className="absolute inset-0 bg-[length:100%_100%] bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/certificates/certificates2.svg")' }}
      />
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`Certificate for ${data.studentName}`}
      >
        <text x="770.8" y="102.8" textAnchor="end" fill="#1a1a1a" fontSize="9.2" fontFamily={poppins} fontWeight="500">
          {data.certificateId}
        </text>
        <text
          x="420"
          y="300"
          textAnchor="middle"
          fill="#1a1a1a"
          fontSize="32"
          fontFamily="'Alex Brush', 'Great Vibes', 'Brush Script MT', cursive"
          fontWeight="200"
          letterSpacing="1.5"
          textLength={data.studentName.length > 32 ? 500 : undefined}
          lengthAdjust="spacingAndGlyphs"
        >
          {data.studentName}
        </text>
        <text x="520" y="338" textAnchor="middle" fill="#1a1a1a" fontSize="15" fontFamily={poppins} fontWeight="300" letterSpacing="1.5">
          {data.totalDuration}
        </text>
        <text x="565" y="355" textAnchor="middle" fill="#1a1a1a" fontSize="16" fontFamily={poppins} fontWeight="300" letterSpacing="1.5">
          {data.grade}
        </text>
        <text x="420" y="400" textAnchor="middle" fill="#ce2127" fontSize="13" fontFamily={poppins} fontWeight="500" letterSpacing="0.8">
          {data.programName}
        </text>
        <text x="315" y="455" textAnchor="end" fill="#1a1a1a" fontSize="10" fontFamily={poppins} fontWeight="500" letterSpacing="0.3">
          {data.startDate} -
        </text>
        <text x="370.9" y="455" textAnchor="end" fill="#1a1a1a" fontSize="10" fontFamily={poppins} fontWeight="500" letterSpacing="0.3">
          {data.endDate}
        </text>
        <text x="498.9" y="455" textAnchor="end" fill="#1a1a1a" fontSize="10" fontFamily={poppins} fontWeight="500" letterSpacing="0.3">
          {data.dateOfCompletion}
        </text>
        {qr && <image href={qr} x="70" y="470" width="64" height="64" />}
      </svg>
    </div>
  );
}
