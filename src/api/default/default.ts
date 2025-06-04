// src/api/battle/default.ts

import { Axios } from '../Axios';

/**
 * 채팅 메시지 전송 요청 바디 타입
 */
export interface ChatMessageRequest {
  message: string;
}

/**
 * A 진영 채팅 메시지 전송
 * POST /battle/rooms/{roomId}/chat/messages/A
 *
 * @param roomId - 배틀룸 ID
 * @param body  - { message: "보낼 문자열" }
 * @returns     - Axios POST 요청 결과
 */
export const sendChatMessageToA = (
  roomId: string,
  body: ChatMessageRequest
) => {
  return Axios.post(`/battle/rooms/${roomId}/chat/messages/A`, body);
};

/**
 * B 진영 채팅 메시지 전송
 * POST /battle/rooms/{roomId}/chat/messages/B
 *
 * @param roomId - 배틀룸 ID
 * @param body  - { message: "보낼 문자열" }
 * @returns     - Axios POST 요청 결과
 */
export const sendChatMessageToB = (
  roomId: string,
  body: ChatMessageRequest
) => {
  return Axios.post(`/battle/rooms/${roomId}/chat/messages/B`, body);
};
