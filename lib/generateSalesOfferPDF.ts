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
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true
    });

    const ref = formData.referenceToken

    doc.text(`Print Date: ${date}`, 15, pageHeight - 5);
    doc.text(formData.website || "www.binghatti.com", pageWidth / 2, pageHeight - 7, { align: "center" });
    doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 3, { align: "center" });
    doc.text(ref, pageWidth - 15, pageHeight - 5, { align: "right" });
  };

  const addImage = (img: string, x: number, y: number, w: number, h: number) => {
    let format = "JPEG";
    
    if (img.startsWith("data:image/")) {
      const detected = img.split(";")[0].split("/")[1]?.toUpperCase();
      if (detected === "PNG") format = "PNG";
      else if (detected === "WEBP") format = "WEBP";
    } else {
      // Clean URL from query params for extension check
      const cleanUrl = img.split("?")[0].toLowerCase();
      if (cleanUrl.endsWith(".png")) format = "PNG";
      else if (cleanUrl.endsWith(".webp")) format = "WEBP";
    }

    try {
      doc.addImage(img, format, x, y, w, h, undefined, 'MEDIUM');
    } catch (e) {
      console.warn(`Failed to add image with format ${format}, retrying as JPEG...`, e);
      try {
        doc.addImage(img, "JPEG", x, y, w, h, undefined, 'MEDIUM');
      } catch (err) {
        console.error("Image addition failed completely:", err);
      }
    }
  };

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

  const getCroppedImage = async (imgUrl: string, targetRatio: number, addGradient: boolean = false) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(imgUrl); return; }

        const imgRatio = img.width / img.height;
        let sw, sh, sx, sy;

        if (imgRatio > targetRatio) {
          sh = img.height;
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = img.width / targetRatio;
          sx = 0;
          sy = (img.height - sh) / 2;
        }

        canvas.width = sw;
        canvas.height = sh;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        if (addGradient) {
          // Horizontal Gradient from Right to Left using primary color components
          const gradient = ctx.createLinearGradient(sw, 0, 0, 0); 
          const r = primaryColor[0];
          const g = primaryColor[1];
          const b = primaryColor[2];
          
          gradient.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
          gradient.addColorStop(0.4, `rgba(${r},${g},${b},0.3)`);
          gradient.addColorStop(1, "rgba(0,0,0,0)");
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, sw, sh);
        }

        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = () => resolve(imgUrl);
      img.src = imgUrl;
    });
  };

  const drawBackground = () => {
    doc.setFillColor(...beigeColor);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  };

  // ================= PAGE 1 (COVER) =================
  if (images.cover) {
    const croppedCover = await getCroppedImage(images.cover, pageWidth / pageHeight);
    addImage(croppedCover, 0, 0, pageWidth, pageHeight);
  }

  // Company Logo on Cover
  if (images.logo) {
    addImage(images.logo, 15, 15, 30, 30);
  }

  // Cinematic Dark Overlay
  doc.setFillColor(0, 0, 0);
  const GState = (doc as any).GState;
  if (GState) {
    (doc as any).setGState(new GState({ opacity: 0.25 }));
  }
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  if (GState) {
    (doc as any).setGState(new GState({ opacity: 1.0 }));
  }

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
    const croppedBanner = await getCroppedImage(images.banner, (pageWidth - 30) / 45, true);
    addImage(croppedBanner, 15, 15, pageWidth - 30, 45);
    
    // Logo next to banner if banner exists
    if (images.logo) {
        // Draw a small white circle or box behind the logo for visibility
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - 45, 20, 25, 25, 2, 2, "F");
        addImage(images.logo, pageWidth - 42.5, 22.5, 20, 20);
    }
    
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
  drawSpecRow(sy, "Client Name :", formData.clientName); sy += 10;
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
  const allHighlights = (images.highlights || []).filter(Boolean);
  for (let i = 0; i < allHighlights.length; i++) {
    const img = allHighlights[i];
    // Every 2 images, move to new page
    if (i > 0 && i % 2 === 0) {
       doc.addPage();
       drawBackground();
       doc.setTextColor(...primaryColor);
       doc.setFontSize(22); doc.setFont("helvetica", "bold");
       doc.text(projRaw, pageWidth / 2, 30, { align: "center" });
    }
    const idx = i % 2;
    const hRatio = (pageWidth - 40) / 100;
    const croppedHighlight = await getCroppedImage(img, hRatio);
    addImage(croppedHighlight, 20, 55 + idx * 110, pageWidth - 40, 100);
  }

  // Footer Disclaimer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(6);
  doc.text(`Subject to Terms and Conditions in the Sales and Purchasing Agreement*`, pageWidth / 2, pageHeight - 20, { align: "center" });

  // ================= PAGE 4 (FLOOR PLAN) =================
  doc.addPage();
  drawBackground();

  // 1. Banner (Consistent Branding)
  if (images.banner) {
    const croppedBannerPage4 = await getCroppedImage(images.banner, (pageWidth - 30) / 45, true);
    addImage(croppedBannerPage4, 15, 15, pageWidth - 30, 45);
    
    // Logo next to banner if banner exists
    if (images.logo) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - 45, 20, 25, 25, 2, 2, "F");
        addImage(images.logo, pageWidth - 42.5, 22.5, 20, 20);
    }
    
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
    
    // For unit detail (floor plans), we use object-fit: contain logic to avoid losing details
    const dimensions = await new Promise<{w: number, h: number}>(r => {
      const im = new Image(); im.onload = () => r({w: im.width, h: im.height}); im.onerror=() => r({w:0,h:0}); im.src = images.unitDetail;
    });

    if (dimensions.w > 0) {
      const imgRatio = dimensions.w / dimensions.h;
      const boxRatio = (pageWidth - 40) / imgH;
      let renderW, renderH, renderX, renderY;
      if (imgRatio > boxRatio) {
        renderW = pageWidth - 40;
        renderH = renderW / imgRatio;
        renderX = 20;
        renderY = imgY + (imgH - renderH) / 2;
      } else {
        renderH = imgH;
        renderW = imgH * imgRatio;
        renderX = 20 + ((pageWidth - 40) - renderW) / 2;
        renderY = imgY;
      }
      addImage(images.unitDetail, renderX, renderY, renderW, renderH);
    } else {
      addImage(images.unitDetail, 20, imgY, pageWidth - 40, imgH);
    }
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
    const croppedBannerPage5 = await getCroppedImage(images.banner, (pageWidth - 30) / 45, true);
    addImage(croppedBannerPage5, 15, 15, pageWidth - 30, 45);
    
    // Logo next to banner if banner exists
    if (images.logo) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - 45, 20, 25, 25, 2, 2, "F");
        addImage(images.logo, pageWidth - 42.5, 22.5, 20, 20);
    }
    
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
      
      const GStateInner = (doc as any).GState;
      if (isTotal && GStateInner) {
         doc.setFillColor(...primaryColor);
         (doc as any).setGState(new GStateInner({ opacity: 0.9 }));
         doc.rect(15, y, pageWidth - 30, rowH, "F");
         (doc as any).setGState(new GStateInner({ opacity: 1.0 }));
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
  const formatDate = (val: any) => {
    if (!val || val === "-" || String(val).trim() === "") return "-";
    try {
      const d = new Date(String(val));
      if (isNaN(d.getTime())) return String(val);
      return d.toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    } catch (e) {
      return String(val);
    }
  };

  const formatFin = (val: any) => {
    const num = parseFloat(String(val || "0").replace(/,/g, '')) || 0;
    return num.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " AED";
  };

  const preRegRows = [
    ["DLD Charges", formatDate(formData.preReg.dld.date), formData.preReg.dld.percentage, formatFin(formData.preReg.dld.amount)],
    ["Administration Fee", formatDate(formData.preReg.admin.date), formData.preReg.admin.percentage, formatFin(formData.preReg.admin.amount)],
  ];
  const dldNum = parseFloat(String(formData.preReg.dld.amount || "0").replace(/,/g, '')) || 0;
  const adminNum = parseFloat(String(formData.preReg.admin.amount || "0").replace(/,/g, '')) || 0;
  preRegRows.push(["Total", "", "", formatFin(dldNum + adminNum)]);

  let py = drawStyledTable(75, "PRE - REGISTRATION", ["Description", "Date", "Percentage", "Amount"], preRegRows, [50, 45, 40, 45]);

  // Payment Plan
  const payRows = (formData.paymentPlan || []).map((r: any) => [formatDate(r.date), r.installment, r.percentage, (r.price || "0") + " AED"]);
  const totalPay = (formData.paymentPlan || []).reduce((acc: number, r: any) => acc + (parseFloat(String(r.price || "0").replace(/,/g, '')) || 0), 0);
  payRows.push(["Total", "", "100.00%", totalPay.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " AED"]);

  drawStyledTable(py + 15, "PAYMENT PLAN", ["Date", "Installment", "Percentage%", "Price"], payRows, [45, 55, 35, 45]);


  // ================= PAGE 6 (AGENT DETAILS) =================
  if (formData.agentDetails) {
    doc.addPage();
    drawBackground();

    const agent = formData.agentDetails;
    
    // Header
    doc.setTextColor(...primaryColor);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("CONTACT CONSULTANT", pageWidth / 2, 40, { align: "center" });
    
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 20, 45, pageWidth / 2 + 20, 45);

    // Card background - Centered and more elegant
    const cardW = pageWidth - 60;
    const cardH = 60;
    const cardX = 30;
    const cardY = 65;
    
    // Subtle shadow / Border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(cardX, cardY, cardW, cardH, 5, 5, "FD");

    // Agent Image (Circular, Overlapping the Card edge)
    if (agent.image) {
      const imgSize = 50;
      const circleImg = await getCircularImage(agent.image);
      // Positioned so it's 50% outside the left edge of the card
      const imgX = cardX - (imgSize / 2);
      const imgY = cardY + (cardH - imgSize) / 2;
      
      // Draw a white circle background first for the overlap
      doc.setFillColor(255, 255, 255);
      doc.circle(imgX + imgSize/2, imgY + imgSize/2, imgSize/2 + 1, "F");
      
      addImage(circleImg, imgX, imgY, imgSize, imgSize);
    }

    // Agent Details (Right of the circular image)
    let dX = cardX + 35;
    let dY = cardY + 15;
    
    const drawAgentDetail = (label: string, value: string, iconY: number, type?: 'phone' | 'whatsapp' | 'email') => {
      doc.setTextColor(...primaryColor);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(label, dX, iconY);
      
      const labelW = doc.getTextWidth(label);
      const valX = dX + labelW + 2; 

      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.text(value || "-", valX, iconY);

      // Subtle Underline
      doc.setDrawColor(235, 235, 235);
      doc.setLineWidth(0.1);
      doc.line(dX, iconY + 2, dX + 110, iconY + 2);

      if (type && value && value !== "-") {
        let url = "";
        if (type === 'whatsapp') {
          const clean = value.replace(/\D/g, '');
          url = "https://wa.me/" + (clean.startsWith('0') ? '971' + clean.slice(1) : clean);
        } else if (type === 'phone') {
          url = "tel:" + value.trim();
        } else if (type === 'email') {
          url = "mailto:" + value.trim();
        }
        
        if (url) {
          // Make both label and value clickable
          const valueW = doc.getTextWidth(value);
          doc.link(dX, iconY - 5, labelW, 7, { url });
          doc.link(valX, iconY - 5, valueW, 7, { url });
        }
      }
    };

    drawAgentDetail("NAME:", agent.name, dY); dY += 10;
    drawAgentDetail("EMAIL:", agent.email, dY, 'email'); dY += 10;
    drawAgentDetail("PHONE:", agent.phone, dY, 'phone'); dY += 10;
    drawAgentDetail("WHATSAPP:", agent.whatsapp, dY, 'whatsapp');

    // Personal Message Section
    if (agent.notes) {
      let nY = cardY + cardH + 20;
      doc.setTextColor(...primaryColor);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("PERSONAL MESSAGE", cardX, nY);
      
      nY += 8;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(220, 220, 220);
      const noteBoxW = cardW;
      const noteBoxH = 50;
      doc.roundedRect(cardX, nY, noteBoxW, noteBoxH, 3, 3, "FD");

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const splitNotes = doc.splitTextToSize(agent.notes, noteBoxW - 10);
      doc.text(splitNotes, cardX + 5, nY + 10);
    }
  }

  // ================= FINALIZE =================
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1) continue; // Skip footer for the first page
    doc.setPage(i);
    addFooter(i);
  }

  doc.save(`${projRaw.replace(/\s+/g, '-')}-Sales-Offer.pdf`);
};
