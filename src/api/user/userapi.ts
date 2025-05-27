// src/api/user/userapi.ts

import { Axios } from '../Axios';

///////////////////////
// Request / Response 타입 정의
///////////////////////

// 회원가입 요청 바디
export interface SignupRequest {
  nickname: string;
  name: string;
  email: string;
  password: string;
  gender: 'M' | 'F' | 'O';
  birth: string; // YYYY-MM-DD
  phoneNumber: string; // e.g. "010-1234-5678"
}

// 회원가입 성공 응답 result
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

// 공통 응답 형식
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: T | null;
}

// 로그인 요청 바디
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 성공 응답 result
export interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    status: string;
  };
}

// 유저 정보 조회 성공 result
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

///////////////////////
// API 함수들
///////////////////////

/**
 * 회원가입 API 호출
 * @param data SignupRequest
 * @returns ApiResponse<SignupResult>
 */
export const signup = async (
  data: SignupRequest
): Promise<ApiResponse<SignupResult>> => {
  const response = await Axios.post<ApiResponse<SignupResult>>(
    '/users/signup',
    data
  );
  return response.data;
};

/**
 * 로그인 API 호출
 * @param credentials LoginRequest
 * @returns ApiResponse<LoginResult>
 */
export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<LoginResult>> => {
  const response = await Axios.post<ApiResponse<LoginResult>>(
    '/users/login',
    credentials
  );
  return response.data;
};

/**
 * 사용자 정보 조회 API 호출
 * @returns ApiResponse<UserInfoResult>
 */
export const getUserInfo = async (): Promise<ApiResponse<UserInfoResult>> => {
  const response = await Axios.get<ApiResponse<UserInfoResult>>('/users/info');
  return response.data;
};
