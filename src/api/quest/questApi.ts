// src/api/quest/questApi.ts

import { Axios } from '../Axios'; // Axios 인스턴스를 위 경로에서 불러옵니다.
import { AxiosInstance } from 'axios';

/**
 * 퀘스트 객체 타입 정의
 * 스펙 예시 응답을 보면, 일일 퀘스트 항목(result 배열의 객체)에 포함된 필드는 다음과 같습니다:
 * - id: number
 * - name: string
 * - description: string
 * - rewardPts: number
 * - goal: number
 * - progress: number
 * - status: string
 * - createdAt: string (ISO 날짜 문자열)
 * - rewardClaimed: boolean
 * - isCompleted: boolean
 *
 * 스펙 예시에는 `type` 필드가 없으므로, API에서 따로 제공하지 않는다면 삭제하거나 optional로만 두고 사용합니다.
 */
export interface Quest {
  id: number;
  name: string;
  description: string;
  rewardPts: number;
  goal: number;
  progress: number;
  status: string;
  createdAt: string; // ISO 날짜 문자열, 예: "2025-05-31T00:00:00.000Z"
  rewardClaimed: boolean;
  isCompleted: boolean;
  // 만약 서버에서 type 필드를 제공한다면 아래와 같이 추가할 수 있습니다.
  // type?: 'daily' | string;
}

/**
 * GET /quests/list 응답 타입
 * 스펙 예시:
 * {
 *   "isSuccess": true,
 *   "code": 200,
 *   "message": "성공",
 *   "result": [ { ...Quest fields... } ]
 * }
 * 그러나 에러 예시에서는 code가 문자열인 경우도 있으므로,
 * code는 number | string 으로 정의합니다.
 */
export interface GetQuestListResponse {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: Quest[] | null;
}

/**
 * POST /quests/status/{questId} 응답 내부 result 타입
 */
export interface CompleteQuestResult {
  status: string; // 예: "success"
  questId: number;
  isCompleted: boolean;
  progress: number;
  goal: number;
}

/**
 * POST /quests/status/{questId} 응답 타입
 * 스펙 예시:
 * {
 *   "isSuccess": true,
 *   "code": 200,
 *   "message": "퀘스트를 성공했습니다.",
 *   "result": { ... }
 * }
 * 그러나 혹시 success 필드를 따로 줄 수 있으므로 기존 예시처럼 isSuccess 또는 success 가능성을 반영합니다.
 */
export interface CompleteQuestResponse {
  isSuccess?: boolean;
  success?: boolean;
  code?: number | string;
  message: string;
  result: CompleteQuestResult | null;
}

/**
 * POST /quests/reward/{questId} 요청 바디 타입
 */
export interface QuestRewardRequest {
  userId: number;
  questId: number;
}

/**
 * POST /quests/reward/{questId} 내부 result 타입
 */
export interface QuestRewardResult {
  reward: number;
}

/**
 * POST /quests/reward/{questId} 응답 타입
 */
export interface QuestRewardResponse {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: QuestRewardResult | null;
}

/**
 * POST /quests/reset-daily 응답 타입
 */
export interface ResetDailyResponse {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: null;
}

/**
 * QuestApi 객체: 퀘스트 관련 API 호출 함수들
 */
export const QuestApi = {
  /**
   * 전체 일일 퀘스트 목록 조회
   * GET /quests/list
   */
  async getQuestList(axiosInstance: AxiosInstance = Axios): Promise<Quest[]> {
    try {
      const response =
        await axiosInstance.get<GetQuestListResponse>('/quests/list');
      const data = response.data;
      if (data.isSuccess && Array.isArray(data.result)) {
        return data.result;
      } else {
        // result가 null이거나 isSuccess가 false인 경우
        throw new Error(`퀘스트 목록 조회 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('[QuestApi.getQuestList] API 호출 중 오류:', error);
      throw error;
    }
  },

  /**
   * 퀘스트 완료 처리
   * POST /quests/status/{questId}
   * @param questId 완료 처리할 퀘스트 ID
   *
   * 서버 응답 예시:
   * {
   *   "isSuccess": true,
   *   "code": 200,
   *   "message": "퀘스트를 성공했습니다.",
   *   "result": {
   *     "status": "success",
   *     "questId": 1,
   *     "isCompleted": true,
   *     "progress": 5,
   *     "goal": 5
   *   }
   * }
   */
  async completeQuest(
    questId: number,
    axiosInstance: AxiosInstance = Axios
  ): Promise<CompleteQuestResult> {
    try {
      const response = await axiosInstance.post<CompleteQuestResponse>(
        `/quests/status/${questId}`
      );
      const data = response.data;

      // 정상 처리 여부 검사: isSuccess나 success 중 하나라도 true이고 result가 존재하면 반환
      if ((data.isSuccess === true || data.success === true) && data.result) {
        return data.result;
      }
      // 만약 result만 존재하면 그대로 반환
      if (data.result) {
        return data.result;
      }
      // 실패 케이스
      throw new Error(data.message || '퀘스트 완료 처리 실패');
    } catch (error) {
      console.error(
        `[QuestApi.completeQuest] 퀘스트 ID ${questId} 완료 처리 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 퀘스트 보상 수령
   * POST /quests/reward/{questId}
   * @param payload { userId, questId }
   *
   * 서버 응답 예시:
   * {
   *   "isSuccess": true,
   *   "code": 200,
   *   "message": "보상을 성공적으로 받았습니다.",
   *   "result": {
   *     "reward": 100
   *   }
   * }
   */
  async claimQuestReward(
    payload: QuestRewardRequest,
    axiosInstance: AxiosInstance = Axios
  ): Promise<QuestRewardResult> {
    try {
      const { questId, userId } = payload;
      const response = await axiosInstance.post<QuestRewardResponse>(
        `/quests/reward/${questId}`,
        { userId, questId }
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '퀘스트 보상 수령 실패');
      }
    } catch (error) {
      console.error(
        `[QuestApi.claimQuestReward] 퀘스트 ID ${payload.questId} 보상 수령 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 일일 퀘스트 초기화
   * POST /quests/reset-daily
   */
  async resetDailyQuests(axiosInstance: AxiosInstance = Axios): Promise<void> {
    try {
      const response = await axiosInstance.post<ResetDailyResponse>(
        '/quests/reset-daily'
      );
      const data = response.data;
      if (data.isSuccess) {
        return;
      } else {
        throw new Error(data.message || '일일 퀘스트 초기화 실패');
      }
    } catch (error) {
      console.error(
        '[QuestApi.resetDailyQuests] 일일 퀘스트 초기화 중 오류:',
        error
      );
      throw error;
    }
  },
};
