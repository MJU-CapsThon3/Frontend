// src/api/shop.ts

import { Axios } from '../Axios'; // Axios 인스턴스를 실제 경로에 맞게 수정하세요.
import { AxiosInstance } from 'axios';

/**
 * ======= 타입 정의 =======
 */

/**
 * POST /shop/buy-item 요청 바디 타입
 */
export interface BuyItemRequest {
  itemId: number;
}

/**
 * POST /shop/buy-item 응답 result 타입
 */
export interface BuyItemResult {
  message: string;
  remainPoint: number;
}

export interface BuyItemResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BuyItemResult | null;
}

/**
 * POST /shop/items 요청 바디 타입 (아이템 추가)
 */
export interface AddItemRequest {
  name: string;
  price: number;
  icon: string; // SVG 문자열
  category: '팀 아이콘' | '테두리';
}

/**
 * POST /shop/items 응답 결과 객체 타입
 */
export interface ShopItem {
  id: number;
  name: string;
  category: '팀 아이콘' | '테두리';
  icon: string; // SVG 문자열
  price: number;
}

export interface AddItemResponse {
  isSuccess: boolean;
  code: string | number;
  message: string;
  result: ShopItem | null;
}

/**
 * GET /shop/items (아이템 전체 조회) 응답 타입
 */
export interface GetItemsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ShopItem[] | null;
}

/**
 * GET /shop/my-items (유저 소유 아이템 조회) 응답 타입
 */
export interface MyItem {
  id: number;
  name: string;
  category: '팀 아이콘' | '테두리';
  icon: string; // SVG 문자열
  price: number;
  acquiredAt: string; // ISO 문자열
  isEquipped: boolean;
}

export interface GetMyItemsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyItem[] | null;
}

/**
 * POST /shop/items/update 요청 바디 타입 (아이템 수정)
 */
export interface UpdateItemRequest {
  itemId: number;
  name: string;
  category: '팀 아이콘' | '테두리';
  icon: string; // SVG 문자열
  price: number;
}

/**
 * POST /shop/items/update 응답 타입
 */
export interface UpdateItemResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ShopItem | null;
}

/**
 * ======= ShopApi 객체 =======
 */
export const ShopApi = {
  /**
   * 아이템 구매
   * POST /shop/buy-item
   */
  async buyItem(
    payload: BuyItemRequest,
    axiosInstance: AxiosInstance = Axios
  ): Promise<BuyItemResult> {
    try {
      const response = await axiosInstance.post<BuyItemResponse>(
        '/shop/buy-item',
        payload
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        const msg = data.message || '아이템 구매 실패';
        throw new Error(msg);
      }
    } catch (error) {
      console.error(
        `[ShopApi.buyItem] 아이템 구매 중 오류 (itemId=${payload.itemId}):`,
        error
      );
      throw error;
    }
  },

  /**
   * 아이템 추가
   * POST /shop/items
   */
  async addItem(
    payload: AddItemRequest,
    axiosInstance: AxiosInstance = Axios
  ): Promise<ShopItem> {
    try {
      const response = await axiosInstance.post<AddItemResponse>(
        '/shop/items',
        payload
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        const msg = data.message || '아이템 추가 실패';
        throw new Error(msg);
      }
    } catch (error) {
      console.error(
        `[ShopApi.addItem] 아이템 추가 중 오류 (name=${payload.name}):`,
        error
      );
      throw error;
    }
  },

  /**
   * 상점 아이템 전체 조회
   * GET /shop/items
   */
  async getItems(axiosInstance: AxiosInstance = Axios): Promise<ShopItem[]> {
    try {
      const response = await axiosInstance.get<GetItemsResponse>('/shop/items');
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        const msg = data.message || '아이템 목록 조회 실패';
        throw new Error(msg);
      }
    } catch (error) {
      console.error('[ShopApi.getItems] 아이템 목록 조회 중 오류:', error);
      throw error;
    }
  },

  /**
   * 유저 소유 아이템 목록 조회
   * GET /shop/my-items
   */
  async getMyItems(axiosInstance: AxiosInstance = Axios): Promise<MyItem[]> {
    try {
      const response =
        await axiosInstance.get<GetMyItemsResponse>('/shop/my-items');
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        const msg = data.message || '내 아이템 목록 조회 실패';
        throw new Error(msg);
      }
    } catch (error) {
      console.error(
        '[ShopApi.getMyItems] 유저 소유 아이템 조회 중 오류:',
        error
      );
      throw error;
    }
  },

  /**
   * 아이템 수정
   * POST /shop/items/update
   */
  async updateItem(
    payload: UpdateItemRequest,
    axiosInstance: AxiosInstance = Axios
  ): Promise<ShopItem> {
    try {
      const response = await axiosInstance.post<UpdateItemResponse>(
        '/shop/items/update',
        payload
      );
      const data = response.data;
      if (data.isSuccess && data.result) {
        return data.result;
      } else {
        const msg = data.message || '아이템 수정 실패';
        throw new Error(msg);
      }
    } catch (error) {
      console.error(
        `[ShopApi.updateItem] 아이템 수정 중 오류 (itemId=${payload.itemId}):`,
        error
      );
      throw error;
    }
  },
};
