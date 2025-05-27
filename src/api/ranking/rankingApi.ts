// src/api/ranking/rankingApi.ts

import { Axios } from '../Axios';

///////////////////////
// Response 타입 정의
///////////////////////

/**
 * Top 랭킹 리스트 내 개별 유저 정보
 */
export interface RankingItem {
  userId: string;
  nickname: string;
  rank: number;
  previousRank: number | null;
  tier: string;
  totalPoints: number;
}

///////////////////////
// 공통 응답 형식
///////////////////////

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: T | null;
}

///////////////////////
// API 함수
///////////////////////

/**
 * Top 랭킹 리스트 조회
 * @returns ApiResponse<RankingItem[]>
 */
export const getTopRankings = async (): Promise<ApiResponse<RankingItem[]>> => {
  const response = await Axios.get<ApiResponse<RankingItem[]>>('/rankings/top');
  return response.data;
};
