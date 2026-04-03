import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
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
  tagTypes: ['Leads'],
  endpoints: (builder) => ({
    getLeads: builder.query<{ 
      leads: any[], 
      total: number, 
      stats: { total: number, new: number, qualified: number, lost: number } 
    }, { 
      page?: number, 
      limit?: number, 
      search?: string, 
      source?: string, 
      subSource?: string, 
      status?: string 
    }>({
      query: (params = {}) => ({
        url: '/leads',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 50,
          search: params?.search ?? '',
          source: params?.source ?? 'All',
          subSource: params?.subSource ?? 'All',
          status: params?.status ?? 'All Statuses',
        },
      }),
      providesTags: ['Leads'],
    }),
    syncLeads: builder.mutation<{ message: string, count: number }, void>({
      query: () => ({
        url: '/leads/sync',
        method: 'POST',
      }),
      invalidatesTags: ['Leads'],
    }),
  }),
});

export const { useGetLeadsQuery, useSyncLeadsMutation } = leadsApi;
