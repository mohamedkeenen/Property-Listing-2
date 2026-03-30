import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const salesOfferApi = createApi({
  reducerPath: 'salesOfferApi',
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
  tagTypes: ['SalesOffer'],
  endpoints: (builder) => ({
    getSalesOffers: builder.query<{ data: any[] }, void>({
      query: () => '/sales-offers',
      providesTags: ['SalesOffer'],
    }),
    getSalesOfferDetail: builder.query<{ data: any }, string | number>({
      query: (id) => `/sales-offers/${id}`,
    }),
  }),
});

export const { 
  useGetSalesOffersQuery, 
  useGetSalesOfferDetailQuery,
  useLazyGetSalesOfferDetailQuery
} = salesOfferApi;
