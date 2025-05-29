// src/api/user/userApi.ts

import { Axios } from '../Axios';

///////////////////////
// Request / Response 타입 정의
///////////////////////

export interface SignupRequest {
  nickname: string;
  name: string;
  email: string;
  password: string;
  gender: 'M' | 'F' | 'O';
  birth: string; // YYYY-MM-DD
  phoneNumber: string; // e.g. "010-1234-5678"
}

export interface SignupResult {
  id: string;
  nickname: string;
  email: string;
  point: number;
  ranking: {
    rank: number;
    tier: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    status: string;
  };
}

export interface UserInfoResult {
  id: string;
  email: string;
  nickname: string;
  name: string;
  status: string;
  profileImageUrl: string | null;
  createdAt: string; // YYYY-MM-DD
  updatedAt: string; // YYYY-MM-DD
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: T | null;
}

///////////////////////
// API 함수들
///////////////////////

export const signup = async (
  data: SignupRequest
): Promise<ApiResponse<SignupResult>> => {
  const response = await Axios.post<ApiResponse<SignupResult>>(
    '/users/signup',
    data
  );
  return response.data;
};

export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<LoginResult>> => {
  const response = await Axios.post<ApiResponse<LoginResult>>(
    '/users/login',
    credentials
  );
  return response.data;
};

export const getUserInfo = async (): Promise<ApiResponse<UserInfoResult>> => {
  const response = await Axios.get<ApiResponse<UserInfoResult>>('/users/info');
  return response.data;
};
