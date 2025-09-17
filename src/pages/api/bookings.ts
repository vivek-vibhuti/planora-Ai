import type { NextApiRequest, NextApiResponse } from 'next';
import type { BookingRequest, BookingResponse } from '@/types/booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse<BookingResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Basic headers helpful for demos/showcases
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Powered-By', 'PLANORA AI');

    const bookingRequest: BookingRequest = req.body;

    // Optional: simple idempotency by client-provided key
    // const idKey = req.headers['x-idempotency-key'];
    // if (idKey && await wasProcessed(idKey)) {
    //   return res.status(200).json(await getPreviousResult(idKey));
    // }

    const validation = validateBookingRequest(bookingRequest);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error || 'Invalid request',
      });
    }

    console.log(`📞 Processing booking request for ${bookingRequest.details.name}`);

    const bookingId = generateBookingId();

    // Simulate asynchronous processing (email/SMS/database)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = Math.random() > 0.1; // 90% success

    if (success) {
      const confirmationDetails = generateConfirmationDetails(bookingRequest);
      console.log(`✅ Booking ${bookingId} created successfully`);
      const payload: BookingResponse = {
        success: true,
        bookingId,
        confirmationDetails,
      };
      // if (idKey) await persistResult(idKey, payload);
      return res.status(200).json(payload);
    } else {
      return res.status(200).json({
        success: false,
        error:
          'Hotel is currently fully booked for selected dates. Please try alternative dates or contact the hotel directly.',
      });
    }
  } catch (error: any) {
    console.error('Booking processing failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process booking request. Please try again or contact support.',
    });
  }
}

function validateBookingRequest(request: BookingRequest): { valid: boolean; error?: string } {
  if (!request?.details?.name) return { valid: false, error: 'Hotel/service name is required' };

  const ci = request?.details?.dates?.checkIn;
  const co = request?.details?.dates?.checkOut;
  if (!ci || !co) return { valid: false, error: 'Check-in and check-out dates are required' };

  if (!request?.contactInfo?.name || !request?.contactInfo?.email || !request?.contactInfo?.phone) {
    return { valid: false, error: 'Contact information (name, email, phone) is required' };
  }

  // Email: simple but robust enough for most cases
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.contactInfo.email)) {
    return { valid: false, error: 'Valid email address is required' };
  }

  // Indian phone: allow +91 or 0 prefixes; 10-digit starting with 6-9
  const cleanPhone = request.contactInfo.phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { valid: false, error: 'Valid Indian phone number is required' };
  }

  // Date validation with local-date normalization to avoid TZ drift
  const today = toISODateLocal(new Date());
  const checkIn = toISODateLocal(new Date(ci));
  const checkOut = toISODateLocal(new Date(co));

  if (!isValidISODate(checkIn) || !isValidISODate(checkOut)) {
    return { valid: false, error: 'Invalid check-in or check-out date' };
  }

  if (checkIn < today) return { valid: false, error: 'Check-in date cannot be in the past' };
  if (checkOut <= checkIn) return { valid: false, error: 'Check-out date must be after check-in date' };

  // Optional: guests bounds
  const guests = Number(request?.details?.guests ?? 1);
  if (!Number.isFinite(guests) || guests < 1 || guests > 10) {
    return { valid: false, error: 'Guests must be between 1 and 10' };
  }

  return { valid: true };
}

function toISODateLocal(d: Date): string {
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function isValidISODate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `JH${timestamp}${random}`.toUpperCase();
}

function generateConfirmationDetails(request: BookingRequest) {
  const checkInDate = formatDateLocal(request.details.dates.checkIn);
  const checkOutDate = formatDateLocal(request.details.dates.checkOut);
  return {
    providerContact: getProviderContact(request.details.name),
    nextSteps: [
      `Your booking request for ${request.details.name} has been submitted`,
      'The hotel will contact you within 2–4 hours to confirm availability',
      `Check-in: ${checkInDate}, Check-out: ${checkOutDate}`,
      `Number of guests: ${request.details.guests}`,
      'Keep your booking ID ready for reference',
      'You will receive a confirmation email shortly',
    ],
    paymentInfo: 'Payment details will be shared by the hotel during confirmation call',
    cancellationPolicy: 'Cancellation policy varies by hotel. Please confirm with the property directly.',
  };
}

function formatDateLocal(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getProviderContact(hotelName: string): string {
  const map: Record<string, string> = {
    default: 'Hotel will contact you directly using provided details',
    'tourist lodge': 'Jharkhand Tourism: 0651-2331828',
    heritage: 'Heritage Hotels: Contact via your booking reference',
    resort: 'Resort will confirm via email and phone',
  };
  const key = Object.keys(map).find((k) => hotelName.toLowerCase().includes(k));
  return map[key || 'default'];
}

// Optional idempotency persistence (pseudo)
// async function wasProcessed(key: string | string[] | undefined) { return false; }
// async function getPreviousResult(key: any) { return null as unknown as BookingResponse; }
// async function persistResult(key: any, data: BookingResponse) {}
export const config = {
  api: {
    bodyParser: { sizeLimit: '1mb' },
  },
  maxDuration: 30,
};
