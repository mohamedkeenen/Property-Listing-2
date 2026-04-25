import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../apiConfig';

export const userApi = createApi({
  reducerPath: 'userApi',
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

      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Agent'],
  endpoints: (builder) => ({
    getUsers: builder.query<any, { role?: string } | void>({
      query: (params) => ({
        url: '/users',
        params: params || {},
      }),
      providesTags: ['User'],
    }),
    getAgents: builder.query<any, { company_id?: number } | void>({
      query: (params) => ({
        url: '/agents',
        params: params || {},
      }),
      providesTags: ['Agent'],
    }),
    createAgent: builder.mutation<any, any>({
      query: (data) => ({
        url: '/agents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Agent', 'User'],
    }),
    updateAgent: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/agents/${id}`,
        method: 'POST', // Use POST for multipart form-data if photo is included, or handle in component
        body: data,
        params: { _method: 'PUT' }, // Laravel SPOOFING
      }),
      invalidatesTags: ['Agent', 'User'],
    }),
    deleteAgent: builder.mutation<any, number>({
      query: (id) => ({
        url: `/agents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Agent', 'User'],
    }),
    resendVerification: builder.mutation<any, number>({
      query: (id) => ({
        url: `/agents/${id}/resend-verification`,
        method: 'POST',
      }),
    }),
    getSuperUsers: builder.query<any, void>({
      query: () => '/super/users',
      providesTags: ['User'],
    }),
    toggleUserActive: builder.mutation<any, number>({
      query: (id) => ({
        url: `/super/users/${id}/toggle-active`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<any, number>({
      query: (id) => ({
        url: `/super/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useGetAgentsQuery, 
  useCreateAgentMutation, 
  useUpdateAgentMutation, 
  useDeleteAgentMutation,
  useResendVerificationMutation,
  useGetSuperUsersQuery,
  useToggleUserActiveMutation,
  useDeleteUserMutation
} = userApi;

