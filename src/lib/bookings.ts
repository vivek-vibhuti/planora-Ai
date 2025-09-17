// src/lib/bookings.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class JharkhandBookingManager {
  async initiateHotelBooking(hotel: any, request: any) {
    const booking = await prisma.booking.create({
      data: {
        hotelName: hotel.name,
        location: hotel.location,
        priceRange: hotel.priceRange,
        contactNumber: hotel.contactNumber,
        address: hotel.address,
        status: 'pending',
        checkIn: new Date(request.details.dates.checkIn),
        checkOut: new Date(request.details.dates.checkOut),
        guests: request.details.guests,
      }
    });

    return {
      success: true,
      bookingId: booking.id,
      confirmationDetails: {
        providerContact: hotel.contactNumber,
        nextSteps: [
          `Call ${hotel.name} at ${hotel.contactNumber}`,
          `Mention booking reference: ${booking.id}`,
          `Confirm dates: ${request.details.dates.checkIn} to ${request.details.dates.checkOut}`,
          `Specify ${request.details.guests} guests`
        ]
      }
    };
  }

  async getBookingStatus(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { notes: true }
    });
    return booking;
  }

  async updateBookingStatus(bookingId: string, status: string, note?: string) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        notes: note ? { create: { text: note } } : undefined
      }
    });
  }

  async cancelBooking(bookingId: string, reason?: string) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'cancelled',
        cancellationReason: reason
      }
    });
    return true;
  }

  async getBookingHistory() {
    return await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const jharkhandBookings = new JharkhandBookingManager();
