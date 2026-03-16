import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['CompanySettings'],
  endpoints: (builder) => ({
    getCompanySettings: builder.query<any, void>({
      query: () => '/settings/company',
      providesTags: ['CompanySettings'],
    }),
    updateCompanySettings: builder.mutation<any, any>({
      query: (data) => ({
        url: '/settings/company',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CompanySettings'],
    }),
  }),
});

export const { useGetCompanySettingsQuery, useUpdateCompanySettingsMutation } = settingsApi;
