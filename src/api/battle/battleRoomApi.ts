// src/api/battle/BattleRoom.ts

import { Axios } from '../Axios';
import { AxiosInstance } from 'axios';

/**
 * 배틀방 생성 요청 바디 타입
 * POST /battle/rooms
 */
export interface CreateBattleRoomRequest {
  roomName: string;
}

/**
 * /battle/rooms (POST) 응답 타입
 */
export interface CreateBattleRoomResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    roomId: string;
    adminId: string;
    topicA: string;
    topicB: string;
    status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED';
    createdAt: string; // ISO 날짜 문자열
    participants: Array<{
      participantId: string;
      userId: string;
      role: 'A' | 'B' | 'P';
      joinedAt: string; // ISO 날짜 문자열
      side: string;
    }>;
  } | null;
}

/**
 * 전체 배틀방 목록 조회 시 반환되는 방 요약 정보 타입
 * GET /battle/rooms
 */
export interface RoomSummary {
  roomId: number;
  status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED';
  topicA: string;
  topicB: string;
}

/**
 * /battle/rooms (GET) 응답 타입
 */
export interface GetBattleRoomsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RoomSummary[] | null;
}

/**
 * 특정 배틀방 정보 조회 타입 (간단조회)
 * GET /battle/rooms/{roomId}
 */
export interface RoomDetail {
  roomId: number;
  adminId: number;
  topicA: string;
  topicB: string;
  status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED';
  createdAt: string; // ISO 날짜 문자열
  participants: Array<{
    userId: number;
    role: 'A' | 'B' | 'P';
    joinedAt: string; // ISO 날짜 문자열
  }>;
  spectatorCount: number;
}

/**
 * /battle/rooms/{roomId} (GET) 응답 타입
 */
export interface GetBattleRoomResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RoomDetail | null;
}

/**
 * 상세 조회 타입
 * GET /battle/rooms/{roomId}/detail
 */
export interface RoomDetailFull {
  roomId: number;
  adminId: number;
  topicA: string;
  topicB: string;
  status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED';
  createdAt: string; // ISO 날짜 문자열
  participantA: Array<{
    userId: string;
    joinedAt: string; // ISO 날짜 문자열
  }>;
  participantB: Array<{
    userId: string;
    joinedAt: string; // ISO 날짜 문자열
  }>;
  spectators: Array<{
    userId: string;
    joinedAt: string; // ISO 날짜 문자열
  }>;
}

/**
 * /battle/rooms/{roomId}/detail (GET) 응답 타입
 */
export interface GetBattleRoomDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RoomDetailFull | null;
}

/**
 * 방 참가 (관전자) 요청 바디는 없음
 * POST /battle/rooms/{roomId}/participants
 */
export interface JoinBattleRoomResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    participantId: string;
    roomId: string;
    userId: string;
    role: 'P';
    joinedAt: string; // ISO 날짜 문자열
    side: string;
  } | null;
}

/**
 * 역할 변경 요청 바디 타입
 * POST /battle/rooms/{roomId}/participants/role
 */
export interface ChangeRoleRequest {
  role: 'A' | 'B' | 'P';
}
export interface ChangeRoleResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    participantId: string;
    roomId: string;
    userId: string;
    role: 'A' | 'B' | 'P';
    joinedAt: string; // ISO 날짜 문자열
  } | null;
}

/**
 * 주제 설정 요청 바디 타입
 * POST /battle/rooms/{roomId}/topics
 */
export interface SetTopicsRequest {
  topicA: string;
  topicB: string;
}
export interface SetTopicsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    roomId: string;
    topicA: string;
    topicB: string;
    updatedAt: string; // ISO 날짜 문자열
    titles: Array<{
      titleId: string;
      side: 'A' | 'B';
      title: string;
      suggestedBy: string;
      createdAt: string; // ISO 날짜 문자열
    }>;
  } | null;
}

/**
 * AI 주제 생성 후 저장
 * POST /battle/rooms/{roomId}/topics/ai
 */
export interface GenerateAITopicsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    roomId: string;
    topicA: string;
    topicB: string;
    updatedAt: string; // ISO 날짜 문자열
    titles: Array<{
      titleId: string;
      side: 'A' | 'B';
      title: string;
      suggestedBy: 'ai';
      createdAt: string; // ISO 날짜 문자열
    }>;
  } | null;
}

/**
 * 주제 수정 요청 바디 타입
 * POST /battle/rooms/{roomId}/topics/update
 */
export interface UpdateTopicsRequest {
  topicA: string;
  topicB: string;
}
export interface UpdateTopicsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    roomId: string;
    topicA: string;
    topicB: string;
  } | null;
}

/**
 * 배틀 시작
 * POST /battle/rooms/{roomId}/start
 */
export interface StartBattleResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    roomId: number;
    status: 'PLAYING';
    startedAt: string; // ISO 날짜 문자열
  } | null;
}

/**
 * 토론(배틀) 종료
 * POST /battle/rooms/{roomId}/end
 */
export interface EndBattleResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string | null;
}

/**
 * 방 떠나기
 * POST /battle/rooms/{roomId}/leave
 */
export interface LeaveBattleResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string | null;
}

/**
 * 토론 최종 결과 조회 + 포인트 지급
 * GET /battle/rooms/{roomId}/result
 */
export interface GetBattleResultResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    winnerSide: 'A' | 'B' | 'DRAW';
    pointsAwarded: Array<{
      userId: string;
      points: number;
    }>;
  } | null;
}

/**
 * BattleRoomApi 객체: 배틀방 관련 API 호출 함수들
 */
export const BattleRoomApi = {
  /**
   * 배틀방 생성
   * POST /battle/rooms
   */
  async createRoom(
    payload: CreateBattleRoomRequest,
    axiosInstance: AxiosInstance = Axios
  ): Promise<CreateBattleRoomResponse['result']> {
    try {
      const response = await axiosInstance.post<CreateBattleRoomResponse>(
        '/battle/rooms',
        payload
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '배틀방 생성 실패');
      }
    } catch (error) {
      console.error('[BattleRoomApi.createRoom] 배틀방 생성 중 오류:', error);
      throw error;
    }
  },

  /**
   * 전체 배틀방 목록 조회
   * GET /battle/rooms
   */
  async getAllRooms(
    axiosInstance: AxiosInstance = Axios
  ): Promise<RoomSummary[]> {
    try {
      const response =
        await axiosInstance.get<GetBattleRoomsResponse>('/battle/rooms');
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '배틀방 목록 조회 실패');
      }
    } catch (error) {
      console.error(
        '[BattleRoomApi.getAllRooms] 배틀방 목록 조회 중 오류:',
        error
      );
      throw error;
    }
  },

  /**
   * 특정 배틀방 정보 조회 (간단)
   * GET /battle/rooms/{roomId}
   */
  async getRoomById(
    roomId: number | string,
    axiosInstance: AxiosInstance = Axios
  ): Promise<RoomDetail> {
    try {
      const response = await axiosInstance.get<GetBattleRoomResponse>(
        `/battle/rooms/${roomId}`
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '배틀방 정보 조회 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.getRoomById] 방 ID ${roomId} 조회 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 특정 배틀방 정보 상세 조회
   * GET /battle/rooms/{roomId}/detail
   */
  async getRoomDetailFull(
    roomId: number | string,
    axiosInstance: AxiosInstance = Axios
  ): Promise<RoomDetailFull> {
    try {
      const response = await axiosInstance.get<GetBattleRoomDetailResponse>(
        `/battle/rooms/${roomId}/detail`
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '배틀방 상세 조회 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.getRoomDetailFull] 방 ID ${roomId} 상세 조회 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 방 참가 (관전자)
   * POST /battle/rooms/{roomId}/participants
   */
  async joinRoom(
    roomId: number | string,
    axiosInstance: AxiosInstance = Axios
  ): Promise<JoinBattleRoomResponse['result']> {
    try {
      const response = await axiosInstance.post<JoinBattleRoomResponse>(
        `/battle/rooms/${roomId}/participants`
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '방 참가 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.joinRoom] 방 ID ${roomId} 참가 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 역할 변경
   * POST /battle/rooms/{roomId}/participants/role
   */
  async changeRole(
    roomId: number | string,
    payload: ChangeRoleRequest,
    axiosInstance: AxiosInstance = Axios
  ): Promise<ChangeRoleResponse['result']> {
    try {
      const response = await axiosInstance.post<ChangeRoleResponse>(
        `/battle/rooms/${roomId}/participants/role`,
        payload
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '역할 변경 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.changeRole] 방 ID ${roomId} 역할 변경 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 주제 설정 (관리자 전용)
   * POST /battle/rooms/{roomId}/topics
   */
  async setTopics(
    roomId: number | string,
    payload: SetTopicsRequest,
    axiosInstance: AxiosInstance = Axios
  ): Promise<SetTopicsResponse['result']> {
    try {
      const response = await axiosInstance.post<SetTopicsResponse>(
        `/battle/rooms/${roomId}/topics`,
        payload
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '주제 설정 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.setTopics] 방 ID ${roomId} 주제 설정 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * AI 주제 생성 및 저장 (관리자 전용)
   * POST /battle/rooms/{roomId}/topics/ai
   */
  async generateAITopics(
    roomId: number | string,
    axiosInstance: AxiosInstance = Axios
  ): Promise<GenerateAITopicsResponse['result']> {
    try {
      const response = await axiosInstance.post<GenerateAITopicsResponse>(
        `/battle/rooms/${roomId}/topics/ai`
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || 'AI 주제 생성 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.generateAITopics] 방 ID ${roomId} AI 주제 생성 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 주제 수정 (관리자 전용)
   * POST /battle/rooms/{roomId}/topics/update
   */
  async updateTopics(
    roomId: number | string,
    payload: UpdateTopicsRequest,
    axiosInstance: AxiosInstance = Axios
  ): Promise<UpdateTopicsResponse['result']> {
    try {
      const response = await axiosInstance.post<UpdateTopicsResponse>(
        `/battle/rooms/${roomId}/topics/update`,
        payload
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '토론 주제 수정 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.updateTopics] 방 ID ${roomId} 주제 수정 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 배틀 시작 (관리자 전용)
   * POST /battle/rooms/{roomId}/start
   */
  async startBattle(
    roomId: number | string,
    axiosInstance: AxiosInstance = Axios
  ): Promise<StartBattleResponse['result']> {
    try {
      const response = await axiosInstance.post<StartBattleResponse>(
        `/battle/rooms/${roomId}/start`
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '배틀 시작 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.startBattle] 방 ID ${roomId} 배틀 시작 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 토론(배틀) 종료 (관리자 전용)
   * POST /battle/rooms/{roomId}/end
   */
  async endBattle(
    roomId: number | string,
    axiosInstance: AxiosInstance = Axios
  ): Promise<EndBattleResponse['result']> {
    try {
      const response = await axiosInstance.post<EndBattleResponse>(
        `/battle/rooms/${roomId}/end`
      );
      const data = response.data;
      if (data.isSuccess) {
        return data.result!;
      } else {
        throw new Error(data.message || '토론 종료 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.endBattle] 방 ID ${roomId} 토론 종료 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 토론방 떠나기
   * POST /battle/rooms/{roomId}/leave
   */
  async leaveRoom(
    roomId: number | string,
    axiosInstance: AxiosInstance = Axios
  ): Promise<LeaveBattleResponse['result']> {
    try {
      const response = await axiosInstance.post<LeaveBattleResponse>(
        `/battle/rooms/${roomId}/leave`
      );
      const data = response.data;
      if (data.isSuccess) {
        return data.result!;
      } else {
        throw new Error(data.message || '방 떠나기 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.leaveRoom] 방 ID ${roomId} 떠나기 중 오류:`,
        error
      );
      throw error;
    }
  },

  /**
   * 토론 최종 결과 조회 + 포인트 지급
   * GET /battle/rooms/{roomId}/result
   */
  async getBattleResult(
    roomId: number | string,
    axiosInstance: AxiosInstance = Axios
  ): Promise<GetBattleResultResponse['result']> {
    try {
      const response = await axiosInstance.get<GetBattleResultResponse>(
        `/battle/rooms/${roomId}/result`
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        throw new Error(data.message || '토론 최종 결과 조회 실패');
      }
    } catch (error) {
      console.error(
        `[BattleRoomApi.getBattleResult] 방 ID ${roomId} 결과 조회 중 오류:`,
        error
      );
      throw error;
    }
  },
};
