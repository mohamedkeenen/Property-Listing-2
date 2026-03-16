import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface SettingsState {
  companyName: string;
  logo: string;
  lastUpdated: number;
}

const initialState: SettingsState = {
  companyName: 'Keen Enterprises',
  logo: 'https://res.cloudinary.com/devht0mp5/image/upload/v1771906074/logoo_hsovz7.jpg',
  lastUpdated: Date.now(),
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCompanySettings: (state, action: PayloadAction<{ company_name: string; logo: string }>) => {
      state.companyName = action.payload.company_name;
      state.logo = action.payload.logo;
      state.lastUpdated = Date.now();
    },
  },
});

export const { setCompanySettings } = settingsSlice.actions;

export default settingsSlice.reducer;

export const selectCompanyName = (state: RootState) => state.settings.companyName;
export const selectCompanyLogo = (state: RootState) => state.settings.logo;
export const selectSettingsLastUpdated = (state: RootState) => state.settings.lastUpdated;
