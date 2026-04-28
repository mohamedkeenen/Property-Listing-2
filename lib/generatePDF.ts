import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PropertyListing } from "@/data/mockData";

async function renderTextToImage(text: string, title: string = ""): Promise<string | null> {
    if (!text && !title) return null;
    
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '-9999px';
    div.style.top = '-9999px';
    div.style.width = '350px';
    div.style.fontFamily = 'Arial, Tahoma, sans-serif';
    div.style.direction = 'rtl';
    div.style.textAlign = 'right';
    div.style.color = 'rgb(50, 50, 50)';
    div.style.backgroundColor = 'transparent';
    
    if (title) {
        const titleEl = document.createElement('div');
        titleEl.style.fontWeight = 'bold';
        titleEl.style.color = 'black';
        titleEl.style.fontSize = '18px';
        titleEl.style.marginBottom = '12px';
        titleEl.innerText = title;
        div.appendChild(titleEl);
    }
    
    const textEl = document.createElement('div');
    textEl.style.fontSize = '12px';
    textEl.style.lineHeight = '1.6';
    textEl.style.whiteSpace = 'pre-wrap';
    textEl.innerText = text;
    div.appendChild(textEl);
    
    document.body.appendChild(div);
    
    try {
        const canvas = await html2canvas(div, { backgroundColor: null, scale: 2 });
        document.body.removeChild(div);
        return canvas.toDataURL('image/png');
    } catch (e) {
        document.body.removeChild(div);
        return null;
    }
}

async function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

const getCircularImage = async (imgUrl: string) => {
    return new Promise<string>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) { resolve(imgUrl); return; }

            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;

            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();

            ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve(imgUrl);
        img.src = imgUrl;
    });
};

export async function generatePropertyPDF(listing: PropertyListing, settings?: any) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const hexToRgb = (hex: string): [number, number, number] => {
    let r = 15, g = 23, b = 42;
    if (hex) {
      hex = hex.replace(/^#/, '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
    }
    return [r, g, b];
  };

  // Colors
  const darkColor = settings?.themeColor ? hexToRgb(settings.themeColor) : ([15, 23, 42] as [number, number, number]);
  const mutedColor = [100, 116, 139] as [number, number, number];
  const borderColor = [226, 232, 240] as [number, number, number];
  
  const companyName = settings?.companyName || "VOID";
  const website = settings?.websiteLink || "voidresidences.ae";

  const drawBranding = async () => {
    // Header
    doc.setFillColor(...darkColor);
    doc.rect(0, 0, pageWidth, 25, "F");
    doc.setTextColor(255, 255, 255);
    
    // Logo (Left)
    if (settings?.logoPdf) {
      try {
        const logoImg = await loadImage(settings.logoPdf);
        doc.addImage(logoImg, "PNG", margin, 5, 40, 15, undefined, "MEDIUM");
      } catch (e) {
        doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text(companyName, margin, 15);
      }
    } else {
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text(companyName, margin, 15);
    }

    // Listing Title (Center)
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    const headerTitle = listing.title.length > 45 ? listing.title.substring(0, 42) + "..." : listing.title;
    doc.text(headerTitle.toUpperCase(), pageWidth / 2, 15, { align: "center" });

    // QR Code in Header Right
    if (listing.qr_url) {
      try {
        const qrImg = await loadImage(listing.qr_url);
        doc.addImage(qrImg, "JPEG", pageWidth - margin - 18, 3.5, 18, 18);
      } catch (e) {}
    }

    // Footer
    doc.setFillColor(...darkColor);
    doc.rect(0, pageHeight - 20, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    
    // Footer Logo (Left)
    if (settings?.logoPdf) {
      try {
        const logoImg = await loadImage(settings.logoPdf);
        doc.addImage(logoImg, "PNG", margin, pageHeight - 17, 30, 12, undefined, "MEDIUM");
      } catch (e) {
        doc.setFontSize(9); doc.text(companyName, margin, pageHeight - 10);
      }
    } else {
      doc.setFontSize(9); doc.text(companyName, margin, pageHeight - 10);
    }
    
    // Date in Footer Center
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    doc.setFontSize(9);
    doc.text(dateStr, pageWidth / 2, pageHeight - 10, { align: "center" });

    // Website (Right)
    doc.setFontSize(10);
    doc.text(website, pageWidth - margin, pageHeight - 10, { align: "right" });
  };

  await drawBranding();
  y = 35;

  // --- LOCATION LOGIC ---
  let displayLocation = listing.location;
  let displayCommunity = listing.community;

  // prioritize PF if set
  if (listing.pfLocation && listing.pfLocation !== "-") {
      const pfParts = listing.pfLocation.split(" - ");
      if (pfParts.length >= 2) {
          displayLocation = pfParts[0];
          displayCommunity = pfParts[1];
      }
  } 
  // fallback to Bayut/Dubizzle if set
  else if (listing.bayutLocation && listing.bayutLocation !== "-") {
      displayLocation = listing.bayutCity || listing.location;
      displayCommunity = listing.bayutCommunity || listing.community;
  }

  // Location (Left)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`${displayCommunity}, ${displayLocation}`, margin, y);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedColor);
  doc.text(`United Arab Emirates`, margin, y + 5);

  // Price (Center)
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkColor);
  const priceStr = `AED ${listing.price.toLocaleString()}`;
  const periodStr = (listing.pricePeriod || listing.purpose === "Rent") ? (listing.pricePeriod ? `/${listing.pricePeriod}` : "/Year") : "";
  doc.text(`${priceStr}${periodStr}`, pageWidth / 2, y, { align: "center" });

  // Reference (Far Right)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedColor);
  const refText = `PROPERTY ID: `;
  const refVal = listing.reference;
  const refValWidth = doc.getTextWidth(refVal);
  const refTextWidth = doc.getTextWidth(refText);
  
  doc.text(refText, pageWidth - margin - refValWidth, y, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(refVal, pageWidth - margin, y, { align: "right" });

  y += 20;

  // --- HERO IMAGE ---
  try {
    const heroImg = await loadImage(listing.images[0] || listing.image);
    doc.addImage(heroImg, "JPEG", margin, y, contentWidth, 75, undefined, 'MEDIUM');
  } catch (e) {
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, contentWidth, 75, "F");
  }
  y += 85;

  // --- BADGES GRID (2 Rows) ---
  const badgesPerRow = 5;
  const badgeWidth = (contentWidth - (badgesPerRow - 1) * 3) / badgesPerRow;
  const badges = [
      { label: "Type", value: listing.type },
      { label: "Category", value: listing.category },
      { label: "Purpose", value: listing.purpose },
      { label: "Status", value: listing.status },
      { label: "Furnishing", value: listing.furnished },
      { label: "Building", value: listing.building || "-" },
      { label: "Unit No.", value: listing.unitNo || "-" },
      { label: "Permit No.", value: listing.permitNumber || "-" },
      { label: "Available", value: listing.availableFrom || "Immediate" },
      { label: "Posted On", value: new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  ];

  badges.forEach((b, i) => {
      const col = i % badgesPerRow;
      const row = Math.floor(i / badgesPerRow);
      const bx = margin + col * (badgeWidth + 3);
      const by = y + row * 15;

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(bx, by, badgeWidth, 12, 1, 1, "F");
      doc.setFontSize(6.5);
      doc.setTextColor(...mutedColor);
      doc.text(b.label.toUpperCase(), bx + badgeWidth / 2, by + 4, { align: "center" });
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const val = String(b.value).length > 18 ? String(b.value).substring(0, 15) + "..." : String(b.value);
      doc.text(val, bx + badgeWidth / 2, by + 9, { align: "center" });
  });
  y += 32;

  // --- CORE SPECS ---
  const specBoxW = (contentWidth - 9) / 4;
  const specs = [
      { label: "SQFT AREA", value: listing.size.toLocaleString() },
      { label: "BEDROOMS", value: listing.bedrooms },
      { label: "BATHROOMS", value: listing.bathrooms },
      { label: "PARKING", value: listing.parking }
  ];

  specs.forEach((s, i) => {
      const sx = margin + i * (specBoxW + 3);
      doc.setDrawColor(...borderColor);
      doc.roundedRect(sx, y, specBoxW, 20, 2, 2, "D");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(String(s.value), sx + specBoxW/2, y + 10, { align: "center" });
      doc.setFontSize(7);
      doc.setTextColor(...mutedColor);
      doc.text(s.label, sx + specBoxW/2, y + 16, { align: "center" });
  });
  y += 28;

  y += 5;

  // --- DESCRIPTION ---
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("DESCRIPTION", margin, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const descLines = doc.splitTextToSize(listing.description, (contentWidth / 2) - 5);
  doc.text(descLines, margin, y);

  if (listing.descriptionAr) {
      try {
          const arImg = await renderTextToImage(listing.descriptionAr, "الوصف بالعربية");
          if (arImg) {
              const imgW = (contentWidth / 2) - 5;
              // we don't have getImageProperties easily without loading it again, 
              // but we can just use an HTML Image element to get dims
              const img = new Image();
              img.src = arImg;
              await new Promise(r => { img.onload = r; });
              const imgH = (img.height * imgW) / img.width;
              doc.addImage(arImg, "PNG", pageWidth - margin - imgW, y - 6, imgW, imgH);
          }
      } catch (e) {
          const arLines = ["(Arabic description provided in the digital portal)"];
          doc.text(arLines, pageWidth - margin, y, { align: "right" });
      }
  }

  y += Math.max(descLines.length * 4, 20) + 15;

  // Force New Page for Agent/Admin and rest of details
  doc.addPage();
  await drawBranding();
  y = 35;

  // --- AGENT & ADMIN DETAILS ---
  const cardW = (contentWidth - 5) / 2;
  const renderPersonCard = async (px: number, py: number, title: string, name: string, phone: string, email: string, avatar?: string) => {
      doc.setDrawColor(...borderColor);
      doc.roundedRect(px, py, cardW, 40, 3, 3, "S");
      
      doc.setTextColor(...darkColor);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(title.toUpperCase(), px + 40, py + 10);
      
      const avatarToUse = avatar || settings?.logoPdf;
      if (avatarToUse) {
          try {
              const circImg = await getCircularImage(avatarToUse);
              doc.addImage(circImg, "PNG", px + 5, py + 5, 30, 30);
          } catch (e) { /* skip */ }
      }

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(name, px + 40, py + 18);
      
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(`+ ${phone}`, px + 40, py + 26);
      doc.text(email, px + 40, py + 33);
  };

  await renderPersonCard(margin, y, "Agent Details", listing.listingAgent, listing.agentPhone || "", listing.agentEmail || "", listing.listingAgentAvatar);
  await renderPersonCard(margin + cardW + 5, y, "Admin Details", listing.owner || "System Admin", listing.ownerPhone || "Not Provided", listing.ownerEmail || "Not Provided", listing.ownerAvatar);

  y += 45;

  // --- GALLERY ---
  if (y > 230) { 
    doc.addPage(); 
    await drawBranding();
    y = 35; 
  }
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("PROPERTY GALLERY", margin, y);
  y += 6;
  const thumbW = (contentWidth - 12) / 5;
  const thumbH = 25;
  for (let i = 0; i < Math.min(listing.images.length, 5); i++) {
      try {
          const tImg = await loadImage(listing.images[i]);
          doc.addImage(tImg, "JPEG", margin + i * (thumbW + 3), y, thumbW, thumbH, undefined, 'FAST');
      } catch (e) { /* skip */ }
  }
  y += thumbH + 10;

  // --- AMENITIES ---
  if (y > 250) { 
    doc.addPage(); 
    await drawBranding();
    y = 35; 
  }
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("AMENITIES & FEATURES", margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const amenityRows = [];
  for (let i = 0; i < listing.amenities.length; i += 4) {
      amenityRows.push(listing.amenities.slice(i, i + 4).join("   •   "));
  }
  amenityRows.slice(0, 3).forEach((row, i) => {
      doc.text(row, margin, y + i * 5);
  });
  y += 20;

  // --- LOCATION & FLOOR PLAN ---
  if (y > 240) { 
    doc.addPage(); 
    await drawBranding();
    y = 35; 
  }
  const mapWidth = (contentWidth - 5) / 2;
  doc.text("LOCATION", margin, y);
  doc.text("FLOOR PLAN", margin + mapWidth + 5, y);
  y += 4;
  
  doc.setFillColor(245, 247, 249);
  doc.rect(margin, y, mapWidth, 40, "F");
  doc.rect(margin + mapWidth + 5, y, mapWidth, 40, "F");
  
  if (listing.floorPlanImage) {
      try {
          const fpImg = await loadImage(listing.floorPlanImage);
          doc.addImage(fpImg, "JPEG", margin + mapWidth + 5, y, mapWidth, 40, undefined, 'MEDIUM');
      } catch (e) { /* skip */ }
  }

  doc.save(`${listing.reference}.pdf`);
}
