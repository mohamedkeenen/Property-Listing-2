"use client";

import { jsPDF } from "jspdf";

export const generateSalesOfferPDF = async (formData: any, images: any) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [61, 84, 52];
  };

  const primaryColor = hexToRgb(formData.themeColor || "#3D5434") as [number, number, number];
  const beigeColor = [249, 247, 240] as [number, number, number];

  const addFooter = (pageNum: number) => {
    const footerH = 12;

    doc.setFillColor(...primaryColor);
    doc.rect(0, pageHeight - footerH, pageWidth, footerH, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");

    const date = new Date().toLocaleString("en-GB", { 
      day: '2-digit', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });

    const ref = formData.referenceToken || "SOF-6-588413-8005a5f3-524e-42ca-bbc8-318c0523e73f";

    doc.text(`Print Date: ${date}`, 15, pageHeight - 5);
    doc.text(formData.website || "www.binghatti.com", pageWidth / 2, pageHeight - 7, { align: "center" });
    doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 3, { align: "center" });
    doc.text(ref, pageWidth - 15, pageHeight - 5, { align: "right" });
  };

  const addImage = (img: string, x: number, y: number, w: number, h: number) => {
    const format = img.includes("png") ? "PNG" : "JPEG";
    doc.addImage(img, format, x, y, w, h);
  };

  const drawBackground = () => {
    doc.setFillColor(...beigeColor);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  };

  // ================= PAGE 1 (COVER) =================
  if (images.cover) {
    addImage(images.cover, 0, 0, pageWidth, pageHeight);
  }

  // Cinematic Dark Overlay
  doc.setFillColor(0, 0, 0);
  (doc as any).setGState(new (doc as any).GState({ opacity: 0.25 }));
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  (doc as any).setGState(new (doc as any).GState({ opacity: 1.0 }));

  doc.setTextColor(255, 255, 255);
  
  // Project Header Label
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("PROJECT", pageWidth / 2, 45, { align: "center" });

  // Project Name Split (First word Light, Rest Bold)
  const projRaw = (formData.projectName || "PROJECT").toUpperCase();
  const words = projRaw.split(/\s+/);
  doc.setFontSize(36);
  
  if (words.length >= 2) {
    const w1 = words[0];
    const wRest = words.slice(1).join(" ");
    
    doc.setFont("helvetica", "normal");
    const fw = doc.getTextWidth(w1);
    doc.setFont("helvetica", "bold");
    const sw = doc.getTextWidth(" " + wRest);
    const tw = fw + sw;
    
    const sx = (pageWidth - tw) / 2;
    doc.setFont("helvetica", "normal");
    doc.text(w1, sx, 60);
    doc.setFont("helvetica", "bold");
    doc.text(" " + wRest, sx + fw, 60);
  } else {
    doc.setFont("helvetica", "bold");
    doc.text(projRaw, pageWidth / 2, 60, { align: "center" });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text((formData.title || "PREMIUM RESIDENCE").toUpperCase(), pageWidth / 2, 75, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("SALES OFFER", pageWidth / 2, pageHeight - 40, { align: "center" });

  // ================= PAGE 2 (INFORMATION SHEET) =================
  doc.addPage();
  drawBackground();

  // Banner
  if (images.banner) {
    addImage(images.banner, 15, 15, pageWidth - 30, 45);
    
    // Banner Overlays
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(projRaw, 25, 38);
    
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...primaryColor);
    doc.roundedRect(25, 43, 40, 6, 1, 1, "FD");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATION SHEET", 45, 47, { align: "center" });
  }

  const drawSpecRow = (y: number, label: string, value: string) => {
    // Header (Green)
    doc.setFillColor(...primaryColor);
    doc.rect(20, y, 60, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(label, 25, y + 6.5);

    // Value (White)
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(180, 180, 180);
    doc.rect(80, y, pageWidth - 100, 10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(value || "-", 85, y + 6.5);
  };

  let sy = 75;
  drawSpecRow(sy, "Developer Name :", formData.developerName); sy += 10;
  drawSpecRow(sy, "Project Name :", formData.projectName); sy += 10;
  drawSpecRow(sy, "Location :", formData.location); sy += 10;
  drawSpecRow(sy, "Property Type :", formData.propertyType); sy += 10;
  drawSpecRow(sy, "Unit Number :", formData.unitNumber); sy += 10;
  drawSpecRow(sy, "No. of Bedroom:", formData.bedrooms); sy += 10;
  drawSpecRow(sy, "Level :", formData.level); sy += 10;
  drawSpecRow(sy, "Average Unit Area (SQ.FT) :", formData.unitArea + " (SQ.FT)"); sy += 10;
  drawSpecRow(sy, "Selling Price :", formData.sellingPrice + " AED");

  // Agent Section
  let ay = sy + 15;
  const drawAgentRow = (y: number, label: string, value: string) => {
    doc.setFillColor(...primaryColor);
    doc.rect(20, y, 50, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(label, 25, y + 9);

    doc.setFillColor(255, 255, 255);
    doc.rect(70, y, pageWidth - 90, 15);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(value || "-", 75, y + 9);
  };

  drawAgentRow(ay, "Sales Consultant :", formData.salesConsultant);
  ay += 15;
  drawAgentRow(ay, "Head of Sales :", formData.headOfSales);

  doc.text(`Subject to Terms and Conditions in the Sales and Purchasing Agreement*`, pageWidth / 2, ay + 35, { align: "center" });

  // ================= PAGE 3 (HIGHLIGHTS) =================
  doc.addPage();
  drawBackground();

  // Project Header
  doc.setTextColor(...primaryColor);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(projRaw, pageWidth / 2, 30, { align: "center" });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text((formData.title || "LOCATION").toUpperCase(), pageWidth / 2, 40, { align: "center" });

  // Two Images Stacked
  const highlights = images.highlights.filter(Boolean).slice(0, 2);
  highlights.forEach((img: string, i: number) => {
    addImage(img, 20, 55 + i * 85, pageWidth - 40, 75);
  });

  // Footer Disclaimer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(6);
  doc.text(`Subject to Terms and Conditions in the Sales and Purchasing Agreement*`, pageWidth / 2, pageHeight - 20, { align: "center" });

  // ================= PAGE 4 (FLOOR PLAN) =================
  doc.addPage();
  drawBackground();

  // 1. Banner (Consistent Branding)
  if (images.banner) {
    addImage(images.banner, 15, 15, pageWidth - 30, 45);
    
    // Banner Overlays
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(projRaw, 25, 38);
    
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...primaryColor);
    doc.roundedRect(25, 43, 40, 6, 1, 1, "FD");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATION SHEET", 45, 47, { align: "center" });
  }

  // 2. Technical Data Section
  let fy = 82;
  
  // Floor Number (Prominent)
  doc.setTextColor(...primaryColor);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Floor Number :", 25, fy);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(String(formData.level || "-"), 85, fy);
  
  fy += 22;

  // Areas
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Suite Area:", 25, fy);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`${formData.suiteArea || formData.unitArea || "-"} (SQ.FT)`, 75, fy);
  
  fy += 10;
  doc.setTextColor(...primaryColor);
  doc.text("Terrace:", 25, fy);
  doc.setTextColor(0, 0, 0);
  doc.text(`${formData.terraceArea || "0.00"} (SQ.FT)`, 75, fy);

  fy += 4;
  // Thick Separator Line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1.2);
  doc.line(25, fy, 135, fy);
  
  fy += 10;
  doc.setTextColor(...primaryColor);
  doc.text("Total Area :", 25, fy);
  doc.setTextColor(0, 0, 0);
  doc.text(`${formData.totalArea || "-"} (SQ.FT)`, 75, fy);

  // 3. Floor Plan Image Box
  if (images.unitDetail) {
    const imgY = fy + 12;
    const imgH = pageHeight - imgY - 45; 
    
    // Aesthetic Box for Image
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    doc.rect(15, imgY - 5, pageWidth - 30, imgH + 10, "FD");
    
    addImage(images.unitDetail, 20, imgY, pageWidth - 40, imgH);
  }

  // Disclaimer & Expiry
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 1);
  const expiryStr = expiryDate.toLocaleString("en-GB", {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Subject to Terms and Conditions in the Sales and Purchasing Agreement*`, pageWidth / 2, pageHeight - 30, { align: "center" });
  
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Notes:`, 25, pageHeight - 24);
  doc.text(`This offer will expire on ${expiryStr} .`, 25, pageHeight - 20);



  // ================= PAGE 5 (FINANCIALS) =================
  doc.addPage();
  drawBackground();

  // 1. Banner (Consistent Branding)
  if (images.banner) {
    addImage(images.banner, 15, 15, pageWidth - 30, 45);
    
    // Banner Overlays
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(projRaw, 25, 38);
    
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...primaryColor);
    doc.roundedRect(25, 43, 40, 6, 1, 1, "FD");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATION SHEET", 45, 47, { align: "center" });
  }

  const drawStyledTable = (startY: number, title: string, headers: string[], rows: any[], colWidths: number[]) => {
    let y = startY;
    const rowH = 8;
    
    // Section Title
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, y, { align: "center" });
    y += 10;

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(15, y, pageWidth - 30, rowH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    
    let curX = 15;
    headers.forEach((h, i) => {
      doc.text(h, curX + 5, y + 5.5);
      curX += colWidths[i];
    });
    
    y += rowH;

    // Rows
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    rows.forEach((row) => {
      const isTotal = String(row[0]).includes("Total");
      
      if (isTotal) {
        doc.setFillColor(...primaryColor);
        doc.setGState(new (doc as any).GState({ opacity: 0.9 }));
        doc.rect(15, y, pageWidth - 30, rowH, "F");
        doc.setGState(new (doc as any).GState({ opacity: 1.0 }));
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
      } else {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.1);
        doc.rect(15, y, pageWidth - 30, rowH);
      }
      
      let rowX = 15;
      row.forEach((cell: any, cIdx: number) => {
        const text = String(cell || "-");
        // Right align prices
        const align = (headers[cIdx] === "Amount" || headers[cIdx] === "Price") ? "right" : "left";
        const xPos = align === "right" ? rowX + colWidths[cIdx] - 5 : rowX + 5;
        doc.text(text, xPos, y + 5.5, { align });
        rowX += colWidths[cIdx];
      });
      y += rowH;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
    });
    
    return y;
  };

  // Pre-Registration
  const preRegRows = [
    ["DLD Charges", formData.preReg.dld.date, formData.preReg.dld.percentage, formData.preReg.dld.amount + " AED"],
    ["Administration Fee", formData.preReg.admin.date, formData.preReg.admin.percentage, formData.preReg.admin.amount + " AED"],
  ];
  const dldNum = parseFloat(formData.preReg.dld.amount.replace(/,/g, '')) || 0;
  const adminNum = parseFloat(formData.preReg.admin.amount.replace(/,/g, '')) || 0;
  preRegRows.push(["Total", "", "", (dldNum + adminNum).toLocaleString(undefined, { minimumFractionDigits: 2 }) + " AED"]);

  let py = drawStyledTable(75, "PRE - REGISTRATION", ["Description", "Date", "Percentage", "Amount"], preRegRows, [50, 45, 40, 45]);

  // Payment Plan
  const payRows = formData.paymentPlan.map((r: any) => [r.date, r.installment, r.percentage, r.price + " AED"]);
  const totalPay = formData.paymentPlan.reduce((acc: number, r: any) => acc + (parseFloat(r.price.replace(/,/g, '')) || 0), 0);
  payRows.push(["Total", "", "100.00%", totalPay.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " AED"]);

  drawStyledTable(py + 15, "PAYMENT PLAN", ["Date", "Installment", "Percentage%", "Price"], payRows, [45, 55, 35, 45]);


  // ================= FINALIZE =================
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i);
  }

  doc.save(`${projRaw.replace(/\s+/g, '-')}-Sales-Offer.pdf`);
};
