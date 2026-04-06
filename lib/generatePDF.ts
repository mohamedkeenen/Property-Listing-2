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
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

export async function generatePropertyPDF(listing: PropertyListing) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Header
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageW, 40, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text(listing.title, margin, 18);
  pdf.setFontSize(10);
  pdf.text(`${listing.reference} • ${listing.community}, ${listing.location}`, margin, 28);
  pdf.text(
    `AED ${listing.price.toLocaleString()} ${listing.purpose === "Rent" ? "/ year" : ""}`,
    pageW - margin,
    18,
    { align: "right" }
  );
  pdf.text(`${listing.type} • ${listing.purpose} • ${listing.status}`, pageW - margin, 28, { align: "right" });
  y = 50;

  // Main image
  try {
    const mainImg = await loadImage(listing.images[0] || listing.image);
    pdf.addImage(mainImg, "JPEG", margin, y, contentW, 80, undefined, 'FAST');
    y += 85;
  } catch {
    y += 5;
  }

  // Thumbnail row
  const thumbW = (contentW - 12) / 4;
  const thumbH = thumbW * 0.65;
  let tx = margin;
  for (let i = 1; i < Math.min(listing.images.length, 5); i++) {
    try {
      const img = await loadImage(listing.images[i]);
      pdf.addImage(img, "JPEG", tx, y, thumbW, thumbH, undefined, 'FAST');
    } catch { /* skip */ }
    tx += thumbW + 4;
  }
  if (listing.images.length > 1) y += thumbH + 8;

  // Specs
  pdf.setTextColor(30, 41, 59);
  pdf.setFontSize(12);
  pdf.text("Property Details", margin, y);
  y += 7;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);

  const specs = [
    ["Type", listing.type],
    ["Category", listing.category],
    ["Purpose", listing.purpose],
    ["Bedrooms", String(listing.bedrooms)],
    ["Bathrooms", String(listing.bathrooms)],
    ["Size", `${listing.size.toLocaleString()} sq.ft`],
    ["Parking", String(listing.parking)],
    ["Furnished", listing.furnished],
    ["Available From", listing.availableFrom],
    ["Permit", listing.permitNumber || "—"],
    ["Unit No", listing.unitNo],
    ["Building", listing.building || "—"],
  ];

  const colW = contentW / 2;
  specs.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const sx = margin + col * colW;
    const sy = y + row * 6;
    pdf.setTextColor(100, 116, 139);
    pdf.text(`${s[0]}:`, sx, sy);
    pdf.setTextColor(30, 41, 59);
    pdf.text(s[1], sx + 30, sy);
  });
  y += Math.ceil(specs.length / 2) * 6 + 8;

  // Check page overflow
  if (y > 250) {
    pdf.addPage();
    y = margin;
  }

  // Description
  pdf.setFontSize(12);
  pdf.setTextColor(30, 41, 59);
  pdf.text("Description", margin, y);
  y += 6;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  const descLines = pdf.splitTextToSize(listing.description, contentW);
  pdf.text(descLines, margin, y);
  y += descLines.length * 4.5 + 6;

  if (listing.descriptionAr) {
    pdf.setFontSize(12);
    pdf.setTextColor(30, 41, 59);
    pdf.text("Arabic Description", margin, y);
    y += 6;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    // Note: Arabic text rendering in jsPDF is limited
    pdf.text("(Arabic description available in the system)", margin, y);
    y += 10;
  }

  // Amenities
  if (listing.amenities.length > 0) {
    if (y > 260) { pdf.addPage(); y = margin; }
    pdf.setFontSize(12);
    pdf.setTextColor(30, 41, 59);
    pdf.text("Amenities", margin, y);
    y += 6;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text(listing.amenities.join("  •  "), margin, y);
    y += 10;
  }

  // Agent & Owner
  if (y > 240) { pdf.addPage(); y = margin; }
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(margin, y, contentW, 30, 3, 3, "F");
  y += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(30, 41, 59);
  pdf.text("Listing Agent", margin + 5, y);
  pdf.text("Admin", margin + contentW / 2, y);
  y += 6;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text(listing.listingAgent, margin + 5, y);
  pdf.text(listing.owner, margin + contentW / 2, y);
  y += 5;
  pdf.text("Agent", margin + 5, y);
  pdf.text(listing.ownerPhone, margin + contentW / 2, y);

  // Portal status
  y += 15;
  if (y > 270) { pdf.addPage(); y = margin; }
  pdf.setFontSize(10);
  pdf.setTextColor(30, 41, 59);
  pdf.text("Portal Status", margin, y);
  y += 6;
  pdf.setFontSize(9);
  const portals = [
    `Property Finder: ${listing.portals.pf ? "Active" : "Inactive"}`,
    `Bayut: ${listing.portals.bayut ? "Active" : "Inactive"}`,
    `Website: ${listing.portals.website ? "Active" : "Inactive"}`,
  ];
  pdf.setTextColor(100, 116, 139);
  pdf.text(portals.join("   •   "), margin, y);

  // Footer
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(180, 180, 180);
    pdf.text(`${listing.reference} — Generated on ${new Date().toLocaleDateString()}`, margin, 290);
    pdf.text(`Page ${i} of ${pages}`, pageW - margin, 290, { align: "right" });
  }

  pdf.save(`${listing.reference}.pdf`);
}
