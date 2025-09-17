import type { Hotel } from '@/types/booking'

export const jharkhandHotels: { [destination: string]: Hotel[] } = {
  ranchi: [
    {
      name: 'Radisson Blu Hotel Ranchi',
      location: 'Hinoo, Ranchi',
      priceRange: '₹6,000 - ₹8,500 per night',
      contactNumber: '+91-651-663-3333',
      address: 'PS Hinoo, Near Hinoo Bridge, Ranchi, Jharkhand 834002',
      amenities: ['Free WiFi', 'Restaurant', 'Fitness Center', 'Room Service', 'Conference Rooms', 'Parking'],
      whyRecommended: 'Premium business hotel with excellent service, central location, and modern amenities. Perfect for comfort-seeking travelers.',
      bookingTips: 'Book directly for best rates. Mention corporate rates if traveling for business.',
      rating: 4.2,
      reviews: 1247,
      coordinates: { lat: 23.3441, lng: 85.3096 },
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM'
    },
    {
      name: 'Hotel Capitol Hill',
      location: 'Doranda, Ranchi',
      priceRange: '₹2,500 - ₹3,500 per night',
      contactNumber: '+91-651-221-6633',
      address: 'Doranda Chowk, Near AG Office, Ranchi, Jharkhand 834002',
      amenities: ['Free WiFi', 'Restaurant', 'AC Rooms', 'Room Service', 'Parking', 'Laundry'],
      whyRecommended: 'Well-established hotel with good location and reliable service. Great value for money with comfortable rooms.',
      bookingTips: 'Call directly for better rates. Ask about extended stay discounts for 3+ nights.',
      rating: 3.8,
      reviews: 892,
      coordinates: { lat: 23.3728, lng: 85.3077 }
    },
    {
      name: 'BNR Hotel',
      location: 'Station Road, Ranchi',
      priceRange: '₹1,800 - ₹2,800 per night',
      contactNumber: '+91-651-220-0754',
      address: 'Station Road, Near Railway Station, Ranchi, Jharkhand 834001',
      amenities: ['Free WiFi', 'Restaurant', 'AC/Non-AC Rooms', 'Room Service', 'Travel Desk'],
      whyRecommended: 'Convenient location near railway station, budget-friendly with decent amenities. Good for transit travelers.',
      bookingTips: 'Book AC rooms in summer. Railway station pickup available on request.',
      rating: 3.5,
      reviews: 634
    }
  ],

  deoghar: [
    {
      name: 'Hotel Yatri Niwas',
      location: 'Temple Road, Deoghar',
      priceRange: '₹1,500 - ₹2,500 per night',
      contactNumber: '+91-6432-232-456',
      address: 'Near Baidyanath Temple, Temple Road, Deoghar, Jharkhand 814112',
      amenities: ['Free WiFi', 'Restaurant', 'AC Rooms', 'Temple View', 'Room Service', 'Parking'],
      whyRecommended: 'Prime location near Baidyanath Temple, perfect for pilgrims. Clean rooms with temple views and spiritual ambiance.',
      bookingTips: 'Book well in advance during Shravan month (July-August). Early morning temple visit packages available.',
      rating: 4.0,
      reviews: 567,
      coordinates: { lat: 24.4822, lng: 86.6967 }
    },
    {
      name: 'JSTDC Tourist Lodge Deoghar',
      location: 'Ramakrishna More, Deoghar',
      priceRange: '₹1,200 - ₹1,800 per night',
      contactNumber: '+91-6432-232-324',
      address: 'Ramakrishna More, Deoghar, Jharkhand 814112',
      amenities: ['Restaurant', 'AC/Non-AC Rooms', 'Room Service', 'Tourist Information', 'Parking'],
      whyRecommended: 'Government-run lodge with standardized service and reasonable rates. Reliable option with basic amenities.',
      bookingTips: 'Government rates are fixed. Book online through Jharkhand Tourism website for confirmed reservations.',
      rating: 3.6,
      reviews: 423
    }
  ],

  netarhat: [
    {
      name: 'Forest Rest House Netarhat',
      location: 'Netarhat Hill Station',
      priceRange: '₹800 - ₹1,500 per night',
      contactNumber: '+91-6565-234-567',
      address: 'Forest Department, Netarhat, Latehar, Jharkhand 822124',
      amenities: ['Basic Rooms', 'Forest View', 'Caretaker Service', 'Parking', 'Bonfire Area'],
      whyRecommended: 'Authentic hill station experience amidst nature. Perfect for sunrise/sunset viewing with minimal modern distractions.',
      bookingTips: 'Advance booking mandatory through Forest Department. Carry own food/cooking arrangements. Limited electricity hours.',
      rating: 3.8,
      reviews: 234,
      alternativeOptions: 'Private homestays and guesthouses available in the area'
    },
    {
      name: 'Netarhat Sunrise Resort',
      location: 'Sunrise Point Road, Netarhat',
      priceRange: '₹2,000 - ₹3,200 per night',
      contactNumber: '+91-9234-567-890',
      address: 'Near Sunrise Point, Netarhat, Latehar, Jharkhand 822124',
      amenities: ['Restaurant', 'Sunrise View', 'AC Rooms', 'Nature Walks', 'Room Service', 'Parking'],
      whyRecommended: 'Private resort with excellent sunrise views, comfortable accommodation, and guided nature activities.',
      bookingTips: 'Book sunrise view rooms in advance. Package deals available including meals and nature guides.',
      rating: 4.1,
      reviews: 156
    }
  ],

  jamshedpur: [
    {
      name: 'The Alcor Hotel',
      location: 'Bistupur, Jamshedpur',
      priceRange: '₹4,000 - ₹5,500 per night',
      contactNumber: '+91-657-663-2323',
      address: 'Bistupur Main Road, Jamshedpur, Jharkhand 831001',
      amenities: ['Free WiFi', 'Multi-cuisine Restaurant', 'Fitness Center', 'Business Center', 'Room Service', 'Valet Parking'],
      whyRecommended: 'Premium hotel in heart of Jamshedpur with excellent service and modern amenities. Close to Jubilee Park and shopping areas.',
      bookingTips: 'Corporate discounts available. Weekend packages include breakfast and local sightseeing.',
      rating: 4.3,
      reviews: 1089,
      coordinates: { lat: 22.8046, lng: 86.2029 }
    },
    {
      name: 'Ginger Jamshedpur',
      location: 'Adityapur, Jamshedpur',
      priceRange: '₹2,800 - ₹3,800 per night',
      contactNumber: '+91-657-303-3333',
      address: 'Adityapur Industrial Area, Jamshedpur, Jharkhand 832109',
      amenities: ['Free WiFi', 'Ginger Cafe', 'Fitness Center', '24/7 Room Service', 'Business Center', 'Parking'],
      whyRecommended: 'Modern business hotel with consistent service standards. Great for business travelers and families.',
      bookingTips: 'Early bird discounts available for advance bookings. Ask about local sightseeing packages.',
      rating: 4.0,
      reviews: 745
    }
  ],

  hazaribagh: [
    {
      name: 'Jungle Lodge Hazaribagh',
      location: 'Hazaribagh National Park',
      priceRange: '₹2,500 - ₹4,000 per night',
      contactNumber: '+91-6546-234-789',
      address: 'Near National Park Gate, Hazaribagh, Jharkhand 825301',
      amenities: ['Restaurant', 'Wildlife View', 'Safari Arrangements', 'Nature Walks', 'Bonfire', 'Parking'],
      whyRecommended: 'Perfect location for wildlife enthusiasts with safari packages and nature experiences. Eco-friendly accommodation.',
      bookingTips: 'Safari packages available with accommodation. Book during winter months for best wildlife sightings.',
      rating: 3.9,
      reviews: 312,
      coordinates: { lat: 23.9929, lng: 85.3677 }
    },
    {
      name: 'Hotel Mayur',
      location: 'Hazaribagh Town',
      priceRange: '₹1,200 - ₹2,000 per night',
      contactNumber: '+91-6546-222-456',
      address: 'Main Road, Hazaribagh, Jharkhand 825301',
      amenities: ['Restaurant', 'AC/Non-AC Rooms', 'Room Service', 'Parking', 'Travel Desk'],
      whyRecommended: 'Central location in town with basic amenities. Good base for exploring Canary Hill and local attractions.',
      bookingTips: 'Arrange national park visits through hotel travel desk. Local guide services available.',
      rating: 3.4,
      reviews: 189
    }
  ],

  'betla-national-park': [
    {
      name: 'Betla Forest Lodge',
      location: 'Inside Betla National Park',
      priceRange: '₹1,800 - ₹3,000 per night',
      contactNumber: '+91-6562-234-890',
      address: 'Betla National Park, Latehar, Jharkhand 822124',
      amenities: ['Forest Lodge', 'Safari Arrangements', 'Local Guide Service', 'Basic Restaurant', 'Wildlife View'],
      whyRecommended: 'Authentic jungle experience inside the national park. Best for serious wildlife enthusiasts and photographers.',
      bookingTips: 'Advance booking essential through Forest Department. Safari timings strictly followed. Carry insect repellent.',
      rating: 3.7,
      reviews: 267,
      coordinates: { lat: 23.8833, lng: 84.1833 }
    },
    {
      name: 'Palamau Tiger Resort',
      location: 'Daltonganj Road, Near Betla',
      priceRange: '₹2,200 - ₹3,500 per night',
      contactNumber: '+91-6562-245-678',
      address: 'Daltonganj Road, 15km from Betla Gate, Latehar, Jharkhand 822124',
      amenities: ['Restaurant', 'Safari Packages', 'AC Rooms', 'Wildlife Photography', 'Nature Walks', 'Parking'],
      whyRecommended: 'Private resort offering comfortable stay with organized safari experiences and wildlife photography guidance.',
      bookingTips: 'Tiger safari packages include guide and park entry fees. Best visited November-March for tiger sightings.',
      rating: 4.2,
      reviews: 143
    }
  ]
}

export const getHotelsByDestination = (destination: string): Hotel[] => {
  const key = destination.toLowerCase().replace(/\s+/g, '-')
  return jharkhandHotels[key] || []
}

export const searchHotels = (destination: string, budget?: number): Hotel[] => {
  const hotels = getHotelsByDestination(destination)
  
  if (!budget) return hotels
  
  return hotels.filter(hotel => {
    const priceRange = hotel.priceRange
    const minPrice = parseInt(priceRange.match(/₹(\d+)/)?.[1] || '0')
    return minPrice <= budget
  })
}

export const getRecommendedHotels = (destination: string, category: 'budget' | 'mid-range' | 'luxury' = 'mid-range'): Hotel[] => {
  const hotels = getHotelsByDestination(destination)
  
  return hotels.filter(hotel => {
    const priceRange = hotel.priceRange
    const minPrice = parseInt(priceRange.match(/₹(\d+)/)?.[1] || '0')
    
    switch (category) {
      case 'budget':
        return minPrice < 2500
      case 'luxury':
        return minPrice >= 4000
      default: // mid-range
        return minPrice >= 2500 && minPrice < 4000
    }
  })
}
