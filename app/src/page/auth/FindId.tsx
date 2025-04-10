import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  FormEvent,
  forwardRef,
} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFindIdValidation } from '../../hooks/Validation';
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

const backButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '16px',
  left: '16px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: '8px',
  transition: 'transform 0.2s ease, opacity 0.2s ease',
};

const backButtonHoverStyle: React.CSSProperties = {
  transform: 'scale(1.1)',
  opacity: 0.8,
};

const CustomDateInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, onBlur }, ref) => (
    <InputField
      id='customDateInput'
      type='text'
      value={value}
      onClick={onClick}
      onBlur={onBlur}
      style={inputStyle}
      ref={ref}
      placeholder='생년월일 선택 (yyyy-mm-dd)'
      aria-label='생년월일 선택'
    />
  )
);

const FindId: React.FC = () => {
  const responsiveWidth = useResponsiveWidth();
  const containerStyle = useMemo(
    () => ({
      ...baseContainerStyle,
      width: responsiveWidth,
    }),
    [responsiveWidth]
  );
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isHovering, setIsHovering] = useState(false);

  const { validate } = useFindIdValidation();

  const phone1Ref = useRef<HTMLInputElement>(null);
  const phone2Ref = useRef<HTMLInputElement>(null);
  const phone3Ref = useRef<HTMLInputElement>(null);

  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const validateForm = async () => {
      const formattedBirthDate = birthDate
        ? birthDate.toISOString().slice(0, 10)
        : '';
      const phone = `${phone1}-${phone2}-${phone3}`;
      const validationData = { name, birthDate: formattedBirthDate, phone };
      const validationErrors = await validate(validationData);
      setErrors(validationErrors);
    };
    validateForm();
  }, [name, birthDate, phone1, phone2, phone3, validate]);

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

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formattedBirthDate = birthDate
        ? birthDate.toISOString().slice(0, 10)
        : '';
      const phone = `${phone1}-${phone2}-${phone3}`;
      const validationData = { name, birthDate: formattedBirthDate, phone };
      const validationErrors = await validate(validationData);
      setErrors(validationErrors);
      setTouched({ name: true, birthDate: true, phone: true });
      if (Object.keys(validationErrors).length > 0) return;
      alert(`아이디 찾기 시도:
  이름: ${name}
  생년월일: ${formattedBirthDate}
  전화번호: ${phone}`);
    },
    [name, birthDate, phone1, phone2, phone3, validate]
  );

  // 호버 상태에 따른 뒤로가기 버튼 스타일 결정
  const currentBackButtonStyle = isHovering
    ? { ...backButtonStyle, ...backButtonHoverStyle }
    : backButtonStyle;

  return (
    <div style={containerStyle}>
      {/* 뒤로가기 버튼 클릭 시 /login으로 이동 */}
      <button
        onClick={() => navigate('/login')}
        style={currentBackButtonStyle}
        aria-label='뒤로가기'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <FaArrowLeft size={24} />
      </button>

      <h1 style={titleStyle}>아이디 찾기</h1>
      <p style={subtitleStyle}>가입 시 사용하신 정보를 입력해주세요.</p>
      <form onSubmit={handleSubmit} style={formStyle}>
        <InputField
          id='findIdName'
          type='text'
          placeholder='이름'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur('name')}
          style={inputStyle}
          aria-label='이름 입력'
        />
        <ErrorText message={touched.name ? errors.name : undefined} />

        <DatePicker
          selected={birthDate}
          onChange={(date: Date | null) => setBirthDate(date)}
          dateFormat='yyyy-MM-dd'
          customInput={<CustomDateInput />}
          onBlur={handleBlur('birthDate')}
        />
        <ErrorText message={touched.birthDate ? errors.birthDate : undefined} />

        <FormRow>
          <InputField
            id='findIdPhone1'
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
            id='findIdPhone2'
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
            id='findIdPhone3'
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
          아이디 찾기
        </CustomButton>
      </form>
    </div>
  );
};

export default FindId;
