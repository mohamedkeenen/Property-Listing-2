import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const salesOfferApi = createApi({
  reducerPath: 'salesOfferApi',
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
  tagTypes: ['SalesOffer'],
  endpoints: (builder) => ({
    getSalesOffers: builder.query<{ data: any[] }, void>({
      query: () => '/sales-offers',
      providesTags: ['SalesOffer'],
    }),
    getSalesOfferDetail: builder.query<{ data: any, mapped: any }, string | number>({
      query: (id) => `/sales-offers/${id}`,
    }),
  }),
});

export const { 
  useGetSalesOffersQuery, 
  useGetSalesOfferDetailQuery,
  useLazyGetSalesOfferDetailQuery
} = salesOfferApi;
