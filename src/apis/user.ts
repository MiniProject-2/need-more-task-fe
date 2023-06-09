import { IJoin, ILogin, IUpdateProfile, IUpdateRole, IValidatePassword } from '@/type/authTypes';
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { axiosInstance, axiosWithToken } from '@/apis/configs';
import { useToast } from '@chakra-ui/react';

export const useUpdateProfileImageAPI = (options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>) => {
  const queryKey = `/user/profile`;
  const queryFn = (data: any) =>
    axiosInstance
      .post(queryKey, data, {
        headers: { 'Context-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};

export const joinAPI = (options?: UseMutationOptions<AxiosResponse<string>, AxiosError, IJoin>) => {
  const queryKey = `/join`;
  const queryFn = (data: IJoin) => axiosInstance.post(queryKey, data).then((res) => res.data);

  // const onSuccess = () => router.push('/join/complete');

  return useMutation([queryKey], queryFn, { ...options });
};

export const isDuplicatedEmailAPI = (options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>) => {
  const queryKey = `/email/validate`;
  const queryFn = (data: any) =>
    axiosInstance
      .post(queryKey, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};

export const loginAPI = (options?: UseMutationOptions<AxiosResponse<string>, AxiosError, ILogin>) => {
  const queryKey = `/login`;
  const queryFn = (data: ILogin) => axiosInstance.post(queryKey, data).then((res) => res);

  return useMutation([queryKey], queryFn, { ...options });
};

export const logoutAPI = (options?: UseMutationOptions<AxiosResponse<string>, AxiosError, any>) => {
  const queryKey = `/logout`;
  const queryFn = () => axiosWithToken.post(queryKey).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};

export const authMeAPI = (options?: UseQueryOptions<AxiosResponse<any>, AxiosError, any, string[]>) => {
  const queryKey = `/auth/me`;
  const queryFn = () => axiosWithToken.get(queryKey).then((res) => res.data);

  const onError = (error: AxiosError) => {
    console.error(error);
  };

  return useQuery([queryKey], queryFn, {
    staleTime: 1000 * 60 * 5, // 5분
    cacheTime: 1000 * 60 * 30, // 30분
    onError,
    ...options,
  });
};

export const getUserInfoAPI = (
  id?: string,
  options?: UseQueryOptions<AxiosResponse<any>, AxiosError, any, string[]>,
) => {
  const queryKey = `/user/${id}`;
  const queryFn = () => axiosWithToken.get(queryKey).then((res) => res.data);

  return useQuery([queryKey], queryFn, {
    staleTime: 600000,
    ...options,
  });
};

export const validatePasswordAPI = (
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, IValidatePassword>,
) => {
  const queryKey = `/password/validate`;
  const queryFn = (data: IValidatePassword) => axiosWithToken.post(queryKey, data).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};

export const updateUserInfoAPI = (
  userId: number,
  options?: UseMutationOptions<AxiosResponse<string>, AxiosError, IUpdateProfile>,
) => {
  const queryKey = `/user/${userId}`;
  const queryFn = (data: IUpdateProfile) => axiosWithToken.put(queryKey, data).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};

// role
export const updateRoleAPI = (options?: UseMutationOptions<AxiosResponse<string>, AxiosError, IUpdateRole>) => {
  const queryKey = `/admin/role`;
  const queryFn = (data: IUpdateRole) => axiosWithToken.put(queryKey, data).then((res) => res.data);

  return useMutation([queryKey], queryFn, { ...options });
};
