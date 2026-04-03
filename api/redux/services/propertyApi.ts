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
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} = propertyApi;
