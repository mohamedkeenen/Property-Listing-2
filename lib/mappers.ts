import { PropertyListing } from "@/data/mockData";

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


export const mapBackendPropertyToFrontend = (p: any): PropertyListing => {
  const imagesList = p.images || [];
  const coverMedia = imagesList.find((m: any) => m.type === 'cover') || imagesList[0];
  const coverUrl = coverMedia ? (coverMedia.url || getImageUrl(coverMedia.file_path)) : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop";
  const allImages = imagesList.map((m: any) => m.url || getImageUrl(m.file_path));

  // Process custom_fields if they exist
  const customFields = (p.custom_fields || []).map((f: any) => ({
    ...f,
    value: f.type === 'image' ? getImageUrl(f.value) : (f.type === 'text_image' ? { ...f.value, image: getImageUrl(f.value?.image) } : f.value)
  }));

  return {
    id: p.id.toString(),
    reference: p.reference || `REF-${p.id}`, 
    title: p.title_en || "",
    titleAr: p.title_ar || "",
    video_url: p.video_url || "",
    virtual_tour_url: p.virtual_tour_url || "",
    qr_url: p.qr_url || "",
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
    pricePeriod: p.rent_frequency || "Yearly",
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    size: p.size || 0,
    image: coverUrl,
    images: allImages,
    listingAgent: p.agent?.name || "Unknown Agent",
    listingAgentAvatar: p.agent?.photo ? getImageUrl(p.agent.photo) : "",
    agentEmail: p.agent?.email || p.agent_email || "",
    agentPhone: p.agent?.phone || "",
    owner: typeof p.owner === 'string' ? p.owner : (p.owner?.name || p.owner_name || p.landlord_name || "N/A"),
    ownerAvatar: p.ownerAvatar !== undefined ? p.ownerAvatar : (p.owner?.photo ? getImageUrl(p.owner.photo) : ""),
    ownerPhone: p.ownerPhone !== undefined ? p.ownerPhone : (p.owner?.phone || ""),
    office: p.company?.company_name || p.office || "PRIME ZAM",
    portals: {
      pf: p.is_on_pf || false,
      bayut: p.is_on_bayut || false,
      website: p.is_on_website || false,
      dubizzle: p.is_on_dubizzle || false,
      propqa: p.is_on_propqa || false,
      bitrix: p.is_on_bitrix || true,
    },
    uaeEmirate: p.uae_emirate || "",
    pfStatus: p.pf_status || null,
    propqa_status: p.propqa_status || null,
    updatedAt: p.updated_at,
    createdAt: p.created_at,
    description: p.description_en || "",
    descriptionAr: p.description_ar || "",
    amenities: p.amenities || [],
    permitNumber: p.permit_number || "",
    availableFrom: p.available_date || "",
    parking: p.parking || 0,
    furnished: p.furnishing_type || "unfurnished",
    finishingType: p.finishing_type || "",
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
    custom_values: p.custom_values || {},
    custom_fields: customFields,
    floorPlanImage: p.floor_plan_image ? getImageUrl(p.floor_plan_image) : undefined,
    projectName: p.project_name || "",
    developers: p.developer_name || "",
  };
};

export const mapBackendPropertyToFormValues = (p: any): any => {
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
    listingAdmin: p.listing_admin_id?.toString() || "",
    listingOwner: p.owner_id?.toString() || "",
    projectName: p.project_name || "",
    developers: p.developer_name || "",
    amenities: p.amenities || [],
    landNumber: p.land_number || "",
    streetName: p.street_name || "",
    streetDirection: p.street_direction || "",
    streetWidth: p.street_width !== null ? p.street_width : "",
    finishingType: p.finishing_type || "",
    availableFrom: p.available_from ? (typeof p.available_from === 'string' ? p.available_from.split('T')[0].split(' ')[0] : "") : "",
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
    permitIssueDate: p.ad_issue_date ? (typeof p.ad_issue_date === 'string' ? p.ad_issue_date.split('T')[0].split(' ')[0] : "") : "",
    adIssueDate: p.ad_issue_date ? (typeof p.ad_issue_date === 'string' ? p.ad_issue_date.split('T')[0].split(' ')[0] : "") : "",
    licenseNo: p.license_no || "",
    furnishingType: p.furnishing_type || "unfurnished",
    projectStatus: p.project_status || "completed",
    paymentMethod: p.payment_method || "Cash",
    serviceCharges: p.service_charges || "",
    downPayment: p.down_payment || "",
    financialStatus: p.financial_status || "Paid",
    age: p.age || 0,
    floorNumber: p.floor_number || 0,
    numberOfFloors: p.number_of_floors || 0,
    locationId: p.location_id || 0,
    hasGarden: !!p.has_garden,
    hasKitchen: !!p.has_kitchen,
    hasParking: !!p.has_parking,
    minimalRentalPeriod: p.minimal_rental_period ? p.minimal_rental_period.toString() : "0",
    cheques: p.cheques ? p.cheques.toString() : "1",
    uaeEmirate: p.uae_emirate || "dubai",
    builtUpArea: p.built_up_area || "",
    layoutType: p.layout_type || "",
    titleDeed: p.title_deed || "",
    buildYear: p.build_year || "",
    ownership: p.ownership || "",
    videoUrl: p.video_url || "",
    view360Url: p.virtual_tour_url || "",
    qrUrl: p.qr_url || "",
    floorPlanImage: p.floor_plan_image ? getImageUrl(p.floor_plan_image) : null,
    reference: p.reference || "",
    agentEmail: p.agent_email || "",
    images: (p.images || []).map((img: any) => img.url || getImageUrl(img.file_path)),
    documents: (p.documents || []).map((doc: any) => JSON.stringify({
      name: doc.name || doc.title,
      data: doc.url || getImageUrl(doc.file_path),
      size: doc.size || "Unknown"
    })),
    notes: typeof p.notes === 'string' ? p.notes : (Array.isArray(p.notes) ? p.notes.map((n: any) => n.content || n).join('\n') : ""),
    custom_values: (p.custom_fields || []).reduce((acc: any, field: any) => {
      acc[field.id] = field.value;
      return acc;
    }, {}),
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
