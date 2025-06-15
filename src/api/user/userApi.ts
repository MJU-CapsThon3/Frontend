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
 *
 * API 스펙에 맞춰 필드를 확장:
 * {
 *   id: "1",
 *   email: "user@example.com",
 *   nickname: "nickname",
 *   name: "John Doe",
 *   profileImageUrl: null,
 *   gender: "M",
 *   birth: "1992-07-15T00:00:00.000Z",
 *   phoneNumber: "010-1234-5678",
 *   point: 3300,
 *   tier: "Gold",
 *   rank: 123,
 *   createdAt: "2025-05-25T19:42:11.304Z",
 *   updatedAt: "2025-06-14T20:03:16.935Z"
 * }
 */
export interface UserInfoResult {
  id: string;
  email: string;
  nickname: string;
  name: string;
  profileImageUrl: string | null;
  gender: string;
  birth: string; // ISO 문자열 또는 YYYY-MM-DD 등
  phoneNumber: string;
  point: number;
  tier: string;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

export const getUserInfo = async (): Promise<ApiResponse<UserInfoResult>> => {
  // Axios 인스턴스에 이미 Authorization 헤더가 설정되어 있지 않다면,
  // 아래와 같이 직접 헤더를 추가해야 합니다:
  //
  // const token = localStorage.getItem('accessToken');
  // const response = await Axios.get<ApiResponse<UserInfoResult>>(
  //   '/users/info',
  //   {
  //     headers: {
  //       Authorization: token ? `Bearer ${token}` : '',
  //       Accept: 'application/json',
  //     }
  //   }
  // );
  //
  // 하지만 Axios 인스턴스에 interceptor로 이미 헤더 지정이 되어 있으면
  // 단순히 아래처럼 호출하면 됩니다.

  const response = await Axios.get<ApiResponse<UserInfoResult>>('/users/info');
  return response.data;
};
