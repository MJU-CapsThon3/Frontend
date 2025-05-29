// src/api/user/userApi.ts (Signup 컴포넌트)
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  FormEvent,
  forwardRef,
} from 'react';
import { useNavigate } from 'react-router-dom'; // ← 추가
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EyeIcon from '../../assets/EyeIcon';
import EyeClosedIcon from '../../assets/EyeClosedIcon';
import { useSignupValidation, SignupData } from '../../hooks/Validation';

import CustomButton from '../../components/Auth/CustomButton';
import InputField from '../../components/Auth/InputField';
import ErrorText from '../../components/Auth/ErrorText';
import FormRow from '../../components/Auth/FormRow';

import {
  baseContainerStyle as baseSignupContainerStyle,
  titleStyle as signupTitleStyle,
  subtitleStyle as signupSubtitleStyle,
  formStyle as signupFormStyle,
  inputStyle as signupInputStyle,
  buttonStyle as signupButtonStyle,
  dashStyle,
  passwordWrapperStyle,
  eyeIconStyle,
  linkStyle,
  signupFooterStyle,
  genderButtonStyle,
  activeGenderButtonStyle,
} from '../../components/Auth/styles';

import useResponsiveWidth from '../../hooks/useResponsiveWidth';

// API 함수 import
import { signup, SignupRequest } from '../../api/user/userApi';

const CustomDateInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, onBlur }, ref) => (
    <InputField
      id='customDateInput'
      type='text'
      readOnly
      value={value}
      onClick={onClick}
      onBlur={onBlur}
      onChange={() => {}}
      style={signupInputStyle}
      ref={ref}
      placeholder='생년월일 선택 (yyyy-mm-dd)'
      aria-label='생년월일 선택'
    />
  )
);

const Signup: React.FC = () => {
  const navigate = useNavigate(); // ← 추가
  const responsiveWidth = useResponsiveWidth();
  const signupContainerStyle = useMemo(
    () => ({ ...baseSignupContainerStyle, width: responsiveWidth }),
    [responsiveWidth]
  );

  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // 이름
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');

  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { validate } = useSignupValidation();

  const handleBlur = (field: string) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const phone1Ref = useRef<HTMLInputElement>(null);
  const phone2Ref = useRef<HTMLInputElement>(null);
  const phone3Ref = useRef<HTMLInputElement>(null);

  const handlePhone1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 3) {
      setPhone1(value);
      if (value.length === 3 && phone2Ref.current) phone2Ref.current.focus();
    }
  };
  const handlePhone2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPhone2(value);
      if (value.length === 4 && phone3Ref.current) phone3Ref.current.focus();
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
      const formattedBirthDate = birthDate
        ? birthDate.toISOString().slice(0, 10)
        : '';
      const phone = `${phone1}-${phone2}-${phone3}`;
      const formData: SignupData = {
        email,
        name,
        nickname,
        password,
        confirmPw,
        gender,
        birthDate: formattedBirthDate,
        phone,
      };
      const validationErrors = await validate(formData);
      setErrors(validationErrors);
    };
    validateForm();
  }, [
    email,
    name,
    nickname,
    password,
    confirmPw,
    gender,
    birthDate,
    phone1,
    phone2,
    phone3,
    validate,
  ]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);
  const toggleConfirmPwVisibility = useCallback(() => {
    setShowConfirmPw((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formattedBirthDate = birthDate
        ? birthDate.toISOString().slice(0, 10)
        : '';
      const phoneNumber = `${phone1}-${phone2}-${phone3}`;

      const validationErrors = await validate({
        email,
        name,
        nickname,
        password,
        confirmPw,
        gender,
        birthDate: formattedBirthDate,
        phone: phoneNumber,
      });
      setErrors(validationErrors);
      setTouched({
        email: true,
        name: true,
        nickname: true,
        password: true,
        confirmPw: true,
        gender: true,
        birthDate: true,
        phone: true,
      });
      if (Object.keys(validationErrors).length > 0) return;

      try {
        const reqData: SignupRequest = {
          email,
          name,
          nickname,
          password,
          gender: gender === 'male' ? 'M' : 'F',
          birth: formattedBirthDate,
          phoneNumber,
        };
        const res = await signup(reqData);
        console.log('signup response →', res); // 응답 전체 확인용
        if (res.isSuccess && res.result) {
          alert('회원가입이 완료되었습니다!');
          navigate('/login'); // ← 성공 시 로그인 페이지로 이동
        } else {
          alert(`회원가입 실패: ${res.message}`);
        }
      } catch (err: any) {
        console.error(err);
        alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    [
      email,
      name,
      nickname,
      password,
      confirmPw,
      gender,
      birthDate,
      phone1,
      phone2,
      phone3,
      validate,
      navigate, // useNavigate 의존성 추가
    ]
  );

  return (
    <div style={signupContainerStyle}>
      <h1 style={signupTitleStyle}>Signup</h1>
      <p style={signupSubtitleStyle}>
        회원가입 후 더 많은 서비스를 만나보세요.
      </p>
      <form onSubmit={handleSubmit} style={signupFormStyle}>
        {/* 이메일 */}
        <InputField
          id='signupEmail'
          type='text'
          placeholder='이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleBlur('email')}
          style={signupInputStyle}
          aria-label='이메일 입력'
        />
        <ErrorText message={touched.email ? errors.email : undefined} />

        {/* 이름 */}
        <InputField
          id='signupName'
          type='text'
          placeholder='이름'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur('name')}
          style={signupInputStyle}
          aria-label='이름 입력'
        />
        <ErrorText message={touched.name ? errors.name : undefined} />

        {/* 닉네임 */}
        <InputField
          id='signupNickname'
          type='text'
          placeholder='닉네임'
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onBlur={handleBlur('nickname')}
          style={signupInputStyle}
          aria-label='닉네임 입력'
        />
        <ErrorText message={touched.nickname ? errors.nickname : undefined} />

        {/* 비밀번호 */}
        <div style={passwordWrapperStyle}>
          <InputField
            id='signupPassword'
            type={showPassword ? 'text' : 'password'}
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handleBlur('password')}
            style={signupInputStyle}
            aria-label='비밀번호 입력'
          />
          <span style={eyeIconStyle} onClick={togglePasswordVisibility}>
            {!showPassword ? (
              <EyeClosedIcon width={24} height={24} />
            ) : (
              <EyeIcon width={24} height={24} />
            )}
          </span>
        </div>
        <ErrorText message={touched.password ? errors.password : undefined} />

        {/* 비밀번호 확인 */}
        <div style={passwordWrapperStyle}>
          <InputField
            id='signupConfirmPw'
            type={showConfirmPw ? 'text' : 'password'}
            placeholder='비밀번호 확인'
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            onBlur={handleBlur('confirmPw')}
            style={signupInputStyle}
            aria-label='비밀번호 확인 입력'
          />
          <span style={eyeIconStyle} onClick={toggleConfirmPwVisibility}>
            {!showConfirmPw ? (
              <EyeClosedIcon width={24} height={24} />
            ) : (
              <EyeIcon width={24} height={24} />
            )}
          </span>
        </div>
        <ErrorText message={touched.confirmPw ? errors.confirmPw : undefined} />

        {/* 성별 */}
        <FormRow>
          <button
            type='button'
            onClick={() => setGender('male')}
            onBlur={handleBlur('gender')}
            style={
              gender === 'male' ? activeGenderButtonStyle : genderButtonStyle
            }
          >
            남성
          </button>
          <button
            type='button'
            onClick={() => setGender('female')}
            onBlur={handleBlur('gender')}
            style={
              gender === 'female' ? activeGenderButtonStyle : genderButtonStyle
            }
          >
            여성
          </button>
        </FormRow>
        <ErrorText message={touched.gender ? errors.gender : undefined} />

        {/* 생년월일 */}
        <DatePicker
          selected={birthDate}
          onChange={(date: Date | null) => setBirthDate(date)}
          dateFormat='yyyy-MM-dd'
          placeholderText='생년월일 선택 (yyyy-mm-dd)'
          customInput={<CustomDateInput />}
          onBlur={handleBlur('birthDate')}
        />
        <ErrorText message={touched.birthDate ? errors.birthDate : undefined} />

        {/* 전화번호 */}
        <FormRow>
          <InputField
            id='signupPhone1'
            type='text'
            placeholder='010'
            value={phone1}
            onChange={handlePhone1Change}
            onBlur={handleBlur('phone')}
            style={signupInputStyle}
            aria-label='전화번호 앞자리'
            ref={phone1Ref}
          />
          <span style={dashStyle}>-</span>
          <InputField
            id='signupPhone2'
            type='text'
            placeholder='1234'
            value={phone2}
            onChange={handlePhone2Change}
            onBlur={handleBlur('phone')}
            style={signupInputStyle}
            aria-label='전화번호 가운데자리'
            ref={phone2Ref}
          />
          <span style={dashStyle}>-</span>
          <InputField
            id='signupPhone3'
            type='text'
            placeholder='5678'
            value={phone3}
            onChange={handlePhone3Change}
            onBlur={handleBlur('phone')}
            style={signupInputStyle}
            aria-label='전화번호 뒷자리'
            ref={phone3Ref}
          />
        </FormRow>
        <ErrorText message={touched.phone ? errors.phone : undefined} />

        {/* 제출 */}
        <CustomButton type='submit' style={signupButtonStyle}>
          Signup
        </CustomButton>
      </form>

      {/* 푸터 */}
      <div style={signupFooterStyle}>
        이미 계정이 있으신가요?
        <a href='/' style={linkStyle}>
          로그인하기
        </a>
      </div>
    </div>
  );
};

export default Signup;
