import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface SettingsState {
  companyName: string;
  logo: string;
  lastUpdated: number;
  bitrix_webhook: string;
  pf_api_key: string;
  pf_api_secret: string;
  bayut_api_key: string;
  bayut_lead_source_whatsapp: string;
  bayut_lead_source_email: string;
  bayut_lead_source_phone: string;
  pf_lead_source_whatsapp: string;
  pf_lead_source_email: string;
  pf_lead_source_phone: string;
}

const initialState: SettingsState = {
  companyName: '',
  logo: '',
  lastUpdated: Date.now(),
  bitrix_webhook: '',
  pf_api_key: '',
  pf_api_secret: '',
  bayut_api_key: '',
  bayut_lead_source_whatsapp: '',
  bayut_lead_source_email: '',
  bayut_lead_source_phone: '',
  pf_lead_source_whatsapp: '',
  pf_lead_source_email: '',
  pf_lead_source_phone: '',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCompanySettings: (state, action: PayloadAction<any>) => {
      state.companyName = action.payload.company_name;
      state.logo = action.payload.logo;
      state.bitrix_webhook = action.payload.bitrix_webhook || '';
      state.pf_api_key = action.payload.pf_api_key || '';
      state.pf_api_secret = action.payload.pf_api_secret || '';
      state.bayut_api_key = action.payload.bayut_api_key || '';
      state.bayut_lead_source_whatsapp = action.payload.bayut_lead_source_whatsapp || '';
      state.bayut_lead_source_email = action.payload.bayut_lead_source_email || '';
      state.bayut_lead_source_phone = action.payload.bayut_lead_source_phone || '';
      state.pf_lead_source_whatsapp = action.payload.pf_lead_source_whatsapp || '';
      state.pf_lead_source_email = action.payload.pf_lead_source_email || '';
      state.pf_lead_source_phone = action.payload.pf_lead_source_phone || '';
      state.lastUpdated = Date.now();
    },
  },
});

export const { setCompanySettings } = settingsSlice.actions;

export default settingsSlice.reducer;

export const selectCompanyName = (state: RootState) => state.settings.companyName;
export const selectCompanyLogo = (state: RootState) => state.settings.logo;
export const selectSettingsLastUpdated = (state: RootState) => state.settings.lastUpdated;
export const selectBitrixWebhook = (state: RootState) => state.settings.bitrix_webhook;
export const selectPfApiKey = (state: RootState) => state.settings.pf_api_key;
export const selectPfApiSecret = (state: RootState) => state.settings.pf_api_secret;
export const selectBayutApiKey = (state: RootState) => state.settings.bayut_api_key;
export const selectBayutLeadSourceWhatsapp = (state: RootState) => state.settings.bayut_lead_source_whatsapp;
export const selectBayutLeadSourceEmail = (state: RootState) => state.settings.bayut_lead_source_email;
export const selectBayutLeadSourcePhone = (state: RootState) => state.settings.bayut_lead_source_phone;
export const selectPfLeadSourceWhatsapp = (state: RootState) => state.settings.pf_lead_source_whatsapp;
export const selectPfLeadSourceEmail = (state: RootState) => state.settings.pf_lead_source_email;
export const selectPfLeadSourcePhone = (state: RootState) => state.settings.pf_lead_source_phone;
