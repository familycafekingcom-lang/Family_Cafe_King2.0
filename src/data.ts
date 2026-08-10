import type { LucideIcon } from "lucide-react";
import {
  Coffee,
  Leaf,
  GlassWater,
  Milk,
  ShieldCheck,
  TrendingUp,
  HandCoins,
  Users,
  Sparkles,
  Award,
  Rocket,
  Headphones,
  BookOpen,
  Store,
} from "lucide-react";

export const CONTACT_PHONE = "+91 9341127991";
export const CONTACT_PHONE_2 = "+91 9311619612";
export const CONTACT_EMAIL = "familycafeking.com@gmail.com";
export const WHATSAPP_NUMBER = "919341127991";
export const LOCATION = "SA 7/140 PS, Benipur Shivpur, Sarnath, Varanasi, 221007";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/familycafeking",
  facebook: "https://www.facebook.com/profile.php?id=61591703498565",
  linkedin: "https://www.linkedin.com/company/133456642dashboard/",
  whatsapp: "https://wa.me/+919341127991",
};

export const waLink = (brand: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Family Cafe King team, I'm interested in the ${brand} franchise. Please share more details.`
  )}`;

export interface StarterKitItem {
  title: string;
  desc: string;
}

export interface MenuSection {
  section: string;
  items: string[];
}

export interface BrandData {
  key: string;
  id: string;
  name: string;
  tagline: string;
  tag: string;
  short: string;
  long: string;
  icon: LucideIcon;
  logo: string;
  foodImage?: string;
  accentGradient: string;
  chipBg: string;
  chipText: string;
  emoji: string;
  priceDisplay: string;
  investment: {
    total: string;
    starterKit: string;
    brandFee: string;
    gstNote: string;
  };
  space: string;
  location: string;
  stats: { value: string; label: string }[];
  starterKit: StarterKitItem[];
  menuHeader: string;
  menu: MenuSection[];
}

export const BRANDS: BrandData[] = [
  {
    key: "fck",
    id: "family-cafe-king",
    name: "Family Cafe King",
    tagline: "India's Premier Multi-Brand Food Franchise Network",
    tag: "Multi-Brand Flagship · Complete Food Outlet",
    short:
      "All-in-one flagship café concept bringing together Chai, Paan, Shakes, Lassi, and quick service food under one roof.",
    long:
      "Family Cafe King is the flagship master franchise concept. Partnering with Family Cafe King gives you full multi-brand rights to operate high-demand chai, paan, shake, lassi, and quick-serve food modules with massive footfall and high daily margins.",
    icon: Store,
    logo: "https://customer-assets-rejwkqb3.emergentagent.net/job_family-cafe-king/artifacts/2q6zxze6_Gemini_Generated_Image_mxlilsmxlilsmxli.png",
    foodImage: "/images/family-cafe-king-food.png",
    accentGradient: "from-maroon-700 via-rose-800 to-amber-600",
    chipBg: "bg-rose-100",
    chipText: "text-rose-950",
    emoji: "👑",
    priceDisplay: "₹5 - 15 Lakhs + GST",
    investment: {
      total: "₹5,00,000 - ₹15,00,000",
      starterKit: "₹4,00,000",
      brandFee: "₹1,00,000",
      gstNote: "+ 18% GST Applicable",
    },
    space: "150 to 500 sq. ft.",
    location: "High-street retail, mall food court, or prime highway spot",
    stats: [
      { value: "350+", label: "Outlets Nationwide" },
      { value: "40+", label: "Cities Reached" },
      { value: "5.0", label: "Brand Rating" },
      { value: "10+", label: "Years Experience" },
    ],
    starterKit: [
      {
        title: "All-Brand Master Setup",
        desc: "Complete equipment, POS terminal, digital branding, uniform, and launch marketing kit.",
      },
    ],
    menuHeader: "Complete Multi-Brand Culinary Experience",
    menu: [
      {
        section: "Flagship Menu",
        items: ["Chai & Coffee Bar", "Fusion Paan Collection", "Thick Shakes & Sodas", "Matka Malai Lassi", "Snacks & Burgers"],
      },
    ],
  },
  {
    key: "chai",
    id: "chai-cafe-king",
    name: "Chai Cafe King",
    tagline: "Brewing Happiness, One Cup at a Time",
    tag: "Restaurant Franchise · Premium Tea Café",
    short:
      "Premium tea café offering handcrafted chai, coffee, snacks, and café-style experiences in a modern environment.",
    long:
      "Chai Cafe King is a premium tea café concept offering handcrafted chai, coffee, snacks and café-style experiences in a modern environment. Backed by 10+ years of expertise, we bring authentic Indian chai to every neighbourhood.",
    icon: Coffee,
    logo: "https://customer-assets-m6fa6gv7.emergentagent.net/job_5c36eac6-4afa-404a-9f8a-3a2a73a148f4/artifacts/hhfcca1r_Chai%20Cafe%20King%20Pdf%20File-1.webp",
    foodImage: "/images/chai-cafe-king-food.png",
    accentGradient: "from-amber-500 via-orange-600 to-rose-700",
    chipBg: "bg-amber-100",
    chipText: "text-amber-950",
    emoji: "☕",
    priceDisplay: "₹3 Lakhs + 18% GST",
    investment: {
      total: "₹3,00,000",
      starterKit: "₹2,50,000",
      brandFee: "₹50,000",
      gstNote: "+ 18% GST Applicable",
    },
    space: "150 to 200 sq. ft.",
    location: "Prime market or high-footfall location",
    stats: [
      { value: "5000+", label: "Happy Customers" },
      { value: "5.0", label: "Google Rating" },
      { value: "10+", label: "Years of Experience" },
    ],
    starterKit: [
      {
        title: "Business Documents",
        desc: "Standard operating procedures, recipes, training manuals, and operational guidelines.",
      },
      {
        title: "Digital Equipment",
        desc: "Menu screens, digital branding assets, promotional creatives, and display materials.",
      },
      {
        title: "Store Equipment",
        desc: "Operational tools, serving accessories, café essentials, and launch materials.",
      },
      {
        title: "Raw Materials",
        desc: "Premium tea, coffee, café ingredients, syrups, seasonings, and consumables.",
      },
      {
        title: "Brand Kit",
        desc: "Official uniforms, T-shirts, aprons, packaging materials, branded cups, boxes, and carry bags.",
      },
    ],
    menuHeader: "Every Sip, Every Bite, Made with Love",
    menu: [
      {
        section: "Signature Chai",
        items: [
          "Masala Chai",
          "Kulhad Chai",
          "Cutting Chai",
          "Adrak Chai",
          "Elaichi Chai",
          "Kesar Chai",
          "Tandoori Chai",
        ],
      },
      {
        section: "Coffee Bar",
        items: ["Cold Coffee", "Cappuccino", "Café Latte", "Hot Chocolate", "Mocha"],
      },
      {
        section: "Snacks & Bites",
        items: [
          "Maggi Masala",
          "Grilled Sandwich",
          "Bun Maska",
          "Samosa",
          "Khari + Nankhatai",
        ],
      },
    ],
  },
  {
    key: "paan",
    id: "paan-king",
    name: "Paan King",
    tagline: "Taste Real Flavor",
    tag: "Paan Franchise · Retail Chain",
    short:
      "A contemporary paan destination serving traditional and fusion paan varieties along with desserts and specialty beverages.",
    long:
      "Paan King — Retail chain of Real taste of Paan. We are the No. 1 retail chain of real taste of paan. We started with the aim to provide fresh, tasty, delicious, hygienic, healthy, and safest products to customers who are looking for something better than others in the market. Welcome to the world of Paan King.",
    icon: Leaf,
    logo: "https://customer-assets-m6fa6gv7.emergentagent.net/job_5c36eac6-4afa-404a-9f8a-3a2a73a148f4/artifacts/8wiq3v7w_PNG%20LOGO%20PAAN.png",
    foodImage: "/images/paan-king-food.png",
    accentGradient: "from-emerald-500 via-teal-600 to-emerald-800",
    chipBg: "bg-emerald-100",
    chipText: "text-emerald-950",
    emoji: "🌿",
    priceDisplay: "₹2 Lakhs + 18% GST",
    investment: {
      total: "₹2,00,000",
      starterKit: "₹1,50,000",
      brandFee: "₹50,000",
      gstNote: "+ 18% GST Applicable",
    },
    space: "80 to 100 sq. ft.",
    location: "Prime market or high-footfall location",
    stats: [
      { value: "5000+", label: "Happy Customers" },
      { value: "5.0", label: "Google Rating" },
      { value: "100+", label: "Flavorful Delicacies" },
      { value: "10+", label: "Years of Experience" },
    ],
    starterKit: [
      {
        title: "Raw Materials",
        desc: "Premium ingredients including fresh betel leaves, gulkand, dry fruits, flavored fillings, and essential consumables.",
      },
      {
        title: "Brand Kit",
        desc: "Complete branding kit with uniforms, packaging, takeaway boxes, and promotional materials.",
      },
      {
        title: "Business Documents",
        desc: "Standard operating procedures, recipes, training manuals, and operational guidelines.",
      },
      {
        title: "Store Equipment",
        desc: "Essential paan tools, including Fancy Stand, Paan Daan, Choco Stand, Foil Paper, Chuna Bowl & Lota.",
      },
    ],
    menuHeader: "Taste the Real Flavour",
    menu: [
      {
        section: "Classic Paan",
        items: ["Meetha Paan", "Saada Paan", "Calcutta Paan", "Banarasi Paan"],
      },
      {
        section: "Premium Paan",
        items: [
          "Rajwadi Silver Paan",
          "Chocolate Paan",
          "Fire Paan",
          "Ice Paan",
          "Dry Fruit Paan",
        ],
      },
      {
        section: "Fusion Paan",
        items: [
          "Strawberry Paan",
          "Pineapple Paan",
          "Butterscotch Paan",
          "Rasmalai Paan",
        ],
      },
      {
        section: "Mukhwas & Extras",
        items: ["Assorted Mukhwas", "Gulkand Special", "Silver-wrapped Paan"],
      },
    ],
  },
  {
    key: "shake",
    id: "shake-soda-king",
    name: "Shake & Soda King",
    tagline: "Cool Sips, Fresh Flavours",
    tag: "Shake & Soda Franchise · Retail Chain",
    short:
      "Refreshing milkshakes, mocktails, sodas, coolers, and beverages designed for every season.",
    long:
      "Welcome to the world of Shake & Soda King. Shake & Soda King — Retail chain of Real taste of Shakes. We are the No. 1 retail chain of real taste of shakes. We started with the aim to provide fresh, tasty, delicious, hygienic, healthy, and safest products to customers who are looking for something better than others in the market.",
    icon: GlassWater,
    logo: "https://customer-assets-rejwkqb3.emergentagent.net/job_family-cafe-king/artifacts/viqghbk7_SHAKE%20AND%20SODA%20LOGO.png",
    foodImage: "/images/shake-soda-king-food.png",
    accentGradient: "from-sky-500 via-indigo-600 to-fuchsia-700",
    chipBg: "bg-sky-100",
    chipText: "text-sky-950",
    emoji: "🥤",
    priceDisplay: "₹1 Lakh + 18% GST",
    investment: {
      total: "₹1,00,000",
      starterKit: "₹50,000",
      brandFee: "₹50,000",
      gstNote: "+ 18% GST Applicable",
    },
    space: "100 to 150 sq. ft.",
    location: "Prime market or high-footfall location",
    stats: [
      { value: "5000+", label: "Happy Customers" },
      { value: "5.0", label: "Google Rating" },
      { value: "100+", label: "Flavorful Delicacies" },
      { value: "3+", label: "Years of Experience" },
    ],
    starterKit: [
      {
        title: "Raw Materials",
        desc: "Premium raw materials, including shake powder, syrups, fruit flavors, coffee premix & Oreo crumbs.",
      },
      {
        title: "Brand Kit",
        desc: "Complete branding kit with uniforms, packaging, takeaway and promotional materials.",
      },
      {
        title: "Business Documents",
        desc: "Standard operating procedures, recipes, training manuals, and operational guidelines.",
      },
      {
        title: "Store Equipment",
        desc: "Essential shake & soda tools, including shaker, syrups & accessories.",
      },
    ],
    menuHeader: "Cool Sips, Fresh Flavours",
    menu: [
      {
        section: "Shakes",
        items: [
          "Cold Coffee",
          "Kesar Badam",
          "Strawberry Shake",
          "Butterscotch Shake",
          "Oreo Shake Crunchy",
          "Nutty Chocolate",
          "Rasila Mango",
        ],
      },
      {
        section: "Sodas & Coolers",
        items: [
          "Kala Khatta Soda",
          "Blue Lagoon",
          "Masala Lemonade",
          "Jeera Soda",
          "Virgin Mojito",
        ],
      },
      {
        section: "Customer Favourites",
        items: [
          "Nutty Chocolate Shake",
          "Kesar Badam Shake",
          "Oreo Shake Crunchy",
        ],
      },
    ],
  },
  {
    key: "lassi",
    id: "lassi-king",
    name: "Lassi King",
    tagline: "Pure, Rich & Authentic Lassi",
    tag: "Lassi Franchise · Traditional Beverage Chain",
    short:
      "Authentic Punjabi malai lassi, fruit lassis, rabri lassi and traditional thick yogurt beverages.",
    long:
      "Lassi King — Experience authentic Punjabi lassi crafted from thick fresh curd, topped with rich malai, dry fruits, and natural fruit blends. Refreshment loved by all ages.",
    icon: Milk,
    logo: "https://customer-assets-m6fa6gv7.emergentagent.net/job_5c36eac6-4afa-404a-9f8a-3a2a73a148f4/artifacts/t8gmidb5_FCK%20LOGO.png",
    foodImage: "/images/lassi-king-food.png",
    accentGradient: "from-yellow-400 via-amber-500 to-orange-700",
    chipBg: "bg-yellow-100",
    chipText: "text-yellow-950",
    emoji: "🥛",
    priceDisplay: "₹1 Lakh + 18% GST",
    investment: {
      total: "₹1,00,000",
      starterKit: "₹50,000",
      brandFee: "₹50,000",
      gstNote: "+ 18% GST Applicable",
    },
    space: "80 to 100 sq. ft.",
    location: "Prime market or high-footfall location",
    stats: [
      { value: "5000+", label: "Happy Customers" },
      { value: "5.0", label: "Google Rating" },
      { value: "25+", label: "Lassi Varieties" },
      { value: "10+", label: "Years of Experience" },
    ],
    starterKit: [
      {
        title: "Raw Materials",
        desc: "Pure curd premix, fruit pulps, dry fruits, rabri, rose syrups, and essential ingredients.",
      },
      {
        title: "Brand Kit",
        desc: "Official uniforms, takeaway earthen kulhads, branded cups, and promotional materials.",
      },
      {
        title: "Business Documents",
        desc: "Standard operating procedures, recipes, training manuals, and operational guidelines.",
      },
      {
        title: "Store Equipment",
        desc: "Heavy-duty lassi churners, cooling units, kulhad stands, and serving counter accessories.",
      },
    ],
    menuHeader: "Pure, Thick & Truly Authentic",
    menu: [
      {
        section: "Classic Lassi",
        items: [
          "Malai Lassi",
          "Sweet Lassi",
          "Salted Lassi",
          "Rose Lassi",
          "Kesar Lassi",
        ],
      },
      {
        section: "Fruit & Rabri Lassi",
        items: [
          "Mango Lassi",
          "Strawberry Lassi",
          "Rabri Malai Lassi",
          "Chocolate Lassi",
        ],
      },
      {
        section: "Special Delights",
        items: [
          "Dry Fruit Royal Lassi",
          "Matka Kulfi Lassi",
          "Paan Lassi",
        ],
      },
    ],
  },
];

export const FRANCHISEE_RESPONSIBILITIES = [
  "Managing daily store operations, staff, and customer service.",
  "Maintaining brand hygiene, quality standards, and recipe compliance.",
  "Managing local inventory replenishment through authorized supply channels.",
  "Local marketing execution and customer relationship management.",
];

export interface Feature {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export const FEATURES: Feature[] = [
  {
    title: "Proven Business Model",
    desc: "Battle-tested SOPs, unit economics & recipes refined across 350+ outlets in our growing pan-India network.",
    icon: TrendingUp,
  },
  {
    title: "Low Investment, High Margins",
    desc: "Start from just ₹1 Lakh + GST. Compact footprint, lean team and strong daily cash flow potential.",
    icon: HandCoins,
  },
  {
    title: "End-to-End Setup",
    desc: "Location scouting, interior design, equipment sourcing, staff hiring — we handle every detail.",
    icon: Rocket,
  },
  {
    title: "Training & Certification",
    desc: "10-day hands-on training at HQ or on-site covering recipes, operations, hygiene, POS & customer service.",
    icon: BookOpen,
  },
  {
    title: "Marketing That Works",
    desc: "Launch campaigns, hyper-local ads, influencer tie-ups & festive kits — designed for Indian shoppers.",
    icon: Sparkles,
  },
  {
    title: "24×7 Franchise Support",
    desc: "Dedicated relationship manager, WhatsApp helpdesk & quarterly business reviews for every partner.",
    icon: Headphones,
  },
];

export interface Benefit {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export const BENEFITS: Benefit[] = [
  {
    title: "FSSAI + GST Compliant",
    desc: "All brands are fully registered and audited — start selling from day one with zero legal friction.",
    icon: ShieldCheck,
  },
  {
    title: "5-Star Rated by Customers",
    desc: "Consistent 5.0★ ratings across Google, Zomato & Swiggy driven by taste, hygiene & service.",
    icon: Award,
  },
  {
    title: "Multi-Brand Flexibility",
    desc: "Run one brand or combine 2–3 under a single roof to maximize footfall and shared rent.",
    icon: Store,
  },
  {
    title: "Pan-India Community",
    desc: "Join 350+ franchise partners across 40+ Indian cities. Learn together. Grow together.",
    icon: Users,
  },
];

export interface Testimonial {
  name: string;
  city: string;
  brand: string;
  quote: string;
  rating: number;
  avatar: string;
  gradient: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rohan Malhotra",
    city: "Ludhiana, Punjab",
    brand: "Chai Cafe King",
    quote:
      "The onboarding team held our hand through every step — from lease negotiation to launch day. We experienced strong sales right from month one. The recipes are loved by our regulars.",
    rating: 5,
    avatar: "RM",
    gradient: "from-amber-500 to-rose-600",
  },
  {
    name: "Priya Iyer",
    city: "Coimbatore, Tamil Nadu",
    brand: "Lassi King",
    quote:
      "I was a homemaker looking to start something of my own. Family Cafe King made it possible — low investment, complete training, and my kiosk did ₹1.4L in the first month itself.",
    rating: 5,
    avatar: "PI",
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    name: "Aditya Verma",
    city: "Lucknow, Uttar Pradesh",
    brand: "Paan King",
    quote:
      "The brand recall is fantastic. Our high-street kiosk sees a queue every evening. Centralised supply keeps our quality consistent and margins healthy.",
    rating: 5,
    avatar: "AV",
    gradient: "from-emerald-500 to-teal-700",
  },
  {
    name: "Meera Shah",
    city: "Ahmedabad, Gujarat",
    brand: "Shake & Soda King",
    quote:
      "Summer sales are unreal! The marketing team runs Instagram reels for us every week and gives us festive posters. Feels like having a full agency supporting us.",
    rating: 5,
    avatar: "MS",
    gradient: "from-sky-500 to-fuchsia-700",
  },
  {
    name: "Karthik Nair",
    city: "Kochi, Kerala",
    brand: "Chai Cafe King",
    quote:
      "I compared 5 different franchises before choosing FCK. The transparency on numbers, the support ecosystem and the food quality are simply unmatched in this segment.",
    rating: 5,
    avatar: "KN",
    gradient: "from-orange-500 to-red-700",
  },
  {
    name: "Sneha Kulkarni",
    city: "Pune, Maharashtra",
    brand: "Multi-Brand Outlet",
    quote:
      "We took Chai + Shake under one roof. Cross-selling is incredible — morning is chai, evenings are shakes. Two revenue streams, one rent, one team. Genius model.",
    rating: 5,
    avatar: "SK",
    gradient: "from-fuchsia-500 to-indigo-700",
  },
];

export interface Plan {
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  ribbon?: string;
}

export const PLANS: Plan[] = [
  {
    name: "Single Brand Kiosk",
    tagline: "Ideal for high-footfall markets & corners",
    price: "₹1L - ₹3L",
    priceNote: "+ 18% GST one-time fee",
    features: [
      "80 – 150 sq. ft compact setup",
      "Choice of Chai, Paan, Shake or Lassi",
      "Full Starter Kit & Raw Materials included",
      "10-day operational training",
      "Launch branding & digital kit",
      "Lifetime support included",
    ],
    cta: "Start Kiosk",
  },
  {
    name: "Standard Café",
    tagline: "India's most popular franchise format",
    price: "₹3.0 Lakhs",
    priceNote: "+ 18% GST (Chai Cafe King)",
    features: [
      "150 – 200 sq. ft café-style setup",
      "Complete Chai Cafe King branding & POS",
      "Premium equipment & store accessories",
      "10-day HQ + on-site training & certification",
      "Grand-opening marketing event support",
      "Dedicated relationship manager",
      "Instagram & WhatsApp marketing kits",
    ],
    cta: "Choose Standard Café",
    highlighted: true,
    ribbon: "Most Popular",
  },
  {
    name: "Multi-Brand Flagship",
    tagline: "Maximise revenue per sq.ft with 2-3 brands under 1 roof",
    price: "₹7.0 Lakhs",
    priceNote: "+ 18% GST one-time fee",
    features: [
      "200 – 400 sq. ft multi-brand flagship outlet",
      "Combine Chai + Paan + Shake or Lassi under 1 roof",
      "Full interior design guidance & store layout",
      "Comprehensive staff & manager training at HQ + on-site",
      "Regional PR & local launch marketing push",
      "Shared kitchen efficiency & maximum daily profitability",
      "Priority city territory reservation & protection",
    ],
    cta: "Go Multi-Brand",
  },
];

export interface FAQItem {
  q: string;
  a: string;
}

export const FAQS: FAQItem[] = [
  {
    q: "How much investment is required to open a Family Cafe King franchise?",
    a: "Franchise brand fees are ₹1,00,000 + 18% GST for Shake & Soda King and Lassi King, ₹2,00,000 + 18% GST for Paan King, ₹3,00,000 + 18% GST for Chai Cafe King, and ₹7,00,000 + 18% GST for Multi-Brand Flagship Outlets. Each package includes a comprehensive Starter Kit with raw materials, equipment, branding kit, and full operational SOPs.",
  },
  {
    q: "What are the space requirements for each brand?",
    a: "Chai Cafe King requires 150 to 200 sq. ft. Paan King and Lassi King require 80 to 100 sq. ft. Shake & Soda King requires 100 to 150 sq. ft. Multi-brand outlets typically require 200 to 400 sq. ft.",
  },
  {
    q: "Do I need prior experience in the food industry?",
    a: "No prior F&B experience is needed. Over 65% of our 350+ franchise partners are first-time business owners. We provide full training on recipes, SOPs, store operations, hygiene standards, and customer service.",
  },
  {
    q: "How long does it take to open an outlet?",
    a: "Once location agreement is signed, setup typically takes 30 to 45 days including interior work, equipment setup, staff training, and soft launch.",
  },
  {
    q: "Are there 350+ active franchise outlets across India?",
    a: "Yes! Family Cafe King group has expanded across 350+ franchise outlets in over 40 Indian cities including metro hubs and Tier-2/3 towns.",
  },
  {
    q: "How do I get started?",
    a: "Click 'View Details' on any brand or fill out the enquiry form. Our team will contact you on WhatsApp or call (+91 9341127991) to share the complete franchise deck.",
  },
];

export const TRUST_LOGOS = [
  "FSSAI Certified",
  "GST Registered",
  "MSME Approved",
  "Startup India",
  "ISO 22000",
  "Make in India",
  "Zomato Partner",
  "Swiggy Partner",
];

export const STATS = [
  { value: "350+", label: "Franchises All Over India" },
  { value: "5,000+", label: "Happy Customers Daily" },
  { value: "40+", label: "Indian Cities Covered" },
  { value: "5.0★", label: "Google Rating" },
];

export const CITIES = [
  "Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Varanasi",
  "Ahmedabad", "Kolkata", "Jaipur", "Lucknow", "Chandigarh", "Kochi",
  "Indore", "Nagpur", "Bhopal", "Surat", "Ludhiana", "Coimbatore",
];


