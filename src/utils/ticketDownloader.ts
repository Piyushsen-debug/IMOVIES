import { Booking } from '../types';

/**
 * Generates and downloads an authentic BookMyShow-style digital cinema ticket image (PNG)
 */
export async function downloadTicketImage(booking: Booking): Promise<void> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // High-DPI canvas dimensions
  const width = 800;
  const height = 1250;
  canvas.width = width;
  canvas.height = height;

  // 1. Dark Luxury Cinema Canvas Background
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#090D16');
  gradient.addColorStop(0.5, '#0F172A');
  gradient.addColorStop(1, '#050811');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  // Top Red Accent Strip (BookMyShow / District signature)
  ctx.fillStyle = '#E11D48';
  ctx.fillRect(18, 18, width - 36, 10);

  // 2. Header Brand Section
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('IMOVIES DISTRICT', 48, 70);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 13px "Courier New", monospace';
  ctx.fillText('OFFICIAL DIGITAL M-TICKET · TURNSTILE GATE PASS', 48, 95);

  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('● BOOKING CONFIRMED', width - 48, 70);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillText(`ID: ${booking.bookingId}`, width - 48, 95);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 120);
  ctx.lineTo(width - 48, 120);
  ctx.stroke();

  // 3. Movie Title & Formats
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 38px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(booking.movie.title, 48, 175);

  // Badges: Format & Censor
  ctx.fillStyle = '#E11D48';
  ctx.beginPath();
  ctx.roundRect(48, 195, 110, 28, 6);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(booking.show.screenFormat, 103, 214);

  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(170, 195, 75, 28, 6);
  ctx.fill();
  ctx.fillStyle = '#F8FAFC';
  ctx.fillText(booking.movie.censorRating, 207, 214);
  ctx.textAlign = 'left';

  // 4. Cinema Hall & Audi
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('CINEMA THEATRE', 48, 265);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(booking.show.theater.name, 48, 295);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '14px sans-serif';
  ctx.fillText(
    `${booking.show.theater.location.area}, ${booking.show.theater.city} · Screen ${booking.show.screenNumber}`,
    48,
    322
  );

  // 5. Showtime Coordinates Box
  ctx.fillStyle = '#070C18';
  ctx.beginPath();
  ctx.roundRect(48, 350, width - 96, 110, 16);
  ctx.fill();
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Date column
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('SHOW DATE', 72, 385);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(booking.show.showDate, 72, 422);

  // Time column
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('SHOW TIME', 340, 385);
  ctx.fillStyle = '#10B981';
  ctx.font = '900 26px "Courier New", monospace';
  ctx.fillText(booking.show.showTime, 340, 422);

  // Seats count
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('SEATS BOOKED', 580, 385);
  ctx.fillStyle = '#F43F5E';
  ctx.font = '900 24px "Courier New", monospace';
  ctx.fillText(booking.seats.join(', '), 580, 422);

  // 6. Food & Beverage summary if present
  let currentY = 500;
  if (booking.snacks.length > 0) {
    ctx.fillStyle = '#D97706';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('🍿 REFRESHMENTS & SNACKS INCLUDED:', 48, currentY);
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '14px sans-serif';
    const snackList = booking.snacks.map((s) => `${s.quantity}x ${s.item.name}`).join('  |  ');
    ctx.fillText(snackList, 48, currentY + 24);
    currentY += 60;
  }

  // 7. Perforation Cut-out Divider
  ctx.strokeStyle = '#475569';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(35, currentY);
  ctx.lineTo(width - 35, currentY);
  ctx.stroke();
  ctx.setLineDash([]); // reset

  // Left notch
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(16, currentY, 20, 0, Math.PI * 2);
  ctx.fill();
  // Right notch
  ctx.beginPath();
  ctx.arc(width - 16, currentY, 20, 0, Math.PI * 2);
  ctx.fill();

  currentY += 40;

  // 8. Turnstile QR Code Image
  if (booking.qrCodeDataUrl) {
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    await new Promise<void>((resolve) => {
      qrImg.onload = () => {
        // Draw white backing
        const qrSize = 260;
        const qrX = (width - qrSize) / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(qrX - 16, currentY, qrSize + 32, qrSize + 32, 20);
        ctx.fill();

        ctx.drawImage(qrImg, qrX, currentY + 16, qrSize, qrSize);
        resolve();
      };
      qrImg.onerror = () => resolve();
      qrImg.src = booking.qrCodeDataUrl;
    });
  }

  currentY += 340;

  // Instructions & patron info
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN AT CINEMA TURNSTILE FOR DIRECT ENTRY', width / 2, currentY);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '13px sans-serif';
  ctx.fillText(
    `Passholder: ${booking.userName} (${booking.userPhone}) · Total Paid: ₹${booking.totalAmount}`,
    width / 2,
    currentY + 26
  );

  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#64748B';
  ctx.fillText(`TXN: ${booking.transactionId} · GENERATED: ${new Date(booking.createdAt).toLocaleString()}`, width / 2, currentY + 50);

  // Trigger download
  const imageUri = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.download = `IMOVIES_Ticket_${booking.bookingId}.png`;
  downloadLink.href = imageUri;
  downloadLink.click();
}
