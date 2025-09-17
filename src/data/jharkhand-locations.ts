export interface JharkhandLocation {
  id: string
  name: string
  district: string
  category: 'city' | 'hill-station' | 'wildlife' | 'religious' | 'waterfall' | 'heritage'
  coordinates: {
    lat: number
    lng: number
  }
  altitude?: number
  bestTime: string[]
  highlights: string[]
  nearestAirport: string
  nearestRailway: string
  description: string
  famousFor: string[]
  avgTemperature: {
    winter: string
    summer: string
    monsoon: string
  }
  suggestedDays: number
}

export const jharkhandLocations: JharkhandLocation[] = [
  {
    id: 'ranchi',
    name: 'Ranchi',
    district: 'Ranchi',
    category: 'city',
    coordinates: { lat: 23.3441, lng: 85.3096 },
    altitude: 651,
    bestTime: ['October', 'November', 'December', 'January', 'February', 'March'],
    highlights: [
      'Hundru Falls (98m high)',
      'Dassam Falls (44m high)',
      'Jonha Falls (43m high)',
      'Rock Garden',
      'Tagore Hill',
      'Birsa Zoological Park',
      'Kanke Dam'
    ],
    nearestAirport: 'Birsa Munda Airport (IXR)',
    nearestRailway: 'Ranchi Railway Station',
    description: 'Capital city of Jharkhand, known as the "City of Waterfalls" with numerous cascading falls around the city.',
    famousFor: ['Waterfalls', 'Rock Garden', 'Tribal Culture', 'Government Offices'],
    avgTemperature: {
      winter: '10°C - 25°C',
      summer: '25°C - 40°C',
      monsoon: '20°C - 32°C'
    },
    suggestedDays: 3
  },
  {
    id: 'deoghar',
    name: 'Deoghar',
    district: 'Deoghar',
    category: 'religious',
    coordinates: { lat: 24.4822, lng: 86.6967 },
    altitude: 254,
    bestTime: ['October', 'November', 'December', 'January', 'February', 'March'],
    highlights: [
      'Baidyanath Jyotirlinga Temple',
      'Naulakha Temple',
      'Tapovan Hills',
      'Trikuta Parvat',
      'Basukinath Temple',
      'Satsang Ashram'
    ],
    nearestAirport: 'Deoghar Airport (DGH)',
    nearestRailway: 'Jasidih Junction (24 km)',
    description: 'Sacred city famous for Baidyanath Jyotirlinga, one of the twelve sacred abodes of Lord Shiva.',
    famousFor: ['Baidyanath Temple', 'Religious Tourism', 'Shravan Month Festival', 'Spiritual Significance'],
    avgTemperature: {
      winter: '12°C - 26°C',
      summer: '26°C - 42°C',
      monsoon: '22°C - 34°C'
    },
    suggestedDays: 2
  },
  {
    id: 'netarhat',
    name: 'Netarhat',
    district: 'Latehar',
    category: 'hill-station',
    coordinates: { lat: 23.4667, lng: 84.2500 },
    altitude: 1128,
    bestTime: ['October', 'November', 'December', 'January', 'February'],
    highlights: [
      'Sunrise Point',
      'Magnolia Sunset Point',
      'Upper Ghaghri Falls',
      'Lower Ghaghri Falls',
      'Netarhat Vidyalaya',
      'Dense Forest Trails'
    ],
    nearestAirport: 'Birsa Munda Airport, Ranchi (156 km)',
    nearestRailway: 'Latehar Railway Station (60 km)',
    description: 'Queen of Chotanagpur, a hill station known for its scenic beauty, sunrise/sunset points, and pleasant climate.',
    famousFor: ['Sunrise Views', 'Sunset Points', 'Hill Station', 'Cool Climate', 'Waterfalls'],
    avgTemperature: {
      winter: '5°C - 20°C',
      summer: '18°C - 30°C',
      monsoon: '15°C - 25°C'
    },
    suggestedDays: 2
  },
  {
    id: 'jamshedpur',
    name: 'Jamshedpur',
    district: 'East Singhbhum',
    category: 'city',
    coordinates: { lat: 22.8046, lng: 86.2029 },
    altitude: 135,
    bestTime: ['October', 'November', 'December', 'January', 'February', 'March'],
    highlights: [
      'Jubilee Park',
      'Tata Steel Zoological Park',
      'Dimna Lake',
      'Dalma Wildlife Sanctuary',
      'Bhuvaneshwari Temple',
      'Russi Modi Centre of Excellence'
    ],
    nearestAirport: 'Sonari Airport (IXW)',
    nearestRailway: 'Tatanagar Junction',
    description: 'Steel city of India, planned industrial city with beautiful parks, lakes, and modern infrastructure.',
    famousFor: ['Tata Steel', 'Planned City', 'Parks', 'Industrial Heritage', 'Modern Infrastructure'],
    avgTemperature: {
      winter: '12°C - 28°C',
      summer: '24°C - 42°C',
      monsoon: '22°C - 35°C'
    },
    suggestedDays: 2
  },
  {
    id: 'hazaribagh',
    name: 'Hazaribagh',
    district: 'Hazaribagh',
    category: 'wildlife',
    coordinates: { lat: 23.9929, lng: 85.3677 },
    altitude: 615,
    bestTime: ['November', 'December', 'January', 'February', 'March'],
    highlights: [
      'Hazaribagh National Park',
      'Canary Hill',
      'Konar Dam',
      'Hazaribagh Lake',
      'Isco Rock Paintings',
      'Churchu Falls'
    ],
    nearestAirport: 'Birsa Munda Airport, Ranchi (93 km)',
    nearestRailway: 'Hazaribagh Road Railway Station',
    description: 'Known for its national park, wildlife sanctuary, and scenic hill station atmosphere.',
    famousFor: ['National Park', 'Wildlife', 'Canary Hill', 'Rock Paintings', 'Natural Beauty'],
    avgTemperature: {
      winter: '8°C - 24°C',
      summer: '22°C - 38°C',
      monsoon: '20°C - 30°C'
    },
    suggestedDays: 2
  },
  {
    id: 'betla-national-park',
    name: 'Betla National Park',
    district: 'Latehar',
    category: 'wildlife',
    coordinates: { lat: 23.8833, lng: 84.1833 },
    altitude: 300,
    bestTime: ['November', 'December', 'January', 'February', 'March'],
    highlights: [
      'Tiger Reserve',
      'Elephant Safari',
      'Palamau Fort',
      'Betla Fort',
      'Wildlife Photography',
      'Bird Watching'
    ],
    nearestAirport: 'Birsa Munda Airport, Ranchi (170 km)',
    nearestRailway: 'Daltonganj Railway Station (25 km)',
    description: 'Part of Palamau Tiger Reserve, famous for its wildlife including tigers, elephants, and historical forts.',
    famousFor: ['Tigers', 'Elephants', 'Wildlife Safari', 'Palamau Fort', 'Forest Reserve'],
    avgTemperature: {
      winter: '10°C - 26°C',
      summer: '25°C - 40°C',
      monsoon: '22°C - 32°C'
    },
    suggestedDays: 2
  },
  {
    id: 'parasnath-hill',
    name: 'Parasnath Hill',
    district: 'Giridih',
    category: 'religious',
    coordinates: { lat: 23.9636, lng: 86.1636 },
    altitude: 1365,
    bestTime: ['October', 'November', 'December', 'January', 'February'],
    highlights: [
      'Highest Peak in Jharkhand',
      'Jain Temples',
      'Trekking Trails',
      'Shikharji Temple',
      'Religious Significance',
      'Panoramic Views'
    ],
    nearestAirport: 'Birsa Munda Airport, Ranchi (180 km)',
    nearestRailway: 'Parasnath Railway Station',
    description: 'Highest peak in Jharkhand and sacred pilgrimage site for Jains with ancient temples.',
    famousFor: ['Highest Peak', 'Jain Pilgrimage', 'Trekking', 'Religious Tourism', 'Mountain Views'],
    avgTemperature: {
      winter: '6°C - 22°C',
      summer: '20°C - 35°C',
      monsoon: '18°C - 28°C'
    },
    suggestedDays: 1
  },
  {
    id: 'dhanbad',
    name: 'Dhanbad',
    district: 'Dhanbad',
    category: 'city',
    coordinates: { lat: 23.7957, lng: 86.4304 },
    altitude: 260,
    bestTime: ['October', 'November', 'December', 'January', 'February', 'March'],
    highlights: [
      'Coal Mining Heritage',
      'Maithon Dam',
      'Panchet Dam',
      'Topchanchi Lake',
      'Bhatinda Falls',
      'ISM Dhanbad (IIT)'
    ],
    nearestAirport: 'Birsa Munda Airport, Ranchi (160 km)',
    nearestRailway: 'Dhanbad Junction',
    description: 'Coal capital of India with industrial heritage, dams, and educational institutions.',
    famousFor: ['Coal Mining', 'IIT Dhanbad', 'Dams', 'Industrial Heritage', 'Educational Hub'],
    avgTemperature: {
      winter: '11°C - 27°C',
      summer: '26°C - 42°C',
      monsoon: '23°C - 35°C'
    },
    suggestedDays: 1
  }
]

export const getLocationByName = (name: string): JharkhandLocation | undefined => {
  const searchTerm = name.toLowerCase().trim()
  return jharkhandLocations.find(location =>
    location.name.toLowerCase() === searchTerm ||
    location.id === searchTerm ||
    location.name.toLowerCase().includes(searchTerm)
  )
}

export const getLocationsByCategory = (category: JharkhandLocation['category']): JharkhandLocation[] => {
  return jharkhandLocations.filter(location => location.category === category)
}

export const getPopularDestinations = (): JharkhandLocation[] => {
  return jharkhandLocations
    .filter(location => ['ranchi', 'deoghar', 'netarhat', 'jamshedpur', 'betla-national-park'].includes(location.id))
    .sort((a, b) => b.suggestedDays - a.suggestedDays)
}
