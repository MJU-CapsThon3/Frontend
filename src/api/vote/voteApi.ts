// src/api/battle/Vote.ts

import { Axios } from '../Axios'; // Axios 인스턴스를 실제 경로에 맞게 수정하세요.
import { AxiosResponse } from 'axios';

/**
 * ======= 타입 정의 =======
 */

/**
 * POST /battle/rooms/{roomId}/votes 요청 바디 타입
 */
export interface CreateVoteRequest {
  vote: 'A' | 'B';
}

/**
 * POST /battle/rooms/{roomId}/votes 응답 result 타입
 */
export interface CreateVoteResult {
  id: string;
  roomId: string;
  userId: string;
  vote: 'A' | 'B';
  createdAt: string; // ISO 날짜 문자열
}

export interface CreateVoteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CreateVoteResult | null;
}

/**
 * GET /battle/rooms/{roomId}/votes 응답 result 타입
 */
export interface VoteDetail {
  id: string;
  roomId: string;
  userId: string;
  vote: 'A' | 'B';
  createdAt: string; // ISO 날짜 문자열
}

export interface GetVotesResult {
  countA: number;
  countB: number;
  total: number;
  votes: VoteDetail[];
}

export interface GetVotesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: GetVotesResult | null;
}

/**
 * ======= API 함수 정의 =======
 */

const VoteApi = {
  /**
   * 관전자 투표 저장
   * POST /battle/rooms/{roomId}/votes
   * @param roomId 배틀방 ID (string 또는 number)
   * @param payload { vote: 'A' | 'B' }
   */
  createVote: async (
    roomId: string | number,
    payload: CreateVoteRequest
  ): Promise<CreateVoteResult> => {
    const response: AxiosResponse<CreateVoteResponse> = await Axios.post(
      `/battle/rooms/${roomId}/votes`,
      payload
    );
    if (response.data.isSuccess && response.data.result) {
      return response.data.result;
    } else {
      // 실패한 경우 에러 처리
      throw new Error(
        `투표 저장 실패: ${response.data.code} - ${response.data.message}`
      );
    }
  },

  /**
   * 투표 결과 조회
   * GET /battle/rooms/{roomId}/votes
   * @param roomId 배틀방 ID (string 또는 number)
   */
  getVotes: async (roomId: string | number): Promise<GetVotesResult> => {
    const response: AxiosResponse<GetVotesResponse> = await Axios.get(
      `/battle/rooms/${roomId}/votes`
    );
    if (response.data.isSuccess && response.data.result) {
      return response.data.result;
    } else {
      // 실패한 경우 에러 처리
      throw new Error(
        `투표 결과 조회 실패: ${response.data.code} - ${response.data.message}`
      );
    }
  },
};

export default VoteApi;
