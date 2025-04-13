// src/pages/Login.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  FormEvent,
} from 'react';
import { Link } from 'react-router-dom';
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

const Login: React.FC = () => {
  const responsiveWidth = useResponsiveWidth();
  const loginContainerStyle = useMemo(
    () => ({ ...baseLoginContainerStyle, width: responsiveWidth }),
    [responsiveWidth]
  );

  const [email, setEmail] = useState(localStorage.getItem('savedEmail') || '');
  const [password, setPassword] = useState('');
  const [saveEmail, setSaveEmail] = useState(
    !!localStorage.getItem('savedEmail')
  );
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { validate } = useLoginValidation();

  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const validateForm = async () => {
      const validationErrors = await validate({ email, password });
      setErrors(validationErrors);
    };
    validateForm();
  }, [email, password, validate]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // 테스트 계정 확인: 아이디 "qwer1234@naver.com", 비밀번호 "qwer1234!"
      if (email === 'qwer1234@naver.com' && password === 'qwer1234!') {
        setErrors({});
        if (saveEmail) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }
        // 토큰을 생성하여 localStorage에 저장 (예시 토큰)
        localStorage.setItem('token', 'dummy-token-123456');
        alert('로그인 성공!');
        // 로그인 성공 후 리다이렉션: /battle-list로 이동
        window.location.href = '/battle-list';
      } else {
        const validationErrors = await validate({ email, password });
        setErrors(validationErrors);
        setTouched({ email: true, password: true });
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    },
    [email, password, saveEmail, validate]
  );

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

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
