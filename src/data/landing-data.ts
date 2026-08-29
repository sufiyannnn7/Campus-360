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
  time: string;
  venue: string;
  category: "Technical" | "Cultural" | "Sports" | "Literary" | "Entrepreneurship" | "Arts";
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
  badge: "🔥 Upcoming Major Fest • Oct 24-26",
  title: "HackSphere 2026 Annual Hackathon & Tech Fest",
  subtitle: "Join 500+ student developers for 36 hours of building, workshops, and ₹1,50,000+ in prize pools.",
  link: "/events/1",
};

export const LANDING_STATS: LandingStat[] = [
  {
    label: "Events This Month",
    value: "48+",
    description: "Hackathons, cultural nights, workshops & sports meets",
    change: "+12% from last month",
    href: "/events",
  },
  {
    label: "Active Clubs",
    value: "32+",
    description: "Official student organizations & technical societies",
    change: "across 6 departments",
    href: "/clubs",
  },
  {
    label: "Registered Students",
    value: "4,850+",
    description: "Verified campus users actively participating in events",
    change: "94% campus coverage",
    href: "/dashboard",
  },
  {
    label: "Certificates Issued",
    value: "1,290+",
    description: "Cryptographically verified digital achievement badges",
    change: "100% QR verifiable",
    href: "/certificates",
  },
];

export const UPCOMING_EVENTS_DATA: UpcomingEventItem[] = [
  {
    id: 1,
    title: "HackSphere 2026 Annual Hackathon",
    date: "Oct 24, 2026",
    time: "09:00 AM - 06:00 PM",
    venue: "Main Auditorium & Lab 302",
    category: "Technical",
    organizer: "CodeCraft Club",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=CodeCraft&backgroundColor=4f46e5",
    status: "Filling Fast",
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 14,
  },
  {
    id: 2,
    title: "Sanskriti Cultural Night & Dance Fest",
    date: "Nov 02, 2026",
    time: "06:00 PM - 10:00 PM",
    venue: "Open Air Stage",
    category: "Cultural",
    organizer: "Cultural Society",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=Cultural&backgroundColor=ec4899",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 120,
  },
  {
    id: 3,
    title: "AI & Machine Learning Hands-on Workshop",
    date: "Nov 08, 2026",
    time: "10:00 AM - 02:00 PM",
    venue: "CSE Block Lab 302",
    category: "Technical",
    organizer: "IEEE Student Branch",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=IEEE&backgroundColor=0d9488",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 25,
  },
  {
    id: 4,
    title: "Annual Inter-College Football Championship",
    date: "Nov 15, 2026",
    time: "08:00 AM - 05:00 PM",
    venue: "Campus Sports Complex",
    category: "Sports",
    organizer: "Sports Council",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=Sports&backgroundColor=f59e0b",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 8,
  },
  {
    id: 5,
    title: "Autonomous Robotics Race & Hardware Expo",
    date: "Nov 20, 2026",
    time: "11:00 AM - 04:00 PM",
    venue: "Seminar Hall A",
    category: "Technical",
    organizer: "Robotics Club",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=Robotics&backgroundColor=8b5cf6",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 40,
  },
  {
    id: 6,
    title: "E-Cell Founder Stories & Startup Pitch Slam",
    date: "Nov 28, 2026",
    time: "02:00 PM - 06:00 PM",
    venue: "Conference Room 101",
    category: "Entrepreneurship",
    organizer: "Entrepreneurship Cell",
    organizerLogo: "https://api.dicebear.com/9.x/initials/svg?seed=Ecell&backgroundColor=10b981",
    status: "Open",
    bannerUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80",
    seatsLeft: 18,
  },
];

export const FEATURED_CLUBS_DATA: FeaturedClubItem[] = [
  {
    id: 1,
    name: "CodeCraft Club",
    category: "Technical",
    memberCount: 420,
    tagline: "Competitive programming, web engineering, and open-source contributions.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=CodeCraft&backgroundColor=4f46e5",
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    eventCount: 12,
  },
  {
    id: 2,
    name: "Cultural Society",
    category: "Cultural",
    memberCount: 680,
    tagline: "Celebrating music, classical & contemporary dance, theater, and arts on campus.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Cultural&backgroundColor=ec4899",
    bannerUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80",
    eventCount: 18,
  },
  {
    id: 3,
    name: "IEEE Student Branch",
    category: "Technical",
    memberCount: 350,
    tagline: "Fostering technological innovation and excellence for the benefit of humanity.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=IEEE&backgroundColor=0d9488",
    bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    eventCount: 9,
  },
  {
    id: 4,
    name: "Robotics Club",
    category: "Technical",
    memberCount: 210,
    tagline: "Designing autonomous robots, drone technology, AI systems, and microcontrollers.",
    logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Robotics&backgroundColor=8b5cf6",
    bannerUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    eventCount: 7,
  },
];

export const MINI_CALENDAR_EVENTS: MiniCalendarEvent[] = [
  { day: 5, title: "Tech Quiz Qualifier", category: "Technical", time: "04:00 PM", eventId: 1 },
  { day: 12, title: "Design Sprint Workshop", category: "Arts", time: "02:00 PM", eventId: 3 },
  { day: 18, title: "Sanskriti Rehearsal", category: "Cultural", time: "05:00 PM", eventId: 2 },
  { day: 24, title: "HackSphere 2026 Hackathon", category: "Technical", time: "09:00 AM", eventId: 1 },
  { day: 28, title: "Startup Pitch Slam", category: "Entrepreneurship", time: "02:00 PM", eventId: 6 },
];

export const LATEST_NEWS_DATA: LatestNewsItem[] = [
  {
    id: 1,
    title: "Campus 360 2.0 Launched with Automated Certificate Verification",
    category: "Announcement",
    date: "Aug 02, 2026",
    excerpt: "Students can now instantly view, download, and verify QR-encoded achievement certificates directly from their dashboard.",
    author: "Administration",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "CodeCraft Wins Regional Inter-College Hackathon Championship",
    category: "Achievement",
    date: "Jul 28, 2026",
    excerpt: "Our campus developers brought home first prize among 45 participating universities after building an AI disaster response app.",
    author: "CodeCraft Club",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Fall Semester Club Recruitment Applications Now Open",
    category: "Recruitment",
    date: "Jul 20, 2026",
    excerpt: "Over 30 official student clubs are hiring lead developers, event managers, design leads, and public relations executives.",
    author: "Student Council",
    readTime: "2 min read",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  },
];

export const GALLERY_PHOTOS_DATA: GalleryPhotoItem[] = [
  {
    id: 1,
    title: "HackSphere 2026 Opening Keynote",
    category: "Hackathon",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
    caption: "Over 300 coders gathered in the Main Auditorium for the 36-hour hackathon kickoff.",
    date: "Spring 2026",
  },
  {
    id: 2,
    title: "Annual Cultural Night Performance",
    category: "Cultural Fest",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1000&auto=format&fit=crop&q=80",
    caption: "Live musical fusion performance at the Open Air Stage under starry skies.",
    date: "Winter 2025",
  },
  {
    id: 3,
    title: "Robotics Arena & Rover Challenge",
    category: "Hardware Expo",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80",
    caption: "Autonomous obstacle-avoiding rovers navigating the obstacle course.",
    date: "Spring 2026",
  },
  {
    id: 4,
    title: "Inter-College Football Finals",
    category: "Sports Meet",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&auto=format&fit=crop&q=80",
    caption: "Championship trophy presentation at the Sports Complex.",
    date: "Fall 2025",
  },
  {
    id: 5,
    title: "E-Cell Pitch Slam Winners",
    category: "Entrepreneurship",
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&auto=format&fit=crop&q=80",
    caption: "Top 3 student startup founders receiving seed funding grants.",
    date: "Spring 2026",
  },
  {
    id: 6,
    title: "Photography Club Field Workshop",
    category: "Arts & Media",
    imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1000&auto=format&fit=crop&q=80",
    caption: "Golden hour portrait lighting masterclass near the campus lake.",
    date: "Summer 2026",
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 1,
    quote: "Campus 360 transformed our student experience. Registering for hackathons, getting QR tickets, and collecting verified certificates used to be scattered across five different groups. Now it's effortless.",
    name: "Ananya Sharma",
    role: "Computer Science Student (3rd Year)",
    department: "CSE Department",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ananya",
    rating: 5,
  },
  {
    id: 2,
    quote: "As a club coordinator, managing event venue approvals, QR attendance scans, and volunteer recruitment pipelines used to take days. Campus 360 saved us dozens of hours every month.",
    name: "Rohan Mehta",
    role: "President, CodeCraft Club",
    department: "Electronics Department",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rohan",
    rating: 5,
  },
  {
    id: 3,
    quote: "The automated certificate verification system is brilliant. Faculty advisors can instantly audit student participation records without manual paperwork.",
    name: "Prof. Vikram Nair",
    role: "Faculty Advisor, IEEE Student Branch",
    department: "Department of Engineering",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram",
    rating: 5,
  },
];
