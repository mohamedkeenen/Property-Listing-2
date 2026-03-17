import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['CompanySettings', 'Projects', 'Developers'],
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
    getProjects: builder.query<any, void>({
      query: () => '/settings/projects',
      providesTags: ['Projects'],
    }),
    getDevelopers: builder.query<any, void>({
      query: () => '/settings/developers',
      providesTags: ['Developers'],
    }),
  }),
});

export const { 
  useGetCompanySettingsQuery, 
  useUpdateCompanySettingsMutation,
  useGetProjectsQuery,
  useGetDevelopersQuery
} = settingsApi;
