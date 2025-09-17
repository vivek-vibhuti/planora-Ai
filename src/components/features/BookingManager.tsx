'use client';

import { useState, useEffect, useMemo } from 'react';
import { Phone, MapPin, IndianRupee, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Hotel, BookingRequest, BookingResponse } from '@/types/booking';

interface BookingManagerProps {
  hotels?: Hotel[];
  destination: string;
}

export default function BookingManager({ hotels = [], destination }: BookingManagerProps) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);

  const [bookingForm, setBookingForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const handleInputChange = (field: string, value: string) =>
    setBookingForm((prev) => ({ ...prev, [field]: value }));

  const handleBookHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowBookingForm(true);
    setBookingStatus('idle');
    setBookingResponse(null);
  };

  const getDefaultDates = () => {
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 7);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 2);
    return { checkIn: checkIn.toISOString().split('T'), checkOut: checkOut.toISOString().split('T') };
  };



  const nights = useMemo(() => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const a = new Date(bookingForm.checkIn).getTime();
    const b = new Date(bookingForm.checkOut).getTime();
    return Math.max(0, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
  }, [bookingForm.checkIn, bookingForm.checkOut]);

  const submitBookingRequest = async () => {
    if (!selectedHotel) return;
    setBookingStatus('loading');
    try {
      const bookingRequest: BookingRequest = {
        type: 'hotel',
        details: {
          name: selectedHotel.name,
          dates: { checkIn: bookingForm.checkIn, checkOut: bookingForm.checkOut },
          guests: parseInt(bookingForm.guests),
          preferences: selectedHotel.amenities,
        },
        contactInfo: { name: bookingForm.name, email: bookingForm.email, phone: bookingForm.phone },
        specialRequests: bookingForm.specialRequests,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingRequest),
      });

      const result: BookingResponse = await response.json();
      setBookingResponse(result);
      setBookingStatus(result.success ? 'success' : 'error');
    } catch (err) {
      console.error('Booking submission failed:', err);
      setBookingStatus('error');
      setBookingResponse({ success: false, error: 'Failed to submit booking request. Please try again.' });
    }
  };

  if (showBookingForm && selectedHotel) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Book {selectedHotel.name}</h2>
                <p className="text-gray-600">{selectedHotel.location}</p>
              </div>
              <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                Back to Hotels
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {bookingStatus === 'success' && bookingResponse?.success ? (
              <div className="p-6 text-center border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="mb-2 text-lg font-semibold text-green-900">Booking Request Submitted!</h3>
                <p className="mb-4 text-green-800">
                  Your booking request has been sent to {selectedHotel.name}.
                  {bookingResponse.bookingId && ` Your reference ID is: ${bookingResponse.bookingId}`}
                </p>
                {bookingResponse.confirmationDetails && (
                  <div className="p-4 text-left bg-white rounded-lg">
                    <h4 className="mb-2 font-semibold">Next Steps:</h4>
                    <ul className="space-y-1 text-sm">
                      {bookingResponse.confirmationDetails.nextSteps.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                    <div className="pt-3 mt-3 border-t">
                      <p className="text-sm">
                        <strong>Contact:</strong> {bookingResponse.confirmationDetails.providerContact}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : bookingStatus === 'error' ? (
              <div className="p-6 text-center border border-red-200 rounded-lg bg-red-50">
                <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <h3 className="mb-2 text-lg font-semibold text-red-900">Booking Request Failed</h3>
                <p className="mb-4 text-red-800">{bookingResponse?.error || 'Unable to submit booking request.'}</p>
                <Button onClick={() => setBookingStatus('idle')}>Try Again</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left: Form */}
                <div className="space-y-6">
                  <section>
                    <h3 className="mb-4 text-lg font-semibold">Booking Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                          label="Check-in Date"
                          type="date"
                          value={bookingForm.checkIn}
                          onChange={(e) => handleInputChange('checkIn', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                        <Input
                          label="Check-out Date"
                          type="date"
                          value={bookingForm.checkOut}
                          onChange={(e) => handleInputChange('checkOut', e.target.value)}
                          min={bookingForm.checkIn}
                          required
                        />
                      </div>
                      <Input
                        label="Number of Guests"
                        type="number"
                        min="1"
                        max="10"
                        value={bookingForm.guests}
                        onChange={(e) => handleInputChange('guests', e.target.value)}
                        required
                      />
                    </div>
                  </section>

                  <section>
                    <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        value={bookingForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={bookingForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Special Requests (Optional)</label>
                        <textarea
                          value={bookingForm.specialRequests}
                          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                          placeholder="Any special requirements or requests..."
                        />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right: Summary & Submit */}
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h3 className="mb-3 font-semibold">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <Row label="Hotel" value={selectedHotel.name} />
                      <Row label="Guests" value={`${bookingForm.guests} guests`} />
                      <Row label="Nights" value={`${nights} night${nights !== 1 ? 's' : ''}`} />
                      <Row
                        label="Price Range"
                        value={<span className="font-medium text-green-600">{selectedHotel.priceRange}</span>}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50">
                    <h4 className="mb-2 font-semibold text-blue-900">Hotel Contact</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {selectedHotel.contactNumber}
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3 w-3 mt-0.5" />
                        <span>{selectedHotel.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50">
                    <h4 className="mb-2 font-semibold text-green-900">Booking Tips</h4>
                    <p className="text-sm text-green-800">{selectedHotel.bookingTips}</p>
                  </div>

                  <Button
                    onClick={submitBookingRequest}
                    disabled={
                      bookingStatus === 'loading' ||
                      !bookingForm.name ||
                      !bookingForm.email ||
                      !bookingForm.phone ||
                      !bookingForm.checkIn ||
                      !bookingForm.checkOut
                    }
                    loading={bookingStatus === 'loading'}
                    className="w-full"
                  >
                    {bookingStatus === 'loading' ? 'Submitting Request...' : 'Submit Booking Request'}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    This will send your booking request directly to the hotel. They will contact you to confirm availability and payment details.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="mb-4 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Recommended Hotels in {destination}</h2>
        <p className="text-gray-600">Carefully selected accommodations with direct booking assistance</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel, idx) => (
          <Card key={idx} className="overflow-hidden transition-shadow hover:shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                {hotel.rating && (
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({hotel.rating})</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{hotel.location}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-green-600">
                <IndianRupee className="w-4 h-4" />
                <span>{hotel.priceRange}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                <section>
                  <h4 className="mb-2 font-medium text-gray-900">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 4).map((a, i) => (
                      <span key={i} className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">
                        {a}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className="text-xs text-gray-500">+{hotel.amenities.length - 4} more</span>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="mb-1 font-medium text-gray-900">Why Recommended</h4>
                  <p className="text-sm text-gray-600">{hotel.whyRecommended}</p>
                </section>

                <section className="p-3 rounded-lg bg-blue-50">
                  <h4 className="flex items-center gap-2 mb-1 font-medium text-blue-900">
                    <Phone className="w-3 h-3" />
                    Direct Contact
                  </h4>
                  <p className="text-sm text-blue-800">{hotel.contactNumber}</p>
                </section>

                <div className="space-y-2">
                  <Button onClick={() => handleBookHotel(hotel)} className="w-full">
                    Book This Hotel
                  </Button>
                  <a href={`tel:${hotel.contactNumber}`} className="block">
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Directly
                    </Button>
                  </a>
                </div>

                {hotel.bookingTips && (
                  <section className="p-3 rounded-lg bg-green-50">
                    <h4 className="mb-1 font-medium text-green-900">Booking Tip</h4>
                    <p className="text-xs text-green-800">{hotel.bookingTips}</p>
                  </section>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hotels.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <div className="mb-4 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No Hotels Found</h3>
            <p className="text-gray-600">
              We're still gathering hotel information for {destination}. Please contact Jharkhand Tourism at 0651-2331828
              for accommodation assistance.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span>{label}:</span>
      <span className="ml-2">{value}</span>
    </div>
  );
}
