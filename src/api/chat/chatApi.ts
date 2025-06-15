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
  createdAt: string; // ISO 8601 형식
  warning: boolean; // 감정 분석에 따른 경고 여부
  emotion: string; // 분석된 감정 레이블 ("긍정", "부정", "중립" 등)
  probabilities: {
    // 각 감정에 대한 확률 분포
    긍정: number;
    부정: number;
    중립: number;
  };
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
 * POST /battle/rooms/{roomId}/chat/messages 요청 바디 타입
 */
export interface PostChatMessageRequest {
  side: 'A' | 'B';
  message: string;
}

/**
 * POST /battle/rooms/{roomId}/chat/messages 성공 응답 타입
 */
export interface PostChatMessageResponse {
  isSuccess: true;
  code: '200';
  message: 'success!';
  result: ChatMessage;
}

/**
 * GET /battle/rooms/{roomId}/chat/messages/{messageId}/emotion 응답 타입
 */
export interface GetChatMessageEmotionResponse {
  isSuccess: true;
  code: '200';
  message: 'success!';
  result: {
    messageId: string;
    roomId: string;
    userId: string;
    side: 'A' | 'B';
    createdAt: string; // ISO 8601 형식
    emotion: string; // 분석된 감정 레이블
    probabilities: {
      긍정: number;
      부정: number;
      중립: number;
    };
    warning: boolean;
  };
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
   * side를 바디에 포함하여 단일 엔드포인트로 POST 요청을 보냅니다.
   */
  async postChatMessage(
    roomId: string,
    payload: PostChatMessageRequest
  ): Promise<PostChatMessageResponse | ErrorResponse> {
    const url = `/battle/rooms/${roomId}/chat/messages`;
    const response = await Axios.post<PostChatMessageResponse | ErrorResponse>(
      url,
      payload
    );
    return response.data;
  },

  /**
   * 특정 채팅 메시지의 감정 분석 결과를 조회합니다.
   * GET /battle/rooms/{roomId}/chat/messages/{messageId}/emotion
   */
  async getChatMessageEmotion(
    roomId: string,
    messageId: string
  ): Promise<GetChatMessageEmotionResponse | ErrorResponse> {
    const url = `/battle/rooms/${roomId}/chat/messages/${messageId}/emotion`;
    const response = await Axios.get<
      GetChatMessageEmotionResponse | ErrorResponse
    >(url);
    return response.data;
  },
};

export default BattleChatApi;
