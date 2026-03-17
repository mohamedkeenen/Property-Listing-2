import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Lead } from '@/data/mockData';

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
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
  tagTypes: ['Lead'],
  endpoints: (builder) => ({
    getLeads: builder.query<Lead[], void>({
      query: () => '/leads',
      providesTags: ['Lead'],
    }),
  }),
});

export const { useGetLeadsQuery } = leadsApi;
