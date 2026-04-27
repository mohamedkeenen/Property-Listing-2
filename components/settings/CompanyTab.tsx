"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCompanyName, selectCompanyLogo, selectSettingsLastUpdated,  selectBitrixWebhook, selectListingWebhook, selectPfApiKey, selectPfApiSecret, selectBayutApiKey, selectBayutLeadSourceWhatsapp, selectBayutLeadSourceEmail, selectBayutLeadSourcePhone, selectPfLeadSourceWhatsapp, selectPfLeadSourceEmail, selectPfLeadSourcePhone, selectSalesOfferWebhook, selectSalesOfferEntityTypeId, selectOutboundHandlerToken, selectPdfColor, selectWebsiteLink, selectCompanyBanner, selectCompanyLogoPdf, selectWatermarkSize, selectWatermarkOpacity, selectCoverImage, selectProjectImage1, selectProjectImage2, setCompanySettings } from "@/api/redux/slices/settingsSlice";
import { useUpdateCompanySettingsMutation } from "@/api/redux/services/settingsApi";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "@/api/redux/apiConfig";
import { CompanyInfoSection } from "./company-tab-sections/CompanyInfoSection";
import { IntegrationSection } from "./company-tab-sections/IntegrationSection";
import { BrandingSection } from "./company-tab-sections/BrandingSection";

interface CompanyTabProps {
  isAdmin: boolean;
  isSupervisor?: boolean;
}

export function CompanyTab({ isAdmin, isSupervisor }: CompanyTabProps) {
  const dispatch = useDispatch();
  const reduxCompanyName = useSelector(selectCompanyName);
  const reduxLogo = useSelector(selectCompanyLogo);
  const reduxBitrixWebhook = useSelector(selectBitrixWebhook);
  const reduxListingWebhook = useSelector(selectListingWebhook);
  const reduxPfApiKey = useSelector(selectPfApiKey);
  const reduxPfApiSecret = useSelector(selectPfApiSecret);
  const reduxBayutApiKey = useSelector(selectBayutApiKey);
  const reduxBayutLeadSourceWhatsapp = useSelector(selectBayutLeadSourceWhatsapp);
  const reduxBayutLeadSourceEmail = useSelector(selectBayutLeadSourceEmail);
  const reduxBayutLeadSourcePhone = useSelector(selectBayutLeadSourcePhone);
  const reduxPfLeadSourceWhatsapp = useSelector(selectPfLeadSourceWhatsapp);
  const reduxPfLeadSourceEmail = useSelector(selectPfLeadSourceEmail);
  const reduxPfLeadSourcePhone = useSelector(selectPfLeadSourcePhone);
  const settingsLastUpdated = useSelector(selectSettingsLastUpdated);
  const reduxSalesOfferWebhook = useSelector(selectSalesOfferWebhook);
  const reduxSalesOfferEntityTypeId = useSelector(selectSalesOfferEntityTypeId);
  const reduxPdfColor = useSelector(selectPdfColor);
  const reduxWebsiteLink = useSelector(selectWebsiteLink);
  const reduxBanner = useSelector(selectCompanyBanner);
  const reduxLogoPdf = useSelector(selectCompanyLogoPdf);
  const reduxWatermarkSize = useSelector(selectWatermarkSize);
  const reduxWatermarkOpacity = useSelector(selectWatermarkOpacity);
  const reduxCoverImage = useSelector(selectCoverImage);
  const reduxProjectImage1 = useSelector(selectProjectImage1);
  const reduxProjectImage2 = useSelector(selectProjectImage2);
  
  const [companyName, setCompanyName] = useState(reduxCompanyName);
  const [logo, setLogo] = useState<string>(reduxLogo);
  const [logoPdf, setLogoPdf] = useState<string>(reduxLogoPdf);
  const [bitrixWebhook, setBitrixWebhook] = useState(reduxBitrixWebhook);
  const [listingWebhook, setListingWebhook] = useState(reduxListingWebhook);
  const [pfApiKey, setPfApiKey] = useState(reduxPfApiKey);
  const [pfApiSecret, setPfApiSecret] = useState(reduxPfApiSecret);
  const [bayutApiKey, setBayutApiKey] = useState(reduxBayutApiKey);
  const [bayutLeadSourceWhatsapp, setBayutLeadSourceWhatsapp] = useState(reduxBayutLeadSourceWhatsapp);
  const [bayutLeadSourceEmail, setBayutLeadSourceEmail] = useState(reduxBayutLeadSourceEmail);
  const [bayutLeadSourcePhone, setBayutLeadSourcePhone] = useState(reduxBayutLeadSourcePhone);
  const [pfLeadSourceWhatsapp, setPfLeadSourceWhatsapp] = useState(reduxPfLeadSourceWhatsapp);
  const [pfLeadSourceEmail, setPfLeadSourceEmail] = useState(reduxPfLeadSourceEmail);
  const [pfLeadSourcePhone, setPfLeadSourcePhone] = useState(reduxPfLeadSourcePhone);
  const [salesOfferWebhook, setSalesOfferWebhook] = useState(reduxSalesOfferWebhook);
  const [salesOfferEntityTypeId, setSalesOfferEntityTypeId] = useState(reduxSalesOfferEntityTypeId);
  const [pdfColor, setPdfColor] = useState(reduxPdfColor);
  const [websiteLink, setWebsiteLink] = useState(reduxWebsiteLink);
  const [banner, setBanner] = useState<string>(reduxBanner);
  const [watermarkSize, setWatermarkSize] = useState(reduxWatermarkSize);
  const [watermarkOpacity, setWatermarkOpacity] = useState(reduxWatermarkOpacity);
  const [coverImage, setCoverImage] = useState<string>(reduxCoverImage);
  const [projectImage1, setProjectImage1] = useState<string>(reduxProjectImage1);
  const [projectImage2, setProjectImage2] = useState<string>(reduxProjectImage2);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateSettings, { isLoading }] = useUpdateCompanySettingsMutation();

  useEffect(() => {
    setCompanyName(reduxCompanyName || "");
    setLogo(reduxLogo || "");
    setBitrixWebhook(reduxBitrixWebhook || "");
    setListingWebhook(reduxListingWebhook || "");
    setPfApiKey(reduxPfApiKey || "");
    setPfApiSecret(reduxPfApiSecret || "");
    setBayutApiKey(reduxBayutApiKey || "");
    setBayutLeadSourceWhatsapp(reduxBayutLeadSourceWhatsapp || "");
    setBayutLeadSourceEmail(reduxBayutLeadSourceEmail || "");
    setBayutLeadSourcePhone(reduxBayutLeadSourcePhone || "");
    setPfLeadSourceWhatsapp(reduxPfLeadSourceWhatsapp || "");
    setPfLeadSourceEmail(reduxPfLeadSourceEmail || "");
    setPfLeadSourcePhone(reduxPfLeadSourcePhone || "");
    setSalesOfferWebhook(reduxSalesOfferWebhook || "");
    setSalesOfferEntityTypeId(reduxSalesOfferEntityTypeId || "");
    setPdfColor(reduxPdfColor || "#3D5434");
    setWebsiteLink(reduxWebsiteLink || "");
    setBanner(reduxBanner || "");
    setLogoPdf(reduxLogoPdf || "");
    setWatermarkSize(reduxWatermarkSize || 5);
    setWatermarkOpacity(reduxWatermarkOpacity || 5);
    setCoverImage(reduxCoverImage || "");
    setProjectImage1(reduxProjectImage1 || "");
    setProjectImage2(reduxProjectImage2 || "");
  }, [
    reduxCompanyName, 
    reduxLogo, 
    reduxBitrixWebhook, 
    reduxListingWebhook,
    reduxPfApiKey, 
    reduxPfApiSecret, 
    reduxBayutApiKey,
    reduxBayutLeadSourceWhatsapp,
    reduxBayutLeadSourceEmail,
    reduxBayutLeadSourcePhone,
    reduxPfLeadSourceWhatsapp,
    reduxPfLeadSourceEmail,
    reduxPfLeadSourcePhone,
    reduxSalesOfferEntityTypeId,
    reduxPdfColor,
    reduxWebsiteLink,
    reduxBanner,
    reduxLogoPdf,
    reduxWatermarkSize,
    reduxWatermarkOpacity,
    reduxCoverImage,
    reduxProjectImage1,
    reduxProjectImage2
  ]);

  const getLogoUrl = (logoStr: string) => {
    if (!logoStr) return "";
    if (logoStr.startsWith('http') || logoStr.startsWith('data:image')) return logoStr;
    return `${API_BASE_URL}/storage/${logoStr}?v=${settingsLastUpdated}`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("You do not have permission to update settings.");
      return;
    }
    try {
      const result = await updateSettings({
        company_name: companyName,
        logo: logo,
        bitrix_webhook: bitrixWebhook,
        listing_webhook: listingWebhook,
        pf_api_key: pfApiKey,
        pf_api_secret: pfApiSecret,
        bayut_api_key: bayutApiKey,
        bayut_lead_source_whatsapp: bayutLeadSourceWhatsapp,
        bayut_lead_source_email: bayutLeadSourceEmail,
        bayut_lead_source_phone: bayutLeadSourcePhone,
        pf_lead_source_whatsapp: pfLeadSourceWhatsapp,
        pf_lead_source_email: pfLeadSourceEmail,
        pf_lead_source_phone: pfLeadSourcePhone,
        sales_offer_webhook: salesOfferWebhook,
        sales_offer_entity_type_id: salesOfferEntityTypeId,
        pdf_color: pdfColor,
        website_link: websiteLink,
        banner_image: banner,
        logo_pdf: logoPdf,
        watermark_size: watermarkSize,
        watermark_opacity: watermarkOpacity,
        cover_image: coverImage,
        project_image_1: projectImage1,
        project_image_2: projectImage2,
      }).unwrap();
      
      if (result.status === 'success') {
        dispatch(setCompanySettings(result.data));
        toast.success("Settings saved successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save settings");
    }
  };

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoPdfInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const projectImage1InputRef = useRef<HTMLInputElement>(null);
  const projectImage2InputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    if (!isAdmin) return;
    fileInputRef.current?.click();
  };

  const handleBannerClick = () => {
    if (!isAdmin) return;
    bannerInputRef.current?.click();
  };

  const handleLogoPdfClick = () => {
    if (!isAdmin) return;
    logoPdfInputRef.current?.click();
  };

  const handleCoverImageClick = () => {
    if (!isAdmin) return;
    coverImageInputRef.current?.click();
  };

  const handleProjectImage1Click = () => {
    if (!isAdmin) return;
    projectImage1InputRef.current?.click();
  };

  const handleProjectImage2Click = () => {
    if (!isAdmin) return;
    projectImage2InputRef.current?.click();
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoPdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPdf(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectImage1FileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectImage1(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectImage2FileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectImage2(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form id="settings-form" onSubmit={handleSave} className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4 space-y-8">
        <CompanyInfoSection 
          isAdmin={isAdmin}
          companyName={companyName}
          setCompanyName={setCompanyName}
        />

        {!isSupervisor && (
          <IntegrationSection 
            isAdmin={isAdmin}
            listingWebhook={listingWebhook}
            setListingWebhook={setListingWebhook}
            salesOfferWebhook={salesOfferWebhook}
            setSalesOfferWebhook={setSalesOfferWebhook}
            salesOfferEntityTypeId={salesOfferEntityTypeId}
            setSalesOfferEntityTypeId={setSalesOfferEntityTypeId}
            pfApiKey={pfApiKey}
            setPfApiKey={setPfApiKey}
            pfApiSecret={pfApiSecret}
            setPfApiSecret={setPfApiSecret}
            bayutApiKey={bayutApiKey}
            setBayutApiKey={setBayutApiKey}
          />
        )}
      </div>

      <div className="col-span-3">
        <BrandingSection 
          isAdmin={isAdmin}
          logo={logo}
          banner={banner}
          logoPdf={logoPdf}
          websiteLink={websiteLink}
          setWebsiteLink={setWebsiteLink}
          pdfColor={pdfColor}
          setPdfColor={setPdfColor}
          watermarkSize={watermarkSize}
          setWatermarkSize={setWatermarkSize}
          watermarkOpacity={watermarkOpacity}
          setWatermarkOpacity={setWatermarkOpacity}
          getLogoUrl={getLogoUrl}
          handleLogoClick={handleLogoClick}
          handleBannerClick={handleBannerClick}
          handleLogoPdfClick={handleLogoPdfClick}
          fileInputRef={fileInputRef}
          bannerInputRef={bannerInputRef}
          logoPdfInputRef={logoPdfInputRef}
          handleLogoFileChange={handleLogoFileChange}
          handleBannerFileChange={handleBannerFileChange}
          handleLogoPdfFileChange={handleLogoPdfFileChange}
          coverImage={coverImage}
          projectImage1={projectImage1}
          projectImage2={projectImage2}
          handleCoverImageClick={handleCoverImageClick}
          handleProjectImage1Click={handleProjectImage1Click}
          handleProjectImage2Click={handleProjectImage2Click}
          handleCoverImageFileChange={handleCoverImageFileChange}
          handleProjectImage1FileChange={handleProjectImage1FileChange}
          handleProjectImage2FileChange={handleProjectImage2FileChange}
          coverImageInputRef={coverImageInputRef}
          projectImage1InputRef={projectImage1InputRef}
          projectImage2InputRef={projectImage2InputRef}
        />
      </div>
    </form>
  );
}
