// src/api/quest/questApi.ts

import { Axios } from '../Axios'; // Axios 인스턴스를 위 경로에서 불러옵니다.
import { AxiosInstance } from 'axios';

/**
 * 퀘스트 객체 타입 정의
 */
export interface Quest {
  id: number;
  name: string;
  description: string;
  type: 'daily' | string;
  rewardPts: number;
  createdAt: string; // ISO 날짜 문자열
}

/**
 * GET /quests/list 응답 타입
 */
export interface GetQuestListResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: Quest[];
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
 */
export interface CompleteQuestResponse {
  isSuccess?: boolean;
  success?: boolean;
  code?: number;
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
  code: number;
  message: string;
  result: QuestRewardResult | null;
}

/**
 * POST /quests/reset-daily 응답 타입
 */
export interface ResetDailyResponse {
  isSuccess: boolean;
  code: number;
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
      if (data.isSuccess) {
        return data.result;
      } else {
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

      // 정상 처리 여부 검사
      if ((data.isSuccess === true || data.success === true) && data.result) {
        return data.result;
      }

      // 만약 결과 객체만 존재하면 그대로 반환
      if (data.result) {
        return data.result;
      }

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
      if (response.data.isSuccess) {
        return;
      } else {
        throw new Error(response.data.message || '일일 퀘스트 초기화 실패');
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
