import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
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
  tagTypes: ['Property'],
  endpoints: (builder) => ({
    getProperties: builder.query<any, any>({
      query: (params) => ({
        url: '/properties',
        params: params || {},
      }),
      providesTags: ['Property'],
    }),
    getProperty: builder.query<any, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    createProperty: builder.mutation<any, any>({
      query: (newProperty) => ({
        url: '/properties',
        method: 'POST',
        body: newProperty,
      }),
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Property', { type: 'Property', id }],
    }),
    deleteProperty: builder.mutation<any, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Property'],
    }),
    togglePortal: builder.mutation<any, { id: number | string; portal: string; status: boolean }>({
      query: ({ id, portal, status }) => ({
        url: `/properties/${id}/toggle-portal`,
        method: 'POST',
        body: { portal, status },
      }),
      invalidatesTags: (result, error, { id }) => ['Property', { type: 'Property', id }],
    }),
    syncBitrix: builder.mutation<any, void>({
      query: () => ({
        url: '/properties/sync-bitrix',
        method: 'POST',
      }),
      invalidatesTags: ['Property'],
    }),
    searchPropQALocations: builder.query<any, string>({
      query: (search) => ({
        url: '/propqa/locations',
        params: { search },
      }),
    }),
    searchPFLocations: builder.query<any, string>({
      query: (search) => ({
        url: '/pf/locations',
        params: { search },
      }),
    }),
    getPFSubLocations: builder.query<any, string | number>({
      query: (id) => `/pf/locations/${id}/children`,
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useTogglePortalMutation,
  useSyncBitrixMutation,
  useSearchPropQALocationsQuery,
  useSearchPFLocationsQuery,
  useGetPFSubLocationsQuery,
} = propertyApi;
