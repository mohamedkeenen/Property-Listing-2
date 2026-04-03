import { PropertyListing } from "@/data/mockData";
import { API_BASE_URL } from "@/api/redux/apiConfig";

export const mapBackendPropertyToFrontend = (p: any): PropertyListing => {
  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith('http') || path.startsWith('data:image')) return path;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
      : 'https://property-listing.keenenter.com';

    if (path.startsWith('/api/storage/')) return `${baseUrl}${path}`;
    if (path.startsWith('api/storage/')) return `${baseUrl}/${path}`;
    
    // For older properties or paths without the prefix:
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;
    cleanPath = cleanPath.replace(/^(api\/storage\/|storage\/)+/, '');
    
    return `${baseUrl}/api/storage/${cleanPath}`;
  };

  const imagesList = p.images || [];
  const coverMedia = imagesList.find((m: any) => m.type === 'cover') || imagesList[0];
  const coverUrl = coverMedia ? (coverMedia.url || getImageUrl(coverMedia.file_path)) : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop";
  const allImages = imagesList.map((m: any) => m.url || getImageUrl(m.file_path));

  return {
    id: p.id.toString(),
    reference: p.reference || `REF-${p.id}`, 
    agentEmail: p.agent_email || "",    title: p.title_en || "Untitled",
    location: p.city || "Dubai", 
    property_location: p.property_location || "",
    pfLocation: p.property_location || "",
    community: p.community || "Main",
    subCommunity: p.sub_community || "",
    building: p.tower || p.building || "",
    bayutLocation: p.bayut_location || "",
    bayutCity: p.bayut_city || "",
    bayutCommunity: p.bayut_community || "",
    bayutSubCommunity: p.bayut_sub_community || "",
    bayutBuilding: p.bayut_tower || "",
    unitNo: p.unit_number || "",
    type: p.property_type || "Apartment",
    category: p.category?.charAt(0).toUpperCase() + p.category?.slice(1) as any,
    purpose: p.purpose?.charAt(0).toUpperCase() + p.purpose?.slice(1) as any,
    status: p.status as any,
    price: parseFloat(p.sale_price || p.rent_price || "0"),
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    size: p.size || 0,
    image: coverUrl,
    images: allImages,
    listingAgent: p.agent?.name || "Unknown Agent",
    listingAgentAvatar: p.agent?.photo ? getImageUrl(p.agent.photo) : "",
    owner: p.owner?.name || "System Admin",
    ownerAvatar: p.owner?.photo ? getImageUrl(p.owner.photo) : "",
    ownerPhone: p.owner?.phone || "",
    office: p.company?.company_name || "PRIME ZAM",
    portals: {
      pf: p.is_on_pf || false,
      bayut: p.is_on_bayut || false,
      website: p.is_on_website || false,
      skyloov: false, 
      dubizzle: p.is_on_dubizzle || false,
    },
    pfStatus: p.pf_status || null,
    updatedAt: p.updated_at || new Date().toISOString(),
    description: p.description_en || "",
    descriptionAr: p.description_ar || "",
    amenities: p.amenities || [],
    permitNumber: p.permit_number || "",
    availableFrom: p.available_date || "",
    parking: p.parking || 0,
    furnished: p.furnished || "Unfurnished",
    notes: typeof p.notes === 'string' 
      ? [{ id: Math.random(), content: p.notes, user: "System Admin", date: p.updated_at }]
      : (p.notes || []).map((n: any) => ({
          id: n.id || Math.random(),
          content: n.content || n,
          user: n.user?.name || "System Admin",
          date: n.created_at || p.updated_at
        })),
    documents: (p.documents || []).map((d: any) => ({
      id: d.id || Math.random(),
      title: d.title,
      url: d.url || getImageUrl(d.file_path)
    })),
  };
};

export const mapBackendPropertyToFormValues = (p: any): any => {
  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith('http') || path.startsWith('data:image')) return path;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
      : 'https://property-listing.keenenter.com';

    if (path.startsWith('/api/storage/')) return `${baseUrl}${path}`;
    if (path.startsWith('api/storage/')) return `${baseUrl}/${path}`;
    
    // For older properties or paths without the prefix:
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;
    cleanPath = cleanPath.replace(/^(api\/storage\/|storage\/)+/, '');
    
    return `${baseUrl}/api/storage/${cleanPath}`;
  };

  const getPrice = () => {
    const sale = parseFloat(p.sale_price || "0");
    const rent = parseFloat(p.rent_price || "0");
    return sale > 0 ? sale : (rent > 0 ? rent : "");
  };

  return {
    category: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "Residential",
    purpose: p.purpose ? p.purpose.charAt(0).toUpperCase() + p.purpose.slice(1) : "Rent",
    type: p.property_type || "",
    title: p.title_en || "",
    titleAr: p.title_ar || "",
    description: p.description_en || "",
    descriptionAr: p.description_ar || "",
    size: p.size ? parseFloat(p.size) : "",
    bedrooms: p.bedrooms !== null ? p.bedrooms : "",
    bathrooms: p.bathrooms !== null ? p.bathrooms : "",
    parking: p.parking !== null ? p.parking : "",
    unitNo: p.unit_number || "",
    price: getPrice(),
    pricePeriod: p.rent_frequency || "Yearly",
    currency: p.currency || "Dirham",
    listingAgent: p.agent_id?.toString() || "",
    listingOwner: p.owner_id?.toString() || "",
    projectName: p.project_id?.toString() || "",
    developers: p.developer_id?.toString() || "",
    amenities: p.amenities || [],
    property_location: p.property_location || "",
    pfLocation: p.property_location || "",
    city: p.city || "",
    community: p.community || "",
    subCommunity: p.sub_community || "",
    building: p.tower || p.building || "",
    bayutLocation: p.bayut_location || "",
    bayutCity: p.bayut_city || "",
    bayutCommunity: p.bayut_community || "",
    bayutSubCommunity: p.bayut_sub_community || "",
    bayutBuilding: p.bayut_tower || "",
    permitNumber: p.permit_number || "",
    permitIssueDate: p.ad_issue_date || "",
    adIssueDate: p.ad_issue_date || "",
    licenseNo: p.license_no || "",
    furnishingType: p.furnishing_type || "unfurnished",
    projectStatus: p.project_status || "completed",
    age: p.age || 0,
    floorNumber: p.floor_number || 0,
    numberOfFloors: p.number_of_floors || 0,
    locationId: p.location_id || 0,
    hasGarden: !!p.has_garden,
    hasKitchen: !!p.has_kitchen,
    hasParking: !!p.has_parking,
    minimalRentalPeriod: p.minimal_rental_period || 0,
    reference: p.reference || "",
    agentEmail: p.agent_email || "",
    images: (p.images || []).map((img: any) => img.url || getImageUrl(img.file_path)),
    documents: (p.documents || []).map((doc: any) => JSON.stringify({
      name: doc.name || doc.title,
      data: doc.url || getImageUrl(doc.file_path),
      size: doc.size || "Unknown"
    })),
    notes: typeof p.notes === 'string' ? p.notes : (Array.isArray(p.notes) ? p.notes.map((n: any) => n.content || n).join('\n') : ""),
    portals: {
      propertyFinder: !!p.is_on_pf,
      bayutEnabled: !!p.is_on_bayut,
      bayutSelection: !!p.is_on_bayut,
      dubizzleSelection: !!p.is_on_dubizzle,
      officeWebsite: !!p.is_on_website,
      primeZamWebsite: false,
    }
  };
};
