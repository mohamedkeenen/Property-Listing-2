export interface PropertyListing {
  id: string;
  reference: string;
  title: string;
  location: string;
  community: string;
  subCommunity: string;
  building: string;
  unitNo: string;
  type: "Apartment" | "Villa" | "Townhouse" | "Penthouse" | "Office" | "Shop" | "Warehouse" | "Land";
  category: "Residential" | "Commercial";
  purpose: "Rent" | "Sale";
  status: "Live" | "Draft" | "Pending" | "Archived" | "Pocket";
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  image: string;
  images: string[];
  listingAgent: string;
  listingAgentAvatar: string;
  owner: string;
  ownerAvatar: string;
  ownerPhone: string;
  portals: { pf: boolean; bayut: boolean; website: boolean };
  updatedAt: string;
  description: string;
  descriptionAr: string;
  amenities: string[];
  permitNumber: string;
  availableFrom: string;
  parking: number;
  furnished: "Furnished" | "Unfurnished" | "Semi-Furnished";
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: "WhatsApp" | "Email" | "Call";
  property: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  date: string;
  avatar: string;
}

const images = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
];

const allImages = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
];

const agentAvatars: Record<string, string> = {
  "Ahmed Hassan": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "Sara Khan": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "Omar Farouk": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
};

const getImages = (idx: number) => {
  const start = idx % allImages.length;
  return [allImages[start], allImages[(start + 1) % allImages.length], allImages[(start + 2) % allImages.length], allImages[(start + 3) % allImages.length], allImages[(start + 4) % allImages.length]];
};

export const mockListings: PropertyListing[] = [
  {
    id: "1", reference: "KE-1001", title: "Luxury 2BR Apartment in Downtown", location: "Dubai", community: "Downtown Dubai", subCommunity: "Burj Khalifa District", building: "Burj Vista", unitNo: "1204", type: "Apartment", category: "Residential", purpose: "Sale", status: "Live", price: 2500000, bedrooms: 2, bathrooms: 3, size: 1450, image: images[0], images: getImages(0), listingAgent: "Ahmed Hassan", listingAgentAvatar: agentAvatars["Ahmed Hassan"], owner: "Mohammed Al Rashid", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971501234567", portals: { pf: true, bayut: true, website: true }, updatedAt: "2026-03-07", description: "Stunning 2-bedroom apartment with breathtaking views of Burj Khalifa and Dubai Fountain. Features premium finishes, spacious living areas, and world-class amenities.", descriptionAr: "شقة فاخرة مكونة من غرفتين نوم مع إطلالات خلابة على برج خليفة ونافورة دبي. تتميز بتشطيبات فاخرة ومساحات معيشة واسعة ومرافق عالمية المستوى.", amenities: ["Pool", "Gym", "Parking", "Concierge", "Balcony"], permitNumber: "RERA-12345", availableFrom: "2026-04-01", parking: 1, furnished: "Furnished"
  },
  {
    id: "2", reference: "KE-1002", title: "Spacious 3BR Villa in Arabian Ranches", location: "Dubai", community: "Arabian Ranches", subCommunity: "Saheel", building: "", unitNo: "45", type: "Villa", category: "Residential", purpose: "Rent", status: "Live", price: 180000, bedrooms: 3, bathrooms: 4, size: 3200, image: images[1], images: getImages(1), listingAgent: "Sara Khan", listingAgentAvatar: agentAvatars["Sara Khan"], owner: "Fatima Al Maktoum", ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971502345678", portals: { pf: true, bayut: true, website: false }, updatedAt: "2026-03-06", description: "Beautiful family villa with private garden and pool in a serene community.", descriptionAr: "فيلا عائلية جميلة مع حديقة خاصة ومسبح في مجتمع هادئ.", amenities: ["Private Pool", "Garden", "Maid's Room", "Parking", "BBQ Area"], permitNumber: "RERA-12346", availableFrom: "2026-03-15", parking: 2, furnished: "Unfurnished"
  },
  {
    id: "3", reference: "KE-1003", title: "Modern Studio in Business Bay", location: "Dubai", community: "Business Bay", subCommunity: "Executive Towers", building: "Executive Tower B", unitNo: "502", type: "Apartment", category: "Residential", purpose: "Rent", status: "Pending", price: 55000, bedrooms: 0, bathrooms: 1, size: 480, image: images[2], images: getImages(2), listingAgent: "Ahmed Hassan", listingAgentAvatar: agentAvatars["Ahmed Hassan"], owner: "Ali Reza", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971503456789", portals: { pf: true, bayut: false, website: true }, updatedAt: "2026-03-05", description: "Compact modern studio perfect for professionals, close to metro.", descriptionAr: "استوديو عصري مدمج مثالي للمحترفين، قريب من المترو.", amenities: ["Gym", "Pool", "Parking"], permitNumber: "RERA-12347", availableFrom: "2026-04-01", parking: 1, furnished: "Furnished"
  },
  {
    id: "4", reference: "KE-1004", title: "Premium Office Space in DIFC", location: "Dubai", community: "DIFC", subCommunity: "Gate District", building: "Gate Building", unitNo: "1501", type: "Office", category: "Commercial", purpose: "Rent", status: "Live", price: 350000, bedrooms: 0, bathrooms: 2, size: 2100, image: images[3], images: getImages(3), listingAgent: "Omar Farouk", listingAgentAvatar: agentAvatars["Omar Farouk"], owner: "DIFC Investments LLC", ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971504567890", portals: { pf: false, bayut: true, website: true }, updatedAt: "2026-03-04", description: "Grade A office space in the heart of Dubai's financial district.", descriptionAr: "مساحة مكتبية من الدرجة الأولى في قلب المنطقة المالية في دبي.", amenities: ["Reception", "Meeting Room", "Parking", "24/7 Security"], permitNumber: "RERA-12348", availableFrom: "2026-05-01", parking: 5, furnished: "Semi-Furnished"
  },
  {
    id: "5", reference: "KE-1005", title: "4BR Townhouse in JVC", location: "Dubai", community: "Jumeirah Village Circle", subCommunity: "District 12", building: "", unitNo: "22", type: "Townhouse", category: "Residential", purpose: "Sale", status: "Draft", price: 1800000, bedrooms: 4, bathrooms: 5, size: 2800, image: images[4], images: getImages(4), listingAgent: "Sara Khan", listingAgentAvatar: agentAvatars["Sara Khan"], owner: "Khalid Ibrahim", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971505678901", portals: { pf: false, bayut: false, website: false }, updatedAt: "2026-03-03", description: "Spacious townhouse with modern finishings and community amenities.", descriptionAr: "تاون هاوس واسع بتشطيبات حديثة ومرافق مجتمعية.", amenities: ["Pool", "Gym", "Garden", "Parking", "Kids Play Area"], permitNumber: "", availableFrom: "2026-06-01", parking: 2, furnished: "Unfurnished"
  },
  {
    id: "6", reference: "KE-1006", title: "Luxury Penthouse in Palm Jumeirah", location: "Dubai", community: "Palm Jumeirah", subCommunity: "Shoreline", building: "Shoreline Apartments", unitNo: "PH-01", type: "Penthouse", category: "Residential", purpose: "Sale", status: "Live", price: 15000000, bedrooms: 5, bathrooms: 7, size: 8500, image: images[5], images: getImages(5), listingAgent: "Omar Farouk", listingAgentAvatar: agentAvatars["Omar Farouk"], owner: "Royal Holdings", ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971506789012", portals: { pf: true, bayut: true, website: true }, updatedAt: "2026-03-02", description: "Exquisite penthouse with panoramic sea views and private pool.", descriptionAr: "بنتهاوس فاخر مع إطلالات بانورامية على البحر ومسبح خاص.", amenities: ["Private Pool", "Jacuzzi", "Cinema Room", "Wine Cellar", "Helipad Access"], permitNumber: "RERA-12350", availableFrom: "2026-04-15", parking: 4, furnished: "Furnished"
  },
  {
    id: "7", reference: "KE-1007", title: "Retail Shop in Dubai Mall Area", location: "Dubai", community: "Downtown Dubai", subCommunity: "Emaar Square", building: "The Address Mall", unitNo: "G-15", type: "Shop", category: "Commercial", purpose: "Rent", status: "Archived", price: 500000, bedrooms: 0, bathrooms: 1, size: 1200, image: images[0], images: getImages(0), listingAgent: "Ahmed Hassan", listingAgentAvatar: agentAvatars["Ahmed Hassan"], owner: "Emaar Properties", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971507890123", portals: { pf: false, bayut: true, website: false }, updatedAt: "2026-02-28", description: "Prime retail space near Dubai Mall with high foot traffic.", descriptionAr: "مساحة تجارية رئيسية بالقرب من دبي مول مع حركة مرور عالية.", amenities: ["Display Window", "Storage", "Parking"], permitNumber: "RERA-12351", availableFrom: "2026-05-01", parking: 2, furnished: "Unfurnished"
  },
  {
    id: "8", reference: "KE-1008", title: "1BR Apartment in Dubai Marina", location: "Dubai", community: "Dubai Marina", subCommunity: "Marina Walk", building: "Marina Heights", unitNo: "801", type: "Apartment", category: "Residential", purpose: "Rent", status: "Live", price: 85000, bedrooms: 1, bathrooms: 2, size: 850, image: images[1], images: getImages(1), listingAgent: "Sara Khan", listingAgentAvatar: agentAvatars["Sara Khan"], owner: "Nasser Al Dhaheri", ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971508901234", portals: { pf: true, bayut: true, website: true }, updatedAt: "2026-03-01", description: "Modern 1BR with marina views and access to world-class amenities.", descriptionAr: "شقة حديثة بغرفة نوم واحدة مع إطلالات على المارينا ووصول إلى مرافق عالمية المستوى.", amenities: ["Pool", "Gym", "Sauna", "Parking", "Beach Access"], permitNumber: "RERA-12352", availableFrom: "2026-04-01", parking: 1, furnished: "Furnished"
  },
  {
    id: "9", reference: "KE-1009", title: "Warehouse in Al Quoz", location: "Dubai", community: "Al Quoz", subCommunity: "Al Quoz Industrial 3", building: "", unitNo: "W-45", type: "Warehouse", category: "Commercial", purpose: "Rent", status: "Pocket", price: 120000, bedrooms: 0, bathrooms: 1, size: 5000, image: images[2], images: getImages(2), listingAgent: "Omar Farouk", listingAgentAvatar: agentAvatars["Omar Farouk"], owner: "Industrial Holdings", ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971509012345", portals: { pf: false, bayut: false, website: false }, updatedAt: "2026-02-25", description: "Large warehouse suitable for storage and light manufacturing.", descriptionAr: "مستودع كبير مناسب للتخزين والتصنيع الخفيف.", amenities: ["Loading Dock", "Office Space", "Parking", "Security"], permitNumber: "RERA-12353", availableFrom: "2026-03-20", parking: 10, furnished: "Unfurnished"
  },
  {
    id: "10", reference: "KE-1010", title: "3BR Apartment in JBR", location: "Dubai", community: "Jumeirah Beach Residence", subCommunity: "Shams", building: "Shams 4", unitNo: "2405", type: "Apartment", category: "Residential", purpose: "Sale", status: "Live", price: 3200000, bedrooms: 3, bathrooms: 4, size: 2100, image: images[3], images: getImages(3), listingAgent: "Ahmed Hassan", listingAgentAvatar: agentAvatars["Ahmed Hassan"], owner: "Beach Living Co.", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971500123456", portals: { pf: true, bayut: true, website: true }, updatedAt: "2026-03-07", description: "Upgraded 3BR with full sea view in a premium beachfront community.", descriptionAr: "شقة ثلاث غرف نوم مطورة مع إطلالة كاملة على البحر في مجتمع شاطئي فاخر.", amenities: ["Beach Access", "Pool", "Gym", "Concierge", "Kids Club"], permitNumber: "RERA-12354", availableFrom: "2026-04-01", parking: 2, furnished: "Semi-Furnished"
  },
  {
    id: "11", reference: "KE-1011", title: "2BR Villa in Mirdif", location: "Dubai", community: "Mirdif", subCommunity: "Mirdif Hills", building: "", unitNo: "MH-12", type: "Villa", category: "Residential", purpose: "Rent", status: "Live", price: 95000, bedrooms: 2, bathrooms: 3, size: 1800, image: images[4], images: getImages(4), listingAgent: "Sara Khan", listingAgentAvatar: agentAvatars["Sara Khan"], owner: "Mirdif Estates", ownerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971501112233", portals: { pf: true, bayut: false, website: true }, updatedAt: "2026-03-06", description: "Cozy family villa with garden in a quiet neighborhood.", descriptionAr: "فيلا عائلية مريحة مع حديقة في حي هادئ.", amenities: ["Garden", "Parking", "Community Pool", "Playground"], permitNumber: "RERA-12355", availableFrom: "2026-03-15", parking: 2, furnished: "Unfurnished"
  },
  {
    id: "12", reference: "KE-1012", title: "Land Plot in Dubai South", location: "Dubai", community: "Dubai South", subCommunity: "Residential District", building: "", unitNo: "P-100", type: "Land", category: "Residential", purpose: "Sale", status: "Draft", price: 5500000, bedrooms: 0, bathrooms: 0, size: 12000, image: images[5], images: getImages(5), listingAgent: "Omar Farouk", listingAgentAvatar: agentAvatars["Omar Farouk"], owner: "Dubai South Dev", ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971502223344", portals: { pf: false, bayut: false, website: false }, updatedAt: "2026-02-20", description: "Prime residential land plot perfect for custom villa construction.", descriptionAr: "قطعة أرض سكنية رئيسية مثالية لبناء فيلا مخصصة.", amenities: [], permitNumber: "", availableFrom: "2026-06-01", parking: 0, furnished: "Unfurnished"
  },
  {
    id: "13", reference: "KE-1013", title: "Studio in Silicon Oasis", location: "Dubai", community: "Dubai Silicon Oasis", subCommunity: "Axis Residence", building: "Axis 2", unitNo: "307", type: "Apartment", category: "Residential", purpose: "Rent", status: "Live", price: 32000, bedrooms: 0, bathrooms: 1, size: 400, image: images[0], images: getImages(0), listingAgent: "Ahmed Hassan", listingAgentAvatar: agentAvatars["Ahmed Hassan"], owner: "DSO Investments", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971503334455", portals: { pf: true, bayut: true, website: false }, updatedAt: "2026-03-05", description: "Affordable studio apartment near academic city.", descriptionAr: "شقة استوديو بأسعار معقولة بالقرب من المدينة الأكاديمية.", amenities: ["Pool", "Gym", "Parking"], permitNumber: "RERA-12357", availableFrom: "2026-04-01", parking: 1, furnished: "Furnished"
  },
  {
    id: "14", reference: "KE-1014", title: "4BR Apartment in Creek Harbour", location: "Dubai", community: "Dubai Creek Harbour", subCommunity: "Island District", building: "Creek Rise", unitNo: "3201", type: "Apartment", category: "Residential", purpose: "Sale", status: "Pending", price: 4200000, bedrooms: 4, bathrooms: 5, size: 2600, image: images[1], images: getImages(1), listingAgent: "Sara Khan", listingAgentAvatar: agentAvatars["Sara Khan"], owner: "Creek Properties", ownerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971504445566", portals: { pf: true, bayut: true, website: true }, updatedAt: "2026-03-04", description: "Luxurious 4BR with views of Dubai Creek Tower and wildlife sanctuary.", descriptionAr: "شقة فاخرة مكونة من أربع غرف نوم مع إطلالات على برج خور دبي ومحمية الحياة البرية.", amenities: ["Pool", "Gym", "Concierge", "Kids Area", "Marina Access"], permitNumber: "RERA-12358", availableFrom: "2026-05-01", parking: 3, furnished: "Semi-Furnished"
  },
  {
    id: "15", reference: "KE-1015", title: "Office in JLT", location: "Dubai", community: "Jumeirah Lakes Towers", subCommunity: "Cluster D", building: "Fortune Tower", unitNo: "1805", type: "Office", category: "Commercial", purpose: "Rent", status: "Live", price: 75000, bedrooms: 0, bathrooms: 1, size: 900, image: images[2], images: getImages(2), listingAgent: "Omar Farouk", listingAgentAvatar: agentAvatars["Omar Farouk"], owner: "JLT Business Hub", ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", ownerPhone: "+971505556677", portals: { pf: false, bayut: true, website: true }, updatedAt: "2026-03-03", description: "Well-fitted office space with lake views and metro access.", descriptionAr: "مساحة مكتبية مجهزة جيداً مع إطلالات على البحيرة ووصول إلى المترو.", amenities: ["Parking", "Pantry", "Meeting Room"], permitNumber: "RERA-12359", availableFrom: "2026-04-01", parking: 2, furnished: "Furnished"
  },
];

export const mockLeads: Lead[] = [
  { id: "L1", name: "John Smith", email: "john@email.com", phone: "+971501234567", source: "WhatsApp", property: "KE-1001", status: "New", date: "2026-03-08", avatar: "JS" },
  { id: "L2", name: "Maria Garcia", email: "maria@email.com", phone: "+971502345678", source: "Email", property: "KE-1002", status: "Contacted", date: "2026-03-07", avatar: "MG" },
  { id: "L3", name: "Ali Al Mansoori", email: "ali@email.com", phone: "+971503456789", source: "Call", property: "KE-1006", status: "Qualified", date: "2026-03-07", avatar: "AA" },
  { id: "L4", name: "Sophie Chen", email: "sophie@email.com", phone: "+971504567890", source: "WhatsApp", property: "KE-1010", status: "New", date: "2026-03-06", avatar: "SC" },
  { id: "L5", name: "David Johnson", email: "david@email.com", phone: "+971505678901", source: "Email", property: "KE-1004", status: "Contacted", date: "2026-03-06", avatar: "DJ" },
  { id: "L6", name: "Fatima Al Zahra", email: "fatima@email.com", phone: "+971506789012", source: "Call", property: "KE-1008", status: "New", date: "2026-03-05", avatar: "FA" },
  { id: "L7", name: "Robert Williams", email: "robert@email.com", phone: "+971507890123", source: "WhatsApp", property: "KE-1001", status: "Lost", date: "2026-03-04", avatar: "RW" },
  { id: "L8", name: "Aisha Mohammed", email: "aisha@email.com", phone: "+971508901234", source: "Email", property: "KE-1014", status: "Qualified", date: "2026-03-04", avatar: "AM" },
  { id: "L9", name: "Tom Anderson", email: "tom@email.com", phone: "+971509012345", source: "Call", property: "KE-1003", status: "Contacted", date: "2026-03-03", avatar: "TA" },
  { id: "L10", name: "Noura Al Hashimi", email: "noura@email.com", phone: "+971500123456", source: "WhatsApp", property: "KE-1011", status: "New", date: "2026-03-03", avatar: "NA" },
  { id: "L11", name: "James Brown", email: "james@email.com", phone: "+971501112233", source: "Email", property: "KE-1005", status: "New", date: "2026-03-02", avatar: "JB" },
  { id: "L12", name: "Layla Hassan", email: "layla@email.com", phone: "+971502223344", source: "WhatsApp", property: "KE-1006", status: "Contacted", date: "2026-03-01", avatar: "LH" },
];

export const filterOptions = {
  countries: ["UAE"],
  cities: ["Dubai", "Abu Dhabi", "Sharjah"],
  communities: ["Downtown Dubai", "Arabian Ranches", "Business Bay", "DIFC", "Jumeirah Village Circle", "Palm Jumeirah", "Jumeirah Beach Residence", "Dubai Marina", "Mirdif", "Dubai South", "Dubai Silicon Oasis", "Dubai Creek Harbour", "Jumeirah Lakes Towers", "Al Quoz"],
  propertyTypes: ["Apartment", "Villa", "Townhouse", "Penthouse", "Office", "Shop", "Warehouse", "Land"],
  categories: ["Residential", "Commercial"],
  purposes: ["Rent", "Sale"],
  statuses: ["Live", "Draft", "Pending", "Archived", "Pocket"],
  agents: ["Ahmed Hassan", "Sara Khan", "Omar Farouk"],
  furnished: ["Furnished", "Unfurnished", "Semi-Furnished"],
  portals: ["Property Finder", "Bayut", "Website"],
};
