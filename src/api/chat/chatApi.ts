// src/api/battle/chat.ts

import { Axios } from '../Axios'; // Axios 인스턴스를 위 경로에서 불러옵니다.

/**
 * 채팅 메시지 한 건의 타입 정의
 */
export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  side: 'A' | 'B';
  message: string;
  createdAt: string; // ISO 8601 형식 (예: 2025-05-29T08:00:00.000Z)
}

/**
 * GET /battle/rooms/{roomId}/chat/messages 응답 타입
 */
export interface GetChatMessagesResponse {
  isSuccess: true;
  code: '200';
  message: 'success!';
  result: {
    sideA: ChatMessage[];
    sideB: ChatMessage[];
  };
}

/**
 * POST /battle/rooms/{roomId}/chat/messages/{side} 요청 바디 타입
 */
export interface PostChatMessageRequest {
  side: 'A' | 'B';
  message: string;
}

/**
 * POST /battle/rooms/{roomId}/chat/messages/{side} 성공 응답 타입
 */
export interface PostChatMessageResponse {
  isSuccess: true;
  code: '200';
  message: 'success!';
  result: ChatMessage;
}

/**
 * 공통 에러 응답 타입
 */
export interface ErrorResponse {
  isSuccess: false;
  code: string;
  message: string;
  result: string;
}

/**
 * 배틀 채팅 API 객체
 */
const BattleChatApi = {
  /**
   * 특정 방(roomId)의 채팅 내역을 조회합니다.
   * @param roomId 조회할 배틀방 ID (문자열로 전달)
   * @returns GET 요청 결과를 담은 Promise
   */
  async getChatMessages(
    roomId: string
  ): Promise<GetChatMessagesResponse | ErrorResponse> {
    const response = await Axios.get<GetChatMessagesResponse | ErrorResponse>(
      `/battle/rooms/${roomId}/chat/messages`
    );
    return response.data;
  },

  /**
   * 특정 방(roomId)에 채팅 메시지를 저장합니다.
   * side에 따라 A진영 또는 B진영으로 구분된 엔드포인트로 POST 요청을 보냅니다.
   * @param roomId 채팅을 저장할 배틀방 ID (문자열로 전달)
   * @param payload 요청 바디 (side, message)
   * @returns POST 요청 결과를 담은 Promise
   */
  async postChatMessage(
    roomId: string,
    payload: PostChatMessageRequest
  ): Promise<PostChatMessageResponse | ErrorResponse> {
    const { side, message } = payload;
    const url = `/battle/rooms/${roomId}/chat/messages/${side}`;
    const response = await Axios.post<PostChatMessageResponse | ErrorResponse>(
      url,
      { message }
    );
    return response.data;
  },
};

export default BattleChatApi;
