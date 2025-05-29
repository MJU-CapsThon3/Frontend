// src/api/battle/battleRoomApi.ts

import { Axios } from '../Axios';

///////////////////////
// Request / Response 타입 정의
///////////////////////

/**
 * 공통 응답 형식
 */
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number | string;
  message: string;
  result: T | null;
}

/**
 * 토픽 생성용 DTO
 */
export interface TopicCreate {
  side: 'A' | 'B';
  title: string;
  suggestedBy: string;
}

/**
 * 배틀방 생성 요청 바디
 */
export interface CreateRoomRequest {
  topics: TopicCreate[];
}

/**
 * 생성된 토픽 정보
 */
export interface TopicInfo {
  topicId: number;
  side: 'A' | 'B';
  title: string;
  suggestedBy: string;
  createdAt: string; // ISO timestamp
}

/**
 * 배틀방 생성 성공 응답 result
 */
export interface CreateRoomResult {
  roomId: number;
  adminId: number;
  topicA: string;
  topicB: string;
  status: 'WAITING' | 'PLAYING' | string;
  createdAt: string; // ISO timestamp
  topics: TopicInfo[];
}

/**
 * 배틀방 정보 조회 성공 응답 result
 */
export interface RoomInfoResult {
  roomId: number;
  adminId: number;
  topicA: string;
  topicB: string;
  status: 'WAITING' | 'PLAYING' | string;
  createdAt: string; // ISO timestamp
  participants: {
    userId: number;
    role: 'A' | 'B';
    joinedAt: string; // ISO timestamp
  }[];
  spectatorCount: number;
}

/**
 * 방 참가 요청 바디
 */
export interface JoinRoomRequest {
  side: 'A' | 'B';
}

/**
 * 방 참가 성공 응답 result
 */
export interface JoinRoomResult {
  participantId: number;
  roomId: number;
  userId: number;
  role: 'A' | 'B';
  joinedAt: string; // ISO timestamp
}

/**
 * 배틀 시작 성공 응답 result
 */
export interface StartBattleResult {
  roomId: number;
  status: 'PLAYING' | string;
  startedAt: string; // ISO timestamp
}

///////////////////////
// API 함수들
///////////////////////

/**
 * 배틀방 생성
 * POST /battle/rooms
 */
export const createBattleRoom = async (
  data: CreateRoomRequest
): Promise<ApiResponse<CreateRoomResult>> => {
  const response = await Axios.post<ApiResponse<CreateRoomResult>>(
    '/battle/rooms',
    data
  );
  return response.data;
};

/**
 * 배틀방 정보 조회
 * GET /battle/rooms/{roomId}
 */
export const getBattleRoomInfo = async (
  roomId: string | number
): Promise<ApiResponse<RoomInfoResult>> => {
  const response = await Axios.get<ApiResponse<RoomInfoResult>>(
    `/battle/rooms/${roomId}`
  );
  return response.data;
};

/**
 * 방 참가
 * POST /battle/rooms/{roomId}/participants
 */
export const joinBattleRoom = async (
  roomId: string | number,
  data: JoinRoomRequest
): Promise<ApiResponse<JoinRoomResult>> => {
  const response = await Axios.post<ApiResponse<JoinRoomResult>>(
    `/battle/rooms/${roomId}/participants`,
    data
  );
  return response.data;
};

/**
 * 배틀 시작
 * POST /battle/rooms/{roomId}/start
 */
export const startBattle = async (
  roomId: string | number
): Promise<ApiResponse<StartBattleResult>> => {
  const response = await Axios.post<ApiResponse<StartBattleResult>>(
    `/battle/rooms/${roomId}/start`
  );
  return response.data;
};
