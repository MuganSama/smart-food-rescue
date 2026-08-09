// Initial mock dataset for Smart Food Rescue
const DEMO_USERS = [
  {
    id: "USER-101",
    name: "Elena Vance",
    organization: "Green Olive Bistro",
    role: "Donor",
    roleTitle: "Restaurant Donor",
    email: "elena@greenolivebistro.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    phone: "+1 (555) 345-6789"
  },
  {
    id: "USER-102",
    name: "Marcus Brody",
    organization: "Hope Community Kitchen",
    role: "NGO",
    roleTitle: "NGO Representative",
    email: "marcus@hopekitchen.org",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: "+1 (555) 901-2345"
  },
  {
    id: "USER-103",
    name: "Sarah Jenkins",
    organization: "Community Citizen Spotter",
    role: "Spotter",
    roleTitle: "Community Need Reporter",
    email: "sarah.j@citizennet.org",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    phone: "+1 (555) 123-9876"
  }
];

const INITIAL_FOOD_NEEDS = [
  {
    id: "NEED-501",
    title: "Downtown Transit Station Evening Gathering",
    location: "4th Street & Main Avenue Transit Plaza",
    peopleCount: 45,
    urgency: "High", // High, Medium, Emergency
    category: "Street Community",
    reporterName: "Sarah Jenkins",
    reporterContact: "+1 (555) 123-9876",
    reportedTime: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: "Active Need", // Active Need, Dispatched, Resolved
    servicedBy: null,
    notes: "Group of approximately 45 unhoused community members gathered near the north transit pavilion. Hot meals or sandwich packs urgently needed before nightfall."
  },
  {
    id: "NEED-502",
    title: "Riverfront Temporary Shelter Camp",
    location: "Pier 12 Park Embankment",
    peopleCount: 30,
    urgency: "Emergency",
    category: "Temporary Shelter",
    reporterName: "David Kim (Community Volunteer)",
    reporterContact: "+1 (555) 432-1098",
    reportedTime: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    status: "Active Need",
    servicedBy: null,
    notes: "Families displaced by recent water pipe leak in local apartment complex. Need fresh produce, water, and warm packaged meals."
  },
  {
    id: "NEED-503",
    title: "Eastside Youth Evening Learning Center",
    location: "88 Eastside Community Center Drive",
    peopleCount: 25,
    urgency: "Medium",
    category: "Community Center",
    reporterName: "Lisa Ray",
    reporterContact: "+1 (555) 876-5432",
    reportedTime: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    status: "Dispatched",
    servicedBy: "City Food Bank Network",
    notes: "After-school youth program needing fruit snacks and bakery items for 25 kids."
  }
];

const INITIAL_DONATIONS = [
  {
    id: "DON-1001",
    title: "Fresh Baked Artisan Bread & Croissants",
    category: "Bakery",
    donorName: "Artisan Bakery Co.",
    donorType: "Bakery",
    quantity: "45 items",
    quantityNumber: 45,
    unit: "servings",
    weightKg: 12,
    expiryHours: 4,
    expiryTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    address: "742 Evergreen Terrace, Downtown",
    distance: "1.2 km",
    contactPerson: "Marco Rossi",
    contactPhone: "+1 (555) 234-5678",
    storage: "Room Temp",
    dietary: ["Vegetarian"],
    status: "Available",
    claimedBy: null,
    claimTime: null,
    pickupPin: null,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    notes: "Freshly baked this morning. Packaged in food-grade boxes ready for distribution."
  },
  {
    id: "DON-1002",
    title: "Gourmet Pasta & Organic Caesar Salads",
    category: "Prepared Meals",
    donorName: "Green Olive Bistro",
    donorType: "Restaurant",
    quantity: "60 meals",
    quantityNumber: 60,
    unit: "meals",
    weightKg: 25,
    expiryHours: 2,
    expiryTime: new Date(Date.now() + 2.5 * 3600 * 1000).toISOString(),
    address: "128 Olive Garden Way, Midtown",
    distance: "2.5 km",
    contactPerson: "Elena Vance",
    contactPhone: "+1 (555) 345-6789",
    storage: "Refrigerated",
    dietary: ["Vegetarian", "Nut-Free"],
    status: "Available",
    claimedBy: null,
    claimTime: null,
    pickupPin: null,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    notes: "Individually portioned containers. Packed hot in insulated thermal bags."
  },
  {
    id: "DON-1003",
    title: "Assorted Buffet Trays (Grilled Chicken & Rice)",
    category: "Prepared Meals",
    donorName: "Grand Plaza Hotel",
    donorType: "Hotel & Conference",
    quantity: "80 servings",
    quantityNumber: 80,
    unit: "servings",
    weightKg: 35,
    expiryHours: 5,
    expiryTime: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    address: "500 Grand Boulevard, Financial District",
    distance: "3.8 km",
    contactPerson: "Chef Arthur Dent",
    contactPhone: "+1 (555) 456-7890",
    storage: "Heated / Warm",
    dietary: ["Halal", "Gluten-Free", "Nut-Free"],
    status: "Available",
    claimedBy: null,
    claimTime: null,
    pickupPin: null,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    notes: "Untouched surplus from corporate luncheon. Requires thermal food transport containers."
  },
  {
    id: "DON-1004",
    title: "Organic Fresh Produce Box (Apples, Berries, Greens)",
    category: "Fresh Produce",
    donorName: "Fresh Basket Supermarket",
    donorType: "Grocery Store",
    quantity: "120 kg",
    quantityNumber: 240,
    unit: "servings",
    weightKg: 120,
    expiryHours: 12,
    expiryTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    address: "900 Market Street, Westside",
    distance: "4.1 km",
    contactPerson: "Sarah Connor",
    contactPhone: "+1 (555) 567-8901",
    storage: "Refrigerated",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Nut-Free", "Halal"],
    status: "Available",
    claimedBy: null,
    claimTime: null,
    pickupPin: null,
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
    notes: "Slightly imperfect fruits & crisp fresh vegetables. Excellent condition for cooking or soup kitchens."
  },
  {
    id: "DON-1005",
    title: "Fresh Milk, Yogurts & Cheese Assortment",
    category: "Dairy & Eggs",
    donorName: "Sunrise Dairy & Grocery",
    donorType: "Store",
    quantity: "35 units",
    quantityNumber: 35,
    unit: "servings",
    weightKg: 18,
    expiryHours: 8,
    expiryTime: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    address: "410 Sunrise Avenue, Northside",
    distance: "3.1 km",
    contactPerson: "David Miller",
    contactPhone: "+1 (555) 678-9012",
    storage: "Refrigerated",
    dietary: ["Vegetarian", "Gluten-Free"],
    status: "Claimed",
    claimedBy: "City Food Bank Network",
    claimTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    pickupPin: "8492",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
    notes: "All items sealed and kept continuously below 4°C."
  }
];

const INITIAL_NGOS = [
  { id: "NGO-1", name: "Hope Community Kitchen", distance: "1.4 km", contact: "+1 (555) 901-2345" },
  { id: "NGO-2", name: "City Food Bank Network", distance: "2.8 km", contact: "+1 (555) 890-1234" },
  { id: "NGO-3", name: "Haven Youth Shelter", distance: "3.5 km", contact: "+1 (555) 789-0123" },
  { id: "NGO-4", name: "Compassion Care Center", distance: "4.2 km", contact: "+1 (555) 678-9012" }
];

const IMPACT_STATS = {
  totalMealsRescued: 14850,
  foodSavedKg: 7425,
  co2PreventedKg: 18560,
  activeDonors: 94,
  activeNGOs: 48,
  activeNeedSpots: 2
};
