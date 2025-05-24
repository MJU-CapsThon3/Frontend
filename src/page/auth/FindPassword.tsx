// FindPassword.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  FormEvent,
} from 'react';
import { useFindPasswordValidation } from '../../hooks/Validation';
import CustomButton from '../../components/Auth/CustomButton';
import InputField from '../../components/Auth/InputField';
import ErrorText from '../../components/Auth/ErrorText';
import FormRow from '../../components/Auth/FormRow';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';
import {
  baseContainerStyle,
  titleStyle,
  subtitleStyle,
  formStyle,
  inputStyle,
  buttonStyle,
  dashStyle,
} from '../../components/Auth/styles';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const backButtonStylePw: React.CSSProperties = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: '8px',
  transition: 'transform 0.2s ease, opacity 0.2s ease',
};

const backButtonHoverStylePw: React.CSSProperties = {
  transform: 'scale(1.1)',
  opacity: 0.8,
};

const FindPassword: React.FC = () => {
  const responsiveWidth = useResponsiveWidth();
  const containerStyle = useMemo(
    () => ({ ...baseContainerStyle, width: responsiveWidth }),
    [responsiveWidth]
  );
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isHovering, setIsHovering] = useState(false);

  const { validate } = useFindPasswordValidation();

  const phone1Ref = useRef<HTMLInputElement>(null);
  const phone2Ref = useRef<HTMLInputElement>(null);
  const phone3Ref = useRef<HTMLInputElement>(null);

  const handleBlur = (field: string) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handlePhone1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 3) {
      setPhone1(value);
      if (value.length === 3 && phone2Ref.current) {
        phone2Ref.current.focus();
      }
    }
  };

  const handlePhone2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPhone2(value);
      if (value.length === 4 && phone3Ref.current) {
        phone3Ref.current.focus();
      }
    }
  };

  const handlePhone3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPhone3(value);
    }
  };

  useEffect(() => {
    const validateForm = async () => {
      const phone = `${phone1}-${phone2}-${phone3}`;
      // 검증 데이터에서 key를 nickname으로 사용
      const validationErrors = await validate({ email, nickname, phone });
      setErrors(validationErrors);
    };
    validateForm();
  }, [email, nickname, phone1, phone2, phone3, validate]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const phone = `${phone1}-${phone2}-${phone3}`;
      const validationData = { email, nickname, phone };
      const validationErrors = await validate(validationData);
      setErrors(validationErrors);
      setTouched({ email: true, nickname: true, phone: true });
      if (Object.keys(validationErrors).length > 0) return;
      alert(`비밀번호 찾기 시도:
이메일: ${email},
닉네임: ${nickname},
전화번호: ${phone}`);
    },
    [email, nickname, phone1, phone2, phone3, validate]
  );

  const currentBackButtonStyle = isHovering
    ? { ...backButtonStylePw, ...backButtonHoverStylePw }
    : backButtonStylePw;

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate('/login')}
        style={currentBackButtonStyle}
        aria-label='뒤로가기'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <FaArrowLeft size={24} />
      </button>
      <h1 style={titleStyle}>비밀번호 찾기</h1>
      <p style={subtitleStyle}>가입 시 사용하신 정보를 입력해주세요.</p>
      <form onSubmit={handleSubmit} style={formStyle}>
        <InputField
          id='findPwEmail'
          type='text'
          placeholder='이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleBlur('email')}
          style={inputStyle}
          aria-label='이메일 입력'
        />
        <ErrorText message={touched.email ? errors.email : undefined} />
        <InputField
          id='findPwNickname'
          type='text'
          placeholder='닉네임'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onBlur={handleBlur('nickname')}
          style={inputStyle}
          aria-label='닉네임 입력'
        />
        <ErrorText message={touched.nickname ? errors.nickname : undefined} />
        <FormRow>
          <InputField
            id='findPwPhone1'
            type='text'
            placeholder='010'
            value={phone1}
            onChange={handlePhone1Change}
            onBlur={handleBlur('phone')}
            style={inputStyle}
            aria-label='전화번호 앞자리'
            ref={phone1Ref}
          />
          <span style={dashStyle}>-</span>
          <InputField
            id='findPwPhone2'
            type='text'
            placeholder='1234'
            value={phone2}
            onChange={handlePhone2Change}
            onBlur={handleBlur('phone')}
            style={inputStyle}
            aria-label='전화번호 가운데자리'
            ref={phone2Ref}
          />
          <span style={dashStyle}>-</span>
          <InputField
            id='findPwPhone3'
            type='text'
            placeholder='5678'
            value={phone3}
            onChange={handlePhone3Change}
            onBlur={handleBlur('phone')}
            style={inputStyle}
            aria-label='전화번호 뒷자리'
            ref={phone3Ref}
          />
        </FormRow>
        <ErrorText message={touched.phone ? errors.phone : undefined} />
        <CustomButton type='submit' style={buttonStyle}>
          비밀번호 찾기
        </CustomButton>
      </form>
    </div>
  );
};

export default FindPassword;
