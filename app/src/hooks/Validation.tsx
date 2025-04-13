// Validation.ts
import * as yup from 'yup';
import { useCallback } from 'react';

const EMAIL_REQUIRED = '이메일을 입력해주세요.';
const EMAIL_INVALID = '유효한 이메일을 입력해주세요.';
const EMAIL_MIN_ERROR = '이메일은 최소 6자 이상이어야 합니다.';
const EMAIL_MAX_ERROR = '이메일은 최대 50자 까지 입력할 수 있습니다.';
const STRICT_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const PASSWORD_ERROR =
  '비밀번호는 8~14자 사이이며, 최소 하나의 영문자와 숫자를 포함해야 합니다.';
const PASSWORD_MIN_ERROR = '비밀번호는 최소 8자리 이상이어야 합니다.';
const PASSWORD_MAX_ERROR = '비밀번호는 최대 14자리로 입력해주세요.';

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email(EMAIL_INVALID)
      .matches(STRICT_EMAIL_REGEX, EMAIL_INVALID)
      .min(6, EMAIL_MIN_ERROR)
      .max(50, EMAIL_MAX_ERROR)
      .required(EMAIL_REQUIRED),
    password: yup
      .string()
      .trim()
      .required(PASSWORD_ERROR)
      .min(8, PASSWORD_MIN_ERROR)
      .max(14, PASSWORD_MAX_ERROR)
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,14}$/,
        PASSWORD_ERROR
      ),
  })
  .required();

export const useLoginValidation = () => {
  const validate = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        await loginSchema.validate(data, { abortEarly: false });
        return {};
      } catch (error: unknown) {
        const errors: Record<string, string> = {};
        if (error instanceof yup.ValidationError) {
          error.inner.forEach((e) => {
            if (e.path && !errors[e.path]) {
              errors[e.path] = e.message;
            }
          });
        }
        return errors;
      }
    },
    []
  );
  return { validate };
};

export interface SignupData {
  email: string;
  nickname: string;
  password: string;
  confirmPw: string;
  gender: string;
  birthDate: string;
  phone: string;
}

export const signupSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email(EMAIL_INVALID)
      .matches(STRICT_EMAIL_REGEX, EMAIL_INVALID)
      .min(6, EMAIL_MIN_ERROR)
      .max(50, EMAIL_MAX_ERROR)
      .required('이메일을 입력해주세요.'),
    nickname: yup.string().required('닉네임을 입력해주세요.'),
    password: yup
      .string()
      .trim()
      .required('비밀번호를 입력해주세요.')
      .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.')
      .max(14, '비밀번호는 최대 14자리로 입력해주세요.')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/,
        '비밀번호는 영문과 숫자를 포함한 8~14자로 입력해주세요.'
      ),
    confirmPw: yup
      .string()
      .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
      .required('비밀번호 확인을 입력해주세요.'),
    gender: yup
      .string()
      .oneOf(['male', 'female'], '성별을 선택해주세요.')
      .required('성별을 선택해주세요.'),
    birthDate: yup
      .date()
      .typeError('유효한 생년월일을 선택해주세요.')
      .required('생년월일을 선택해주세요.'),
    phone: yup
      .string()
      .matches(/^\d{3}-\d{3,4}-\d{4}$/, '휴대폰 번호 형식이 올바르지 않습니다.')
      .required('휴대폰 번호를 입력해주세요.'),
  })
  .required();

export const useSignupValidation = () => {
  const validate = useCallback(async (data: SignupData) => {
    try {
      await signupSchema.validate(data, { abortEarly: false });
      return {};
    } catch (error: unknown) {
      const errors: Record<string, string> = {};
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((e) => {
          if (e.path && !errors[e.path]) {
            errors[e.path] = e.message;
          }
        });
      }
      return errors;
    }
  }, []);
  return { validate };
};

const findIdSchema = yup
  .object({
    nickname: yup
      .string()
      .matches(
        /^[가-힣A-Za-z\s]{2,10}$/,
        '닉네임은 2자 이상 10자 이하의 한글 또는 영문만 입력 가능합니다.'
      )
      .required('닉네임을 입력해주세요.'),
    birthDate: yup.string().required('생년월일을 입력해주세요.'),
    phone: yup
      .string()
      .matches(
        /^\d{3}-\d{3,4}-\d{4}$/,
        '휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)'
      )
      .required('전화번호를 입력해주세요.'),
  })
  .required();

export const useFindIdValidation = () => {
  const validate = useCallback(
    async (data: { nickname: string; birthDate: string; phone: string }) => {
      try {
        await findIdSchema.validate(data, { abortEarly: false });
        return {};
      } catch (error: unknown) {
        const errors: Record<string, string> = {};
        if (error instanceof yup.ValidationError) {
          error.inner.forEach((e) => {
            if (e.path && !errors[e.path]) {
              errors[e.path] = e.message;
            }
          });
        }
        return errors;
      }
    },
    []
  );
  return { validate };
};

const findPwSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email(EMAIL_INVALID)
      .matches(STRICT_EMAIL_REGEX, EMAIL_INVALID)
      .min(6, EMAIL_MIN_ERROR)
      .max(50, EMAIL_MAX_ERROR)
      .required('이메일을 입력해주세요.'),
    nickname: yup
      .string()
      .matches(
        /^[가-힣A-Za-z\s]{2,10}$/,
        '닉네임은 2자 이상 10자 이하의 한글 또는 영문만 입력 가능합니다.'
      )
      .required('닉네임을 입력해주세요.'),
    phone: yup
      .string()
      .matches(
        /^\d{3}-\d{3,4}-\d{4}$/,
        '휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)'
      )
      .required('전화번호를 입력해주세요.'),
  })
  .required();

export const useFindPasswordValidation = () => {
  const validate = useCallback(
    async (data: { email: string; nickname: string; phone: string }) => {
      try {
        await findPwSchema.validate(data, { abortEarly: false });
        return {};
      } catch (error: unknown) {
        const errors: Record<string, string> = {};
        if (error instanceof yup.ValidationError) {
          error.inner.forEach((e) => {
            if (e.path && !errors[e.path]) {
              errors[e.path] = e.message;
            }
          });
        }
        return errors;
      }
    },
    []
  );
  return { validate };
};
