import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
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
  useDeleteDeveloperMutation
} = settingsApi;
