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

// 더미 데이터 사용
import { dummyUser } from '../../data/dummyData';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const responsiveWidth = useResponsiveWidth();
  const loginContainerStyle = useMemo(
    () => ({ ...baseLoginContainerStyle, width: responsiveWidth }),
    [responsiveWidth]
  );

  // 데모용: 유효한 이메일 형식으로 초기값 설정
  const [email, setEmail] = useState('test1234@demo.com');
  const [password, setPassword] = useState('test1234');
  // 데모용: 이메일 저장 기본 체크
  const [saveEmail, setSaveEmail] = useState(true);
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

  // 폼 제출 핸들러 (데모용)
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

      // 데모용: 아무 이메일/비밀번호나 입력하면 로그인 성공
      try {
        // 이메일 저장 여부 처리
        if (saveEmail) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }

        // 데모용 액세스 토큰 생성 (더미 사용자 정보 포함)
        const demoToken = btoa(
          JSON.stringify({
            userId: dummyUser.id,
            username: dummyUser.username,
            email: dummyUser.email,
            timestamp: Date.now(),
          })
        );

        localStorage.setItem('accessToken', demoToken);
        localStorage.setItem('userInfo', JSON.stringify(dummyUser));

        console.log('데모 로그인 성공:', dummyUser);
        navigate('/home');
      } catch (err: unknown) {
        console.error(err);
        alert('데모 로그인 중 오류가 발생했습니다.');
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
