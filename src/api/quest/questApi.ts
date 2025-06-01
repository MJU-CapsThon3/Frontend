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
 * POST /quests/status/{questId} 응답 타입
 *
 * 주의: 서버가 찍어주는 필드가 success vs isSuccess 중 무엇인지 상황마다 달라질 수 있습니다.
 */
export interface CompleteQuestResult {
  questId: number;
  isCompleted: boolean;
}

export interface CompleteQuestResponse {
  // 서버 리스폰스 예시:
  // { "isSuccess": true, "code": 200, "message": "퀘스트를 성공적으로 완료했습니다.", "result": { "questId": 1, "isCompleted": true } }
  success?: boolean;
  isSuccess?: boolean;
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
 * POST /quests/reward/{questId} 응답 타입
 */
export interface QuestRewardResult {
  reward: number;
}

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
      if (response.data.isSuccess) {
        return response.data.result;
      } else {
        throw new Error(`퀘스트 목록 조회 실패: ${response.data.message}`);
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
   * **변경 사항 요약**
   * - `response.data.success` 혹은 `response.data.isSuccess` 중 하나라도 true면 정상 처리
   * - 정상 처리 시 반드시 `response.data.result`를 리턴하도록 수정
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

      // 둘 중 하나라도 true이면 정상 완료로 간주
      if ((data.success === true || data.isSuccess === true) && data.result) {
        return data.result;
      }

      // 성공 메시지가 메시지 필드에 담겨올 경우(예: success는 false인데 message에 “완료했습니다”가 남아있다면),
      // data.result만 제대로 있으면 그것을 리턴
      if (data.result) {
        return data.result;
      }

      // 이 외의 상황에는 에러로 처리
      const msg = data.message || '퀘스트 완료 처리 실패';
      throw new Error(msg);
    } catch (error) {
      // 만약 서버가 “퀘스트를 성공적으로 완료했습니다.”라는 message로 에러를 던진다면,
      // 여기로 들어올 수 있으므로, 메시지에 “완료했습니다”가 포함돼 있으면 별도 처리를 하지 않고 dummy 반환도 가능
      if (
        error instanceof Error &&
        error.message.includes('퀘스트를 성공적으로 완료했습니다')
      ) {
        // dummy로 completed 리턴 (프로그래밍 로직 상, 이 값을 활용해 클라이언트가 상태 업데이트하도록 한다)
        return { questId, isCompleted: true };
      } else {
        console.error(
          `[QuestApi.completeQuest] 퀘스트 ID ${questId} 완료 처리 중 오류:`,
          error
        );
        throw error;
      }
    }
  },

  /**
   * 퀘스트 보상 수령
   * POST /quests/reward/{questId}
   * @param payload { userId, questId }
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
        const msg = data.message || '퀘스트 보상 수령 실패';
        throw new Error(msg);
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
        const msg = response.data.message || '일일 퀘스트 초기화 실패';
        throw new Error(msg);
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
