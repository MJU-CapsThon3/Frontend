// src/pages/Login.tsx

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  FormEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EyeIcon from '../../assets/EyeIcon';
import EyeClosedIcon from '../../assets/EyeClosedIcon';
import { useLoginValidation } from '../../hooks/Validation';
import CustomButton from '../../components/Auth/CustomButton';
import InputField from '../../components/Auth/InputField';
import ErrorText from '../../components/Auth/ErrorText';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import {
  baseContainerStyle as baseLoginContainerStyle,
  titleStyle as loginTitleStyle,
  subtitleStyle as loginSubtitleStyle,
  formStyle as loginFormStyle,
  inputStyle as loginInputStyle,
  buttonStyle as loginButtonStyle,
} from '../../components/Auth/styles';

// login 함수 import: ApiResponse<string> 반환
import { login, LoginRequest } from '../../api/user/userApi';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const responsiveWidth = useResponsiveWidth();
  const loginContainerStyle = useMemo(
    () => ({ ...baseLoginContainerStyle, width: responsiveWidth }),
    [responsiveWidth]
  );

  // savedEmail이 있으면 초기값에 세팅
  const [email, setEmail] = useState(localStorage.getItem('savedEmail') || '');
  const [password, setPassword] = useState('');
  const [saveEmail, setSaveEmail] = useState(
    !!localStorage.getItem('savedEmail')
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { validate } = useLoginValidation();

  // 입력 필드를 벗어났을 때 touched 상태 업데이트
  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 이메일/비밀번호가 바뀔 때마다 유효성 검사
  useEffect(() => {
    const validateForm = async () => {
      const validationErrors = await validate({ email, password });
      setErrors(validationErrors);
    };
    validateForm();
  }, [email, password, validate]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // 유효성 검사
      const validationErrors = await validate({ email, password });
      setErrors(validationErrors);
      setTouched({ email: true, password: true });
      if (Object.keys(validationErrors).length > 0) {
        alert('입력 정보를 확인해 주세요.');
        return;
      }

      try {
        const reqData: LoginRequest = { email, password };
        // login()이 ApiResponse<string>을 반환
        const res = await login(reqData);
        console.log('login response →', res);

        if (res.isSuccess && res.result) {
          // 이메일 저장 여부 처리
          if (saveEmail) {
            localStorage.setItem('savedEmail', email);
          } else {
            localStorage.removeItem('savedEmail');
          }

          // userApi.login() 안에서 이미 accessToken을 저장했으므로
          // 여기서는 중복 저장하지 않아도 됩니다.
          // localStorage.setItem('accessToken', res.result);

          navigate('/home');
        } else {
          alert(`로그인 실패: ${res.message}`);
        }
      } catch (err: any) {
        console.error(err);
        alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    [email, password, saveEmail, validate, navigate]
  );

  // 비밀번호 가시성 토글
  const togglePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  // 버튼 호버 시 확대/축소 효과
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'scale(1.05)';
    },
    []
  );
  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    []
  );

  return (
    <div style={loginContainerStyle}>
      <h1 style={loginTitleStyle}>Login</h1>
      <p style={loginSubtitleStyle}>로그인 후 더 많은 서비스를 만나보세요.</p>
      <form onSubmit={handleSubmit} style={loginFormStyle}>
        <InputField
          id='loginEmail'
          type='text'
          placeholder='이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleBlur('email')}
          style={loginInputStyle}
          aria-label='이메일 입력'
        />
        <ErrorText message={touched.email ? errors.email : undefined} />

        <div style={{ position: 'relative', width: '100%' }}>
          <InputField
            id='loginPassword'
            type={showPassword ? 'text' : 'password'}
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handleBlur('password')}
            style={loginInputStyle}
            aria-label='비밀번호 입력'
          />
          <span
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              color: '#bbb',
            }}
            aria-label='비밀번호 표시 전환'
          >
            {!showPassword ? (
              <EyeClosedIcon width={24} height={24} />
            ) : (
              <EyeIcon width={24} height={24} />
            )}
          </span>
        </div>
        <ErrorText message={touched.password ? errors.password : undefined} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          <input
            type='checkbox'
            id='saveEmail'
            checked={saveEmail}
            onChange={(e) => setSaveEmail(e.target.checked)}
          />
          <label htmlFor='saveEmail'>이메일 저장하기</label>
        </div>

        <CustomButton
          type='submit'
          style={loginButtonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Login
        </CustomButton>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1rem',
            color: '#666',
            fontSize: '0.875rem',
            gap: '0.5rem',
          }}
        >
          <Link
            to='/find-id'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            아이디 찾기
          </Link>
          <span style={{ color: '#ccc' }}>|</span>
          <Link
            to='/find-password'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            비밀번호 찾기
          </Link>
          <span style={{ color: '#ccc' }}>|</span>
          <Link
            to='/sign-up'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
