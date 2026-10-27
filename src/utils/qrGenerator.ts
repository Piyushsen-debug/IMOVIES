import QRCode from 'qrcode';

export interface TicketQRPayload {
  bookingId: string;
  movieTitle: string;
  theaterName: string;
  showDate: string;
  showTime: string;
  seats: string[];
  totalAmount: number;
  userName: string;
  timestamp: string;
}

/**
 * Generates high-fidelity Base64 PNG QR code for direct cinema gate validation
 */
export async function generateTicketQR(payload: TicketQRPayload): Promise<string> {
  const jsonString = JSON.stringify({
    app: 'IMOVIES-GATE-PASS',
    bid: payload.bookingId,
    movie: payload.movieTitle,
    hall: payload.theaterName,
    date: `${payload.showDate} ${payload.showTime}`,
    seats: payload.seats,
    pax: payload.seats.length,
    amt: payload.totalAmount,
    usr: payload.userName,
    valid: true,
    ts: payload.timestamp
  });

  try {
    const dataUrl = await QRCode.toDataURL(jsonString, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 320,
      color: {
        dark: '#080C15',
        light: '#FFFFFF'
      }
    });
    return dataUrl;
  } catch (error) {
    console.error('Failed to generate ticket QR:', error);
    // Return SVG fallback data URI if canvas is unavailable
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff"/><text x="50" y="50" font-size="10" text-anchor="middle" fill="#000">${payload.bookingId}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;
  }
}
