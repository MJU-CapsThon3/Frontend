// src/api/battle/BattleRoom.ts

import { Axios } from '../Axios';
import { AxiosInstance } from 'axios';

/**
 * 배틀 주제(Topic) 타입 정의
 */
export interface Topic {
  side: 'A' | 'B';
  title: string;
  suggestedBy: string;
}

/**
 * 배틀방 생성 요청 바디 타입
 */
export interface CreateBattleRoomRequest {
  topics: Topic[];
}

/**
 * /battle/rooms (POST) 응답 타입
 */
export interface CreateBattleRoomResponse {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: {
    roomId: number;
    adminId: number;
    topicA: string;
    topicB: string;
    status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED';
    createdAt: string; // ISO 날짜 문자열
    topics: {
      topicId: number;
      side: 'A' | 'B';
      title: string;
      suggestedBy: string;
      createdAt: string;
    }[];
  } | null;
}

/**
 * 전체 배틀방 목록 조회 시 반환되는 방 요약 정보 타입
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
  code: number | string;
  message: string;
  result: RoomSummary[] | null;
}

/**
 * 특정 배틀방 상세 정보 타입
 */
export interface RoomDetail {
  roomId: number;
  adminId: number;
  topicA: string;
  topicB: string;
  status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED';
  createdAt: string; // ISO 날짜 문자열
  participants: {
    userId: number;
    role: 'A' | 'B' | 'SPECTATOR';
    joinedAt: string; // ISO 날짜 문자열
  }[];
  spectatorCount: number;
}

/**
 * /battle/rooms/{roomId} (GET) 응답 타입
 */
export interface GetBattleRoomResponse {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: RoomDetail | null;
}

/**
 * 방 참가 요청 바디 타입
 */
export interface JoinBattleRoomRequest {
  side: 'A' | 'B';
}

/**
 * /battle/rooms/{roomId}/participants (POST) 응답 타입
 */
export interface JoinBattleRoomResponse {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: {
    participantId: number;
    roomId: number;
    userId: number;
    role: 'A' | 'B' | 'SPECTATOR';
    joinedAt: string; // ISO 날짜 문자열
  } | null;
}

/**
 * /battle/rooms/{roomId}/start (POST) 응답 타입
 */
export interface StartBattleResponse {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: {
    roomId: number;
    status: 'PLAYING';
    startedAt: string; // ISO 날짜 문자열
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
   * 특정 배틀방 정보 조회
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
   * 방 참가
   * POST /battle/rooms/{roomId}/participants
   */
  async joinRoom(
    roomId: number | string,
    payload: JoinBattleRoomRequest,
    axiosInstance: AxiosInstance = Axios
  ): Promise<JoinBattleRoomResponse['result']> {
    try {
      const response = await axiosInstance.post<JoinBattleRoomResponse>(
        `/battle/rooms/${roomId}/participants`,
        payload
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
   * 배틀 시작
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
};
