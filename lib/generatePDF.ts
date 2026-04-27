import jsPDF from "jspdf";
import { PropertyListing } from "@/data/mockData";

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
      resolve(canvas.toDataURL("image/jpeg", 0.9));
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

export async function generatePropertyPDF(listing: PropertyListing) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const darkColor = [15, 23, 42] as [number, number, number];
  const mutedColor = [100, 116, 139] as [number, number, number];
  const borderColor = [226, 232, 240] as [number, number, number];
  // const goldColor = [184, 134, 11] as [number, number, number];

  // --- HEADER ---
  // Logo placeholder
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.text("VOID", margin, y + 10);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("RESIDENCES", margin, y + 14);

  // Title & Location
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(listing.title.toUpperCase(), 70, y + 8);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedColor);
  doc.text(`${listing.community}, ${listing.location}, United Arab Emirates`, 70, y + 13);

  // Reference & Date
  doc.setFontSize(8);
  doc.text(`PROPERTY ID`, pageWidth - 65, y + 6);
  doc.text(`LISTED ON`, pageWidth - 45, y + 6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(listing.reference, pageWidth - 65, y + 10);
  doc.text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), pageWidth - 45, y + 10);

  // Header QR
  if (listing.qr_url) {
      try {
          const qrImg = await loadImage(listing.qr_url);
          doc.addImage(qrImg, "JPEG", pageWidth - margin - 15, y, 15, 15);
          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.text("SCAN TO VIEW", pageWidth - margin - 15, y + 18);
          doc.text("DIGITAL BROCHURE", pageWidth - margin - 15, y + 20);
      } catch (e) { /* skip */ }
  }

  y += 25;

  // --- HERO IMAGE ---
  try {
    const heroImg = await loadImage(listing.images[0] || listing.image);
    doc.addImage(heroImg, "JPEG", margin, y, contentWidth, 75, undefined, 'MEDIUM');
  } catch (e) {
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, contentWidth, 75, "F");
  }
  y += 80;

  // --- BADGES ROW ---
  const badgeWidth = (contentWidth - 9) / 4;
  const badges = [
      { label: "Type", value: listing.type, icon: "🏠" },
      { label: "Category", value: listing.category, icon: "🏢" },
      { label: "Purpose", value: listing.purpose, icon: "🤝" },
      { label: "Status", value: listing.status, icon: "🟢" }
  ];

  badges.forEach((b, i) => {
      const bx = margin + i * (badgeWidth + 3);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(bx, y, badgeWidth, 12, 1, 1, "F");
      doc.setFontSize(7);
      doc.setTextColor(...mutedColor);
      doc.text(b.label.toUpperCase(), bx + 10, y + 5);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(b.value, bx + 10, y + 9);
  });
  y += 18;

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

  // --- PROPERTY DETAILS & PRICE ---
  const detailsColW = contentWidth * 0.65;
  const priceCardW = contentWidth * 0.32;
  
  // Left: Details Table
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("PROPERTY DETAILS", margin, y);
  y += 6;
  
  const detailRows = [
      ["Type", listing.type, "Category", listing.category],
      ["Furnishing", listing.furnished, "Purpose", listing.purpose],
      ["Bedrooms", String(listing.bedrooms), "Size", `${listing.size.toLocaleString()} Sqft`],
      ["Bathrooms", String(listing.bathrooms), "Posted On", "April 1, 2025"],
      ["Parking", String(listing.parking), "Permit No.", listing.permitNumber || "1234567890"],
      ["Available From", listing.availableFrom || "Immediate", "Building", listing.building || "N/A"],
      ["Unit No.", listing.unitNo || "N/A", "", ""]
  ];

  doc.setFontSize(8);
  detailRows.forEach((row, i) => {
      const ry = y + i * 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...mutedColor);
      doc.text(row[0], margin, ry);
      doc.text(row[2], margin + detailsColW / 2, ry);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(row[1], margin + 25, ry);
      doc.text(row[3], margin + detailsColW / 2 + 25, ry);
  });

  // Right: Price Card
  const py = y - 6;
  doc.setFillColor(...darkColor);
  doc.roundedRect(margin + detailsColW + 3, py, priceCardW, 25, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("PRICE", margin + detailsColW + 8, py + 8);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`AED ${listing.price.toLocaleString()}`, margin + detailsColW + 8, py + 16);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(listing.purpose === "Rent" ? "/Year" : "", margin + detailsColW + priceCardW - 10, py + 16, { align: "right" });

  y += 40;

  // --- DESCRIPTION ---
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("DESCRIPTION", margin, y);
  doc.text("الوصف بالعربية", pageWidth - margin, y, { align: "right" });
  y += 6;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const descLines = doc.splitTextToSize(listing.description, (contentWidth / 2) - 5);
  doc.text(descLines, margin, y);

  if (listing.descriptionAr) {
      const arLines = ["(Arabic description provided in the digital portal)"];
      doc.text(arLines, pageWidth - margin, y, { align: "right" });
  }
  y += Math.max(descLines.length * 4, 10) + 10;

  // --- AGENT & ADMIN DETAILS ---
  const cardW = (contentWidth - 5) / 2;
  const renderPersonCard = async (px: number, py: number, title: string, name: string, phone: string, email: string, rera: string, avatar?: string) => {
      doc.setDrawColor(...borderColor);
      doc.roundedRect(px, py, cardW, 40, 2, 2, "D");
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(title.toUpperCase(), px + 40, py + 8);
      
      if (avatar) {
          try {
              const circImg = await getCircularImage(avatar);
              doc.addImage(circImg, "PNG", px + 5, py + 5, 30, 30);
          } catch (e) { /* skip */ }
      }

      doc.setFontSize(9);
      doc.text(name, px + 40, py + 15);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...mutedColor);
      doc.text(`+ ${phone}`, px + 40, py + 22);
      doc.text(`${email}`, px + 40, py + 27);
      doc.text(`RERA ID: ${rera}`, px + 40, py + 32);
  };

  await renderPersonCard(margin, y, "Agent Details", listing.listingAgent, listing.agentPhone || "", listing.agentEmail || "", "789012", listing.listingAgentAvatar);
  await renderPersonCard(margin + cardW + 5, y, "Admin Details", "System Admin", "+971 4 987 6543", "admin@voidresidences.ae", "123456", "");

  y += 45;

  // --- GALLERY ---
  if (y > 230) { doc.addPage(); y = margin; }
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
  if (y > 250) { doc.addPage(); y = margin; }
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
  if (y > 240) { doc.addPage(); y = margin; }
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

  // --- FOOTER ---
  doc.setFillColor(...darkColor);
  doc.rect(0, pageHeight - 20, pageWidth, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("VOID", margin, pageHeight - 12);
  doc.setFontSize(7);
  doc.text("Void Residences is a premium real estate brand focused on quality.", margin + 15, pageHeight - 12);
  doc.text("Contact: +971 4 123 4567 | info@voidresidences.ae", pageWidth - margin, pageHeight - 12, { align: "right" });

  doc.save(`${listing.reference}.pdf`);
}
