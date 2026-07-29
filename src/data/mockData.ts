import { ServiceCategory, ServiceProvider, UserProfile, ServiceBookingRequest, ChatMessage } from '../types';

export const INITIAL_CUSTOMER: UserProfile = {
  id: 'cust_01',
  name: 'Nathi Gumede',
  email: 'nathi.gumede@iserve.app',
  phone: '+1 (555) 234-8901',
  location: 'Downtown Metro',
  address: '125 Main Street, Apt 4B',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  role: 'customer',
  savedLocations: [
    { id: 'loc_1', label: 'Home', address: '125 Main Street, Apt 4B', isDefault: true },
    { id: 'loc_2', label: 'Work', address: '45 Business Ave, Suite 1200' },
    { id: 'loc_3', label: "Mom's House", address: '782 Sunset Boulevard' }
  ],
  notificationsEnabled: true,
};

export const INITIAL_PROVIDER_USER: UserProfile = {
  id: 'prov_01',
  name: 'John Smith',
  email: 'john.smith@iserve.app',
  phone: '+1 (555) 987-6543',
  location: 'Metro Area (Radius 15 km)',
  address: 'Master Electrical Hub, Metro',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  role: 'provider',
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'electrical',
    title: 'Electrical',
    subtitle: 'Fix power & lighting',
    iconName: 'Zap',
    illustrationKey: 'electrical',
    priceStarting: 500,
    estimatedDuration: '45 - 60 mins',
    popularServices: ['Fridge Repair', 'Socket & Switch Repair', 'Circuit Breaker Fix', 'Light Fixture Fitting'],
    description: 'Certified electricians ready for emergency power fixes, appliance installations, and wiring safety audits.',
    subServices: [
      { id: 'elec_1', name: 'Fridge Repair & Service', description: 'Diagnose cooling issues, compressor faults, thermostat replacement & gas refilling.', price: 800, currencySymbol: 'R', estimatedDuration: '45–90 mins' },
      { id: 'elec_2', name: 'Washing Machine & Appliance Fix', description: 'Fix spin cycle issues, drainage pumps, door latches & motor diagnostics.', price: 650, currencySymbol: 'R', estimatedDuration: '45–60 mins' },
      { id: 'elec_3', name: 'Circuit Breaker & Tripping Audit', description: 'Locate short circuits, replace earth leakage units & reset distribution boards.', price: 750, currencySymbol: 'R', estimatedDuration: '30–60 mins' },
      { id: 'elec_4', name: 'Socket & Light Fixture Fitting', description: 'Install wall sockets, light switches, chandeliers & outdoor floodlights.', price: 500, currencySymbol: 'R', estimatedDuration: '30–45 mins' },
    ]
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    subtitle: 'Pipe & leak repairs',
    iconName: 'Droplet',
    illustrationKey: 'plumbing',
    priceStarting: 550,
    estimatedDuration: '30 - 60 mins',
    popularServices: ['Unclog Drains', 'Fix Leaking Taps', 'Toilet Repairs', 'Water Heater Servicing'],
    description: 'Expert plumbers equipped to handle pressurized leaks, drainage issues, and full fixture installs.',
    subServices: [
      { id: 'plumb_1', name: 'Unclog Drain & Main Line', description: 'High-pressure drain unblocking, grease trap clearance & root removal.', price: 700, currencySymbol: 'R', estimatedDuration: '30–60 mins' },
      { id: 'plumb_2', name: 'Leaking Tap & Mixer Replacement', description: 'Replace worn washers, seals, ceramic cartridges, or fit new mixer taps.', price: 550, currencySymbol: 'R', estimatedDuration: '30–45 mins' },
      { id: 'plumb_3', name: 'Geyser & Water Heater Service', description: 'Thermostat replacement, heating element fix, vacuum breaker & valve seal.', price: 1200, currencySymbol: 'R', estimatedDuration: '60–90 mins' },
      { id: 'plumb_4', name: 'Toilet Flush & Bowl Mechanism', description: 'Fix continuous flushing, fill valve leaks & rubber seal replacement.', price: 600, currencySymbol: 'R', estimatedDuration: '30–45 mins' },
    ]
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    subtitle: 'Handyman & repairs',
    iconName: 'Wrench',
    illustrationKey: 'maintenance',
    priceStarting: 450,
    estimatedDuration: '60 mins',
    popularServices: ['Furniture Assembly', 'TV Wall Mounting', 'Door Lock Installation', 'Drywall Patching'],
    description: 'Versatile craftsman for home improvement tasks, mounting heavy decor, and general indoor fixes.',
    subServices: [
      { id: 'maint_1', name: 'TV Wall Mounting & Cable Management', description: 'Secure bracket mounting into brick/drywall with hidden wiring setup.', price: 600, currencySymbol: 'R', estimatedDuration: '45–60 mins' },
      { id: 'maint_2', name: 'Flat-Pack Furniture Assembly', description: 'Assemble wardrobes, office desks, beds, and shelving units efficiently.', price: 450, currencySymbol: 'R', estimatedDuration: '45–90 mins' },
      { id: 'maint_3', name: 'Door Lock Replacement & Repair', description: 'Install mortise locks, deadbolts, handles, and door alignment adjustments.', price: 750, currencySymbol: 'R', estimatedDuration: '30–45 mins' },
    ]
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    subtitle: 'Deep home sanitize',
    iconName: 'ShieldCheck',
    illustrationKey: 'cleaning',
    priceStarting: 500,
    estimatedDuration: '90 - 120 mins',
    popularServices: ['Standard Home Clean', 'Deep Kitchen Sanitization', 'Move-in/out Cleaning', 'Carpet Steaming'],
    description: 'Top-rated professional home cleaners bringing eco-friendly supplies for a spotlessly refreshed home.',
    subServices: [
      { id: 'clean_1', name: 'Standard Residential Clean', description: 'Dusting, vacuuming, floor mopping, trash disposal & bed making.', price: 500, currencySymbol: 'R', estimatedDuration: '90–120 mins' },
      { id: 'clean_2', name: 'Deep Kitchen & Bathroom Sanitize', description: 'Oven degreasing, tile descaling, appliance wiping & steam sanitization.', price: 800, currencySymbol: 'R', estimatedDuration: '120–150 mins' },
      { id: 'clean_3', name: 'Move-in / Move-out Deep Clean', description: 'Thorough top-to-bottom sanitize for empty homes or tenant handovers.', price: 1250, currencySymbol: 'R', estimatedDuration: '180–240 mins' },
    ]
  },
  {
    id: 'mechanic',
    title: 'Mechanic',
    subtitle: 'Mobile car service',
    iconName: 'Car',
    illustrationKey: 'mechanic',
    priceStarting: 450,
    estimatedDuration: '45 - 90 mins',
    popularServices: ['Jump Start Battery', 'Tire Change & Inflation', 'Brake Pad Replacement', 'Engine Diagnostic'],
    description: 'Mobile auto mechanics arriving at your driveway with full tools for roadside assistance and tuneups.',
    subServices: [
      { id: 'mech_1', name: 'On-Site Battery Jump & Test', description: 'Driveway arrival with battery health check & heavy duty jumpstart.', price: 450, currencySymbol: 'R', estimatedDuration: '20–30 mins' },
      { id: 'mech_2', name: 'Brake Pad Replacement', description: 'On-site installation of front or rear brake pads with rotor inspection.', price: 1100, currencySymbol: 'R', estimatedDuration: '60–90 mins' },
      { id: 'mech_3', name: 'Engine Diagnostic & Scan', description: 'OBD-II error code scanning, spark plug check & fluid level topping.', price: 850, currencySymbol: 'R', estimatedDuration: '45–60 mins' },
    ]
  },
  {
    id: 'beauty',
    title: 'Beauty',
    subtitle: 'At-home grooming',
    iconName: 'Scissors',
    illustrationKey: 'beauty',
    priceStarting: 400,
    estimatedDuration: '60 mins',
    popularServices: ['Hair Styling & Cut', 'Manicure & Pedicure', 'Makeup Artistry', 'Relaxing Massage'],
    description: 'Certified beauty therapists and stylists delivering salon-grade personal care directly to your living room.',
    subServices: [
      { id: 'beauty_1', name: 'At-Home Hair Styling & Cut', description: 'Professional wash, trim, blow-dry & precision styling in your home.', price: 550, currencySymbol: 'R', estimatedDuration: '60 mins' },
      { id: 'beauty_2', name: 'Full Gel Manicure & Pedicure', description: 'Nail shaping, cuticle treatment, gel polish application & massage.', price: 600, currencySymbol: 'R', estimatedDuration: '75 mins' },
    ]
  },
  {
    id: 'technical',
    title: 'Technical Support',
    subtitle: 'WiFi & PC assistance',
    iconName: 'Laptop',
    illustrationKey: 'technical',
    priceStarting: 500,
    estimatedDuration: '45 mins',
    popularServices: ['Mesh WiFi Setup', 'PC/Mac Virus Removal', 'Smart Home Hub Sync', 'Data Backup & Recovery'],
    description: 'Patient tech experts solving network dropouts, printer glitches, computer slowdowns, and smart devices.',
    subServices: [
      { id: 'tech_1', name: 'WiFi & Network Optimization', description: 'Mesh router setup, dead zone elimination & fiber speed tuning.', price: 650, currencySymbol: 'R', estimatedDuration: '45–60 mins' },
      { id: 'tech_2', name: 'PC / Mac Cleanup & Malware Removal', description: 'System speedup, virus scan, OS updates & software troubleshooting.', price: 550, currencySymbol: 'R', estimatedDuration: '45–60 mins' },
    ]
  },
  {
    id: 'nanny',
    title: 'Nanny',
    subtitle: 'Childcare & sitting',
    iconName: 'Heart',
    illustrationKey: 'nanny',
    priceStarting: 350,
    estimatedDuration: '2 - 4 hours',
    popularServices: ['After-School Sitting', 'Infant Care Assistant', 'Homework Tutor', 'Nighttime Babysitting'],
    description: 'Vetted, background-checked child caregivers with CPR certification and early childhood experience.',
    subServices: [
      { id: 'nanny_1', name: 'After-School Childcare (3 Hours)', description: 'Snack prep, homework guidance & interactive play supervision.', price: 450, currencySymbol: 'R', estimatedDuration: '180 mins' },
      { id: 'nanny_2', name: 'Infant & Toddler Sitting', description: 'Certified CPR caregiver for feedings, nap schedules & gentle play.', price: 600, currencySymbol: 'R', estimatedDuration: '240 mins' },
    ]
  },
  {
    id: 'errands',
    title: 'Errands Runner',
    subtitle: 'Pickups & delivery',
    iconName: 'ShoppingBag',
    illustrationKey: 'errands',
    priceStarting: 300,
    estimatedDuration: '30 - 60 mins',
    popularServices: ['Grocery Shopping', 'Pharmacy Prescription Pickup', 'Dry Cleaning Run', 'Parcel Drop-off'],
    description: 'Fast personal assistants for daily household tasks, package dispatches, and emergency store runs.',
    subServices: [
      { id: 'errand_1', name: 'Grocery & Pharmacy Shopping', description: 'Store pickup with receipt photo confirmation & doorstep delivery.', price: 350, currencySymbol: 'R', estimatedDuration: '45 mins' },
      { id: 'errand_2', name: 'Express Document / Package Delivery', description: 'Urgent point-to-point courier dispatch across city suburbs.', price: 300, currencySymbol: 'R', estimatedDuration: '30 mins' },
    ]
  }
];

export const MOCK_PROVIDERS: ServiceProvider[] = [
  {
    id: 'prov_john',
    name: 'John Smith',
    category: 'Electrical',
    rating: 4.9,
    reviewsCount: 142,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    distanceKm: 2.4,
    estimatedArrivalMins: 8,
    hourlyRate: 60.00,
    verified: true,
    phone: '+1 (555) 987-6543',
    completedJobs: 310,
    location: { lat: 37.7749 + 0.012, lng: -122.4194 + 0.008 },
    bio: 'Master Electrician with 12+ years experience in high-end residential wiring, smart lighting, and safety audits.',
    specialties: ['Circuit Breakers', 'Emergency Power', 'Smart Home Hubs'],
    vehicle: 'White Ford Transit Van (#iServe-78)'
  },
  {
    id: 'prov_mike',
    name: 'Mike Johnson',
    category: 'Electrical',
    rating: 4.8,
    reviewsCount: 96,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    distanceKm: 3.1,
    estimatedArrivalMins: 12,
    hourlyRate: 58.00,
    verified: true,
    phone: '+1 (555) 432-1098',
    completedJobs: 180,
    location: { lat: 37.7749 - 0.009, lng: -122.4194 + 0.015 },
    bio: 'Licensed electrical technician specialized in quick socket replacements, chandelier hanging, and fault tracing.',
    specialties: ['Socket Repair', 'Lighting Installation', 'Fuse Boxes'],
    vehicle: 'Silver Chevrolet Express'
  },
  {
    id: 'prov_david',
    name: 'David Williams',
    category: 'Plumbing',
    rating: 4.9,
    reviewsCount: 126,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    distanceKm: 1.8,
    estimatedArrivalMins: 6,
    hourlyRate: 65.00,
    verified: true,
    phone: '+1 (555) 765-4321',
    completedJobs: 240,
    location: { lat: 37.7749 + 0.005, lng: -122.4194 - 0.010 },
    bio: 'Emergency plumber equipped with high-pressure camera inspection gear. Guaranteed zero water leaks.',
    specialties: ['Unclog Drain', 'Pipe Fitting', 'Water Heaters'],
    vehicle: 'Blue Dodge Ram'
  },
  {
    id: 'prov_sarah',
    name: 'Sarah Chen',
    category: 'Cleaning',
    rating: 5.0,
    reviewsCount: 215,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    distanceKm: 2.1,
    estimatedArrivalMins: 9,
    hourlyRate: 45.00,
    verified: true,
    phone: '+1 (555) 321-6547',
    completedJobs: 420,
    location: { lat: 37.7749 - 0.004, lng: -122.4194 - 0.006 },
    bio: 'Eco-cleaning expert offering organic, allergy-safe deep clean solutions for modern urban residences.',
    specialties: ['Deep Clean', 'Kitchen & Bath', 'Move-out Sanitize'],
    vehicle: 'Green Prius Eco'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'prov_john',
    senderName: 'John Smith',
    text: 'Hi Nathi! I have accepted your request and am en route in my van.',
    timestamp: '10:30 AM',
    isMe: false,
    status: 'read'
  },
  {
    id: 'msg_2',
    senderId: 'cust_01',
    senderName: 'Nathi Gumede',
    text: 'Great, thank you John! Please bring extra 15A socket faceplates if possible.',
    timestamp: '10:31 AM',
    isMe: true,
    status: 'read'
  },
  {
    id: 'msg_3',
    senderId: 'prov_john',
    senderName: 'John Smith',
    text: 'Understood! I have a full kit with copper spares. See you in about 8 minutes.',
    timestamp: '10:32 AM',
    isMe: false,
    status: 'read'
  }
];

export const RECENT_REQUESTS: ServiceBookingRequest[] = [
  {
    id: 'req_101',
    categoryId: 'electrical',
    categoryTitle: 'Electrical Services',
    providerId: 'prov_john',
    provider: MOCK_PROVIDERS[0],
    customerName: 'Nathi Gumede',
    address: '125 Main Street, Apt 4B',
    notes: 'Main hallway switch flickering and tripping breaker.',
    paymentMethod: 'apple_pay',
    amount: 60.00,
    status: 'accepted',
    createdAt: '10 mins ago',
    userCoords: { lat: 37.7749, lng: -122.4194 },
    providerCoords: { lat: 37.7810, lng: -122.4110 }
  },
  {
    id: 'req_098',
    categoryId: 'cleaning',
    categoryTitle: 'Deep Home Clean',
    providerId: 'prov_sarah',
    provider: MOCK_PROVIDERS[3],
    customerName: 'Nathi Gumede',
    address: '125 Main Street, Apt 4B',
    notes: 'Completed spring deep clean with steam sanitization.',
    paymentMethod: 'credit_card',
    amount: 90.00,
    status: 'completed',
    createdAt: '3 days ago',
    ratingGiven: 5,
    reviewGiven: 'Sarah was outstanding! Everything sparkled.',
    userCoords: { lat: 37.7749, lng: -122.4194 },
    providerCoords: { lat: 37.7749, lng: -122.4194 }
  }
];
