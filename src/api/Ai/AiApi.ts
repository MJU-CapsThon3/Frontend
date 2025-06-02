import { Axios } from '../Axios'; // Axios 인스턴스를 위 경로에서 불러옵니다.
//
// 1. 요청/응답 타입 정의
//

/**
 * 1-1. 텍스트 욕설 검사 및 마스킹 API (POST /ai/filter)
 */
export interface FilterRequest {
  // 필터링할 원본 텍스트 (예: "안녕하세요 XX놈 반갑습니다")
  text: string;
}

export interface FilterResult {
  contains_profanity: boolean;
  filtered_text: string;
}

export interface FilterResponse {
  isSuccess: true;
  code: '200';
  message: 'success!';
  result: FilterResult;
}

/**
 * 1-2. 텍스트 감정 분석 API (POST /ai/analyze)
 */
export interface AnalyzeRequest {
  // 감정 분석할 원본 텍스트 (예: "오늘 기분이 너무 좋네요!")
  text: string;
}

export interface AnalyzeProbabilities {
  긍정: number;
  부정: number;
  [key: string]: number; // 만약 추가 감정 카테고리가 생길 수 있다면 확장
}

export interface AnalyzeResult {
  emotion: string; // 예: "긍정" 또는 "부정"
  probabilities: AnalyzeProbabilities;
}

export interface AnalyzeResponse {
  isSuccess: true;
  code: '200';
  message: 'success!';
  result: AnalyzeResult;
}

/**
 * 1-3. 토론 분석 API (POST /ai/analyze_debate)
 */
export interface AnalyzeDebateRequest {
  // A 진영 텍스트 예시
  sideA: string;
  // B 진영 텍스트 예시
  sideB: string;
}

export interface AnalyzeDebateResult {
  // 예: "A: (요약/평가)\nB: (요약/평가)\n최종 승자: A\n판정 이유: ~~~"
  result: string;
}

export interface AnalyzeDebateResponse {
  isSuccess: true;
  code: '200';
  message: 'success!';
  result: AnalyzeDebateResult;
}

/**
 * 1-4. 랜덤 토론 주제 생성 API (POST /ai/generate_topic)
 */
export interface GenerateTopicResult {
  topic: string; // 예: "예시: 진지한 과학적 주제: 인간 vs 인공지능, 누가 더 창의적일까?"
}

export interface GenerateTopicResponse {
  isSuccess: true;
  code: '200';
  message: 'success!';
  result: GenerateTopicResult;
}

//
// 2. API 호출 객체
//
const AiApi = {
  /**
   * 텍스트 욕설 검사 및 마스킹
   * POST /ai/filter
   *
   * @param payload { text: string }
   * @returns Promise<FilterResponse>
   */
  async filterText(payload: FilterRequest): Promise<FilterResponse> {
    const response = await Axios.post<FilterResponse>('/ai/filter', payload);
    return response.data;
  },

  /**
   * 텍스트 감정 분석
   * POST /ai/analyze
   *
   * @param payload { text: string }
   * @returns Promise<AnalyzeResponse>
   */
  async analyzeText(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await Axios.post<AnalyzeResponse>('/ai/analyze', payload);
    return response.data;
  },

  /**
   * 토론 분석 (A vs B 평가 및 최종 승자 판정)
   * POST /ai/analyze_debate
   *
   * @param payload { sideA: string; sideB: string }
   * @returns Promise<AnalyzeDebateResponse>
   */
  async analyzeDebate(
    payload: AnalyzeDebateRequest
  ): Promise<AnalyzeDebateResponse> {
    const response = await Axios.post<AnalyzeDebateResponse>(
      '/ai/analyze_debate',
      payload
    );
    return response.data;
  },

  /**
   * 랜덤 토론 주제 생성
   * POST /ai/generate_topic
   *
   * @returns Promise<GenerateTopicResponse>
   */
  async generateTopic(): Promise<GenerateTopicResponse> {
    const response =
      await Axios.post<GenerateTopicResponse>('/ai/generate_topic');
    return response.data;
  },
};

export default AiApi;
