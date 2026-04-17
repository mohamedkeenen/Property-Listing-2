import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      // Standardize Bitrix headers for all requests
      if (typeof window !== 'undefined') {
        const bitrixDomain = localStorage.getItem("bitrix_domain");
        const bitrixAuthId = localStorage.getItem("bitrix_auth_id");
        
        if (bitrixDomain) headers.set('X-Bitrix-Domain', bitrixDomain);
        if (bitrixAuthId) headers.set('X-Bitrix-Auth-Id', bitrixAuthId);
      }

      return headers;
    },
  }),
  tagTypes: ['CompanySettings', 'Projects', 'Developers', 'CustomFields'],
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
    addProject: builder.mutation<any, { name: string }>({
      query: (data) => ({
        url: '/settings/projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Projects'],
    }),
    deleteProject: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/settings/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),
    getDevelopers: builder.query<any, void>({
      query: () => '/settings/developers',
      providesTags: ['Developers'],
    }),
    addDeveloper: builder.mutation<any, { name: string }>({
      query: (data) => ({
        url: '/settings/developers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Developers'],
    }),
    deleteDeveloper: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/settings/developers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Developers'],
    }),
    getCustomFields: builder.query<any, void>({
      query: () => '/custom-fields',
      providesTags: ['CustomFields'],
    }),
    addCustomField: builder.mutation<any, { name: string; type: string }>({
      query: (data) => ({
        url: '/custom-fields',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CustomFields'],
    }),
    deleteCustomField: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/custom-fields/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomFields'],
    }),
  }),
});

export const { 
  useGetCompanySettingsQuery, 
  useUpdateCompanySettingsMutation,
  useGetProjectsQuery,
  useAddProjectMutation,
  useDeleteProjectMutation,
  useGetDevelopersQuery,
  useAddDeveloperMutation,
  useDeleteDeveloperMutation,
  useGetCustomFieldsQuery,
  useAddCustomFieldMutation,
  useDeleteCustomFieldMutation
} = settingsApi;
