import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        headers.set('Accept', 'application/json');
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Employee'],
  endpoints: (builder) => ({
    getUsers: builder.query<any, { role?: string } | void>({
      query: (params) => ({
        url: '/users',
        params: params || {},
      }),
      providesTags: ['User'],
    }),
    getEmployees: builder.query<any, void>({
      query: () => '/employees',
      providesTags: ['Employee'],
    }),
    createEmployee: builder.mutation<any, any>({
      query: (data) => ({
        url: '/employees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employee', 'User'],
    }),
    updateEmployee: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: 'POST', // Use POST for multipart form-data if photo is included, or handle in component
        body: data,
        params: { _method: 'PUT' }, // Laravel SPOOFING
      }),
      invalidatesTags: ['Employee', 'User'],
    }),
    deleteEmployee: builder.mutation<any, number>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee', 'User'],
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useGetEmployeesQuery, 
  useCreateEmployeeMutation, 
  useUpdateEmployeeMutation, 
  useDeleteEmployeeMutation 
} = userApi;

