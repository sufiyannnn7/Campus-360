export interface LandingStat {
  label: string;
  value: string;
  description: string;
  change?: string;
  href?: string;
}

export interface UpcomingEventItem {
  id: number;
  title: string;
  date: string;
  startDatetime?: string;
  time: string;
  venue: string;
  category: "Technical" | "Cultural" | "Sports" | "Literary" | "Entrepreneurship" | "Arts" | "Social Service";
  organizer: string;
  organizerLogo?: string;
  status: "Open" | "Filling Fast" | "Closed";
  bannerUrl: string;
  seatsLeft?: number;
}

export interface FeaturedClubItem {
  id: number;
  name: string;
  category: string;
  memberCount: number;
  tagline: string;
  logoUrl: string;
  bannerUrl: string;
  eventCount: number;
}

export interface LatestNewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  author: string;
  readTime: string;
  imageUrl: string;
}

export interface GalleryPhotoItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  date: string;
}

export interface TestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  rating: number;
}

export interface MiniCalendarEvent {
  day: number;
  title: string;
  category: string;
  time: string;
  eventId: number;
}

export const HERO_HIGHLIGHT = {
  badge: "🔥 Major Event • Aug 22 - Oct 24",
  title: "Eureka Pitching Competition & E-Cell NKOCET Flagship Events",
  subtitle: "Join 22+ innovative student startup teams, CSESA hackathons, Future Tech AI expos, and Team Avengineers vehicle showcases.",
  link: "/events/1",
};

export const LANDING_STATS: LandingStat[] = [
  {
    label: "Events Scheduled",
    value: "54+",
    description: "Pitch slams, hackathons, club inaugurations & tech expos",
    change: "+18% this month",
    href: "/events",
  },
  {
    label: "Active Campus Clubs",
    value: "9+",
    description: "E-Cell, CSESA, GDG, Future Tech, English Club & SAE Teams",
    change: "across NKOCET departments",
    href: "/clubs",
  },
  {
    label: "Registered Students",
    value: "4,850+",
    description: "Verified NKOCET students actively participating in campus activities",
    change: "96% campus engagement",
    href: "/dashboard",
  },
  {
    label: "Certificates Issued",
    value: "1,420+",
    description: "Cryptographically verified digital achievement badges",
    change: "100% QR verifiable",
    href: "/certificates",
  },
];

export const UPCOMING_EVENTS_DATA: UpcomingEventItem[] = [
  {
    id: 1,
    title: "Eureka Pitching Competition (Internal Round) & E-Cell Launch",
    date: "Aug 22, 2026",
    startDatetime: "2026-08-22T10:00:00Z",
    time: "10:00 AM - 04:00 PM",
    venue: "College Seminar Hall (Main Building, Ground Floor)",
    category: "Entrepreneurship",
    organizer: "E-Cell NKOCET",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=ECell&backgroundColor=10b981",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 12,
  },
  {
    id: 2,
    title: "E-Cell NKOCET Grand Inauguration 2026",
    date: "Aug 22, 2026",
    startDatetime: "2026-08-22T09:30:00Z",
    time: "09:30 AM - 11:30 AM",
    venue: "College Seminar Hall (Main Building, Ground Floor)",
    category: "Entrepreneurship",
    organizer: "E-Cell NKOCET",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=ECell&backgroundColor=059669",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 20,
  },
  {
    id: 3,
    title: "Future Tech Club Inauguration & AI Tech Expo",
    date: "Aug 22, 2026",
    startDatetime: "2026-08-22T11:30:00Z",
    time: "11:30 AM - 01:30 PM",
    venue: "College Seminar Hall & Tech Lab 1 (Engineering Wing)",
    category: "Technical",
    organizer: "Future Tech Club",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=FutureTech&backgroundColor=6366f1",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 35,
  },
  {
    id: 4,
    title: "English Club Inauguration & Inter-Departmental Debate",
    date: "Aug 22, 2026",
    startDatetime: "2026-08-22T14:00:00Z",
    time: "02:00 PM - 04:30 PM",
    venue: "College Seminar Hall B (Language Wing)",
    category: "Literary",
    organizer: "ENGLISH CLUB",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=EnglishClub&backgroundColor=ec4899",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 40,
  },
  {
    id: 5,
    title: "Rotaract Club Youth Orientation & Community Drive",
    date: "Aug 22, 2026",
    startDatetime: "2026-08-22T16:30:00Z",
    time: "04:30 PM - 06:00 PM",
    venue: "College Main Auditorium (Central Admin Block, 1st Floor)",
    category: "Social Service",
    organizer: "Rotaract Club of NKOCET",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=Rotaract&backgroundColor=f59e0b",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 50,
  },
  {
    id: 6,
    title: "CSESA National Code-A-Thon & Hackathon 2026",
    date: "Oct 24, 2026",
    startDatetime: "2026-10-24T09:00:00Z",
    time: "09:00 AM - 06:00 PM",
    venue: "Central Computer Center (CSE Block, 2nd Floor)",
    category: "Technical",
    organizer: "CSESA",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=CSESA&backgroundColor=3b82f6",
    status: "Filling Fast",
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 15,
  },
  {
    id: 7,
    title: "Team Avengineers SAE All-Terrain Vehicle Showcase",
    date: "Sep 12, 2026",
    startDatetime: "2026-09-12T10:00:00Z",
    time: "10:00 AM - 04:00 PM",
    venue: "Mechanical Block Quadrangle & SAE Workshop",
    category: "Technical",
    organizer: "Team Avengineers",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=Avengineers&backgroundColor=ef4444",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 25,
  },
  {
    id: 8,
    title: "Team Pushpak UAV Drone Flying Expo & Aero Workshop",
    date: "Sep 18, 2026",
    startDatetime: "2026-09-18T11:00:00Z",
    time: "11:00 AM - 03:00 PM",
    venue: "College Sports Ground & Open Air Arena",
    category: "Technical",
    organizer: "Team Pushpak",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=Pushpak&backgroundColor=0284c7",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 30,
  },
  {
    id: 9,
    title: "Team Ashwamedh Hybrid Supermileage Car Launch",
    date: "Sep 25, 2026",
    startDatetime: "2026-09-25T14:00:00Z",
    time: "02:00 PM - 05:00 PM",
    venue: "Central Lawn & Mechanical Workshop",
    category: "Technical",
    organizer: "Team Ashwamedh",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=Ashwamedh&backgroundColor=8b5cf6",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 20,
  },
  {
    id: 10,
    title: "GDG NKOCET Android & Cloud Bootcamp",
    date: "Oct 05, 2026",
    startDatetime: "2026-10-05T10:00:00Z",
    time: "10:00 AM - 03:00 PM",
    venue: "Central Computer Center (CSE Block, 2nd Floor)",
    category: "Technical",
    organizer: "GDG NKOCET",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=GDG&backgroundColor=ea4335",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 45,
  },
];

export const FEATURED_CLUBS_DATA: FeaturedClubItem[] = [
  {
    id: 1,
    name: "E-Cell NKOCET",
    category: "Entrepreneurship",
    memberCount: 380,
    tagline: "Entrepreneurship Cell | N. K. Orchid College of Engineering & Technology — Fostering startup culture, incubation & mentorship.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=ECell&backgroundColor=10b981",
    bannerUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80",
    eventCount: 14,
  },
  {
    id: 2,
    name: "CSESA",
    category: "Technical",
    memberCount: 520,
    tagline: "Computer Science & Engineering Student Association — Organises hackathons, coding leagues & tech symposiums.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=CSESA&backgroundColor=3b82f6",
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    eventCount: 18,
  },
  {
    id: 3,
    name: "GDG NKOCET",
    category: "Technical",
    memberCount: 450,
    tagline: "Google Developer Group NKOCET — Empowering developers with Android, Web, Cloud & AI hands-on workshops.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=GDG&backgroundColor=ea4335",
    bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    eventCount: 15,
  },
  {
    id: 4,
    name: "Future Tech Club",
    category: "Technical",
    memberCount: 290,
    tagline: "Exploring emerging technologies, Generative AI, IoT, AR/VR, and Advanced Robotics for next-gen innovation.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=FutureTech&backgroundColor=6366f1",
    bannerUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    eventCount: 10,
  },
  {
    id: 5,
    name: "ENGLISH CLUB",
    category: "Literary & Arts",
    memberCount: 310,
    tagline: "English & Literary Society NKOCET — Elevating communication skills, debates, public speaking & personality.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=EnglishClub&backgroundColor=ec4899",
    bannerUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
    eventCount: 8,
  },
  {
    id: 6,
    name: "Team Avengineers",
    category: "Engineering & SAE",
    memberCount: 180,
    tagline: "Official SAE Baja & Automotive Engineering Team — Designing & fabricating all-terrain competitive race vehicles.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Avengineers&backgroundColor=ef4444",
    bannerUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
    eventCount: 6,
  },
  {
    id: 7,
    name: "Team Pushpak",
    category: "Aerospace & UAV",
    memberCount: 160,
    tagline: "Aeromodelling & UAV Drone Engineering Team — Building autonomous drones, RC aircraft & aerospace prototypes.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Pushpak&backgroundColor=0284c7",
    bannerUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
    eventCount: 7,
  },
  {
    id: 8,
    name: "Team Ashwamedh",
    category: "Engineering & SAE",
    memberCount: 140,
    tagline: "Supermileage & Electric Vehicle Engineering Team — Engineering ultra-fuel-efficient hybrid race cars.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Ashwamedh&backgroundColor=8b5cf6",
    bannerUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80",
    eventCount: 5,
  },
  {
    id: 9,
    name: "Rotaract Club of NKOCET",
    category: "Social Service",
    memberCount: 410,
    tagline: "Youth Empowerment & Community Service — Driving social responsibility, blood donation & leadership initiatives.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Rotaract&backgroundColor=f59e0b",
    bannerUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80",
    eventCount: 12,
  },
];

export const MINI_CALENDAR_EVENTS: MiniCalendarEvent[] = [
  { day: 22, title: "Eureka Pitching Competition Internal Round", category: "Entrepreneurship", time: "10:00 AM", eventId: 1 },
  { day: 22, title: "E-Cell NKOCET Grand Inauguration", category: "Entrepreneurship", time: "09:30 AM", eventId: 2 },
  { day: 22, title: "Future Tech Club Inauguration & AI Expo", category: "Technical", time: "11:30 AM", eventId: 3 },
  { day: 22, title: "English Club Inauguration & Debate", category: "Literary", time: "02:00 PM", eventId: 4 },
  { day: 22, title: "Rotaract Club Youth Orientation", category: "Social Service", time: "04:30 PM", eventId: 5 },
  { day: 12, title: "Team Avengineers SAE Vehicle Showcase", category: "Technical", time: "10:00 AM", eventId: 7 },
  { day: 18, title: "Team Pushpak UAV Flying Expo", category: "Technical", time: "11:00 AM", eventId: 8 },
  { day: 25, title: "Team Ashwamedh Supermileage Launch", category: "Technical", time: "02:00 PM", eventId: 9 },
  { day: 24, title: "CSESA National Code-A-Thon", category: "Technical", time: "09:00 AM", eventId: 6 },
];

export const LATEST_NEWS_DATA: LatestNewsItem[] = [
  {
    id: 1,
    title: "Eureka Pitching Competition Internal Round & E-Cell NKOCET Inauguration Held on August 22",
    category: "Entrepreneurship",
    date: "Aug 22, 2026",
    excerpt: "22 student startup teams pitched innovative business models at the College Seminar Hall before an esteemed jury panel of industry entrepreneurs.",
    author: "E-Cell NKOCET",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Triple Launch Milestone: Future Tech Club, English Club & Rotaract Club Inaugurated on Aug 22",
    category: "Campus News",
    date: "Aug 22, 2026",
    excerpt: "NKOCET celebrated a grand joint inauguration ceremony at the College Seminar Hall, unleashing new opportunities in AI, literary arts, and community service.",
    author: "Student Council",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "CSESA Opens Registrations for National Code-A-Thon & Hackathon 2026",
    category: "Hackathon",
    date: "Aug 18, 2026",
    excerpt: "Computer Science & Engineering Student Association (CSESA) invites student developers for a 24-hour coding sprint at Central Computer Center.",
    author: "CSESA",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Team Avengineers, Team Pushpak & Team Ashwamedh Unveil 2026 Competition Prototypes",
    category: "Engineering",
    date: "Aug 12, 2026",
    excerpt: "NKOCET's flagship SAE Baja, Aeromodelling UAV, and Supermileage teams reveal custom-engineered race vehicles for national championships.",
    author: "Mechanical Dept",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
  },
];

export const GALLERY_PHOTOS_DATA: GalleryPhotoItem[] = [
  {
    id: 1,
    title: "Eureka Pitching Competition Presentations",
    category: "E-Cell NKOCET",
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&auto=format&fit=crop&q=80",
    caption: "22 student teams presenting working prototypes to the entrepreneurial jury at College Seminar Hall.",
    date: "Aug 22, 2026",
  },
  {
    id: 2,
    title: "Future Tech Club AI Expo",
    category: "Tech Launch",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80",
    caption: "Robotics and Generative AI demonstration at the Future Tech Inaugural Expo.",
    date: "Aug 22, 2026",
  },
  {
    id: 3,
    title: "Team Pushpak UAV Flight Demonstration",
    category: "Aerospace",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000&auto=format&fit=crop&q=80",
    caption: "Autonomous drone flight test at NKOCET Sports Ground.",
    date: "August 2026",
  },
  {
    id: 4,
    title: "Team Avengineers SAE All-Terrain Vehicle Test",
    category: "Automotive",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&auto=format&fit=crop&q=80",
    caption: "Custom fabricated Baja vehicle undergoing suspension and endurance testing.",
    date: "August 2026",
  },
  {
    id: 5,
    title: "English Club Inaugural Debate Competition",
    category: "Literary",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop&q=80",
    caption: "Student debaters speaking on tech ethics during the English Club launch.",
    date: "Aug 22, 2026",
  },
  {
    id: 6,
    title: "CSESA Hackathon Opening Keynote",
    category: "CSESA",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
    caption: "Over 200 programmers assembling for the 24-hour coding competition.",
    date: "Fall 2026",
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 1,
    quote: "Presenting our startup idea at the Eureka Pitching Competition on August 22 at the Seminar Hall was life-changing! The entrepreneurial jury gave us invaluable insights to scale our product.",
    name: "Sufiyan Shaikh",
    role: "Lead Founder, Student Startup",
    department: "E-Cell NKOCET / CSE Dept",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sufiyan",
    rating: 5,
  },
  {
    id: 2,
    quote: "CSESA and Future Tech Club provide incredible platforms for students. From hackathons to AI expos, Campus 360 keeps our entire campus connected in real-time.",
    name: "Prathamesh Patil",
    role: "Core Member, CSESA",
    department: "Computer Science Dept",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Prathamesh",
    rating: 5,
  },
  {
    id: 3,
    quote: "Building competitive SAE vehicles with Team Avengineers and drones with Team Pushpak requires intense coordination. Campus 360 streamlines event venues, schedules, and club recruitment.",
    name: "Aayan Kazi",
    role: "Lead Engineer, Team Avengineers",
    department: "Mechanical Engineering",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aayan",
    rating: 5,
  },
];
