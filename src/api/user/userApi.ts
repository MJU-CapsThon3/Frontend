// src/api/user/userApi.ts

import { Axios } from '../Axios';
import Cookies from 'js-cookie';

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

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// ApiResponse<T> 인터페이스: result가 T 또는 null
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: T | null;
}

///////////////////////
// API 함수들
///////////////////////

/**
 * 회원가입
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
 * 로그인
 * - 반환 타입을 ApiResponse<string> 으로 설정 (result가 JWT 문자열)
 * - 토큰을 받아서 localStorage와 쿠키에 저장
 */
export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<string>> => {
  const response = await Axios.post<ApiResponse<string>>(
    '/users/login',
    credentials
  );
  const responseData = response.data;

  console.log('[login] responseData ▶', responseData);

  // isSuccess가 true이고 result가 string(토큰)이라면 저장
  if (responseData.isSuccess && typeof responseData.result === 'string') {
    const token = responseData.result;

    // localStorage에 저장
    localStorage.setItem('accessToken', token);
    console.log('[login] saved token in localStorage ▶', token);

    // 쿠키에 저장 (예: 7일간 유지)
    Cookies.set('accessToken', token, { expires: 7, path: '/' });
    console.log('[login] saved token in Cookie ▶', token);
  } else {
    console.log('[login] 토큰이 없거나 isSuccess:false', responseData);
  }

  return responseData;
};

/**
 * 사용자 정보 조회
 */
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

export const getUserInfo = async (): Promise<ApiResponse<UserInfoResult>> => {
  const response = await Axios.get<ApiResponse<UserInfoResult>>('/users/info');
  return response.data;
};
