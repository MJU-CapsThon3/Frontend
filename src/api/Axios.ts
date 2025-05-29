// src/api/Axios.ts
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
// JS-Cookie 타입 문제 해결: @types/js-cookie 설치 권장
// npm i --save-dev @types/js-cookie
import Cookies from 'js-cookie';

/**
 * Axios 인스턴스 설정
 */
const Axios: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || 'https://api.thiscatthatcat.shop/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// 요청 인터셉터: 토큰을 Authorization 헤더에 추가
Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token =
      Cookies.get('accessToken') || localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 상태 처리
Axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 예: 토큰 만료 시 처리 로직
      // localStorage.removeItem('accessToken');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { Axios };
