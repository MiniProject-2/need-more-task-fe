import React, { FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { AccountInfoProps, IJoin, IUpdateProfile, IUser } from '@/type/authTypes';
import StepOne from '../Auth/Join/StepOne';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { teamOptions, getJoinCompanyYear } from '@/utils';
import * as A from '@/styles/auth.styles';
import * as P from '@/styles/profile.styles';
import { useForm } from 'react-hook-form';
import { updateUserInfoAPI, useUpdateProfileImageAPI, validatePasswordAPI } from '@/apis/user';
import { AxiosError } from 'axios';
import CheckPasswordModal from './CheckPasswordModal';
import ProfileImage from '@/components/CommonHeader/ProfileImage';
import { useQueryClient } from '@tanstack/react-query';

interface IAccountInfo {
  userInfo: IUser;
  currentLoginUserInfo: IUser;
}

function ProfileAccountInfo({ userInfo, currentLoginUserInfo }: IAccountInfo) {
  // const { department, fullName, joinCompanyYear, email, phone, profileImageUrl } = userInfo;
  const {
    watch,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm<any>();

  const queryClient = useQueryClient();
  const toast = useToast();
  const [edit, setEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState('');
  const [newProfileId, setNewProfileId] = useState<number>(1);

  // const [profileImageUrl, setProfileImageUrl] = useState('');

  const [fullNameValue, setFullNameValue] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState<string | null>(null);

  const [isPassword, setIsPassword] = useState('');
  const [isConfirmPassword, setIsConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const { isOpen: isOpenCheckPassword, onOpen: onOpenCheckPassword, onClose: onCloseCheckPassword } = useDisclosure();

  const [department, setDepartment] = useState(userInfo?.department || '');
  const [joinCompanyYear, setJoinCompanyYear] = useState(userInfo?.joinCompanyYear?.toString() || '');

  const onSuccessUploadImage = (data: any) => {
    const { profileId } = data.data;
    setProfileImage(data.data.profileImageUrl);
    setNewProfileId(profileId);

    // /user/profile
    queryClient.invalidateQueries([`/user/profile`]);
  };

  const onErrorUploadImage = (error: AxiosError) => {
    console.error(error);
  };

  const { mutate: uploadImageMutate, isLoading: isLoadingUploadImage } = useUpdateProfileImageAPI({
    onSuccess: onSuccessUploadImage,
    onError: onErrorUploadImage,
  });

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];

    const formData = new FormData();

    formData.append('profileImage', file);
    formData.append('type', fileInputRef.current!.name);

    try {
      // await axiosInstance.post(`/user/profile`, formData, {
      //   headers: { 'Context-Type': 'multipart/form-data' },
      // });
      uploadImageMutate(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDepartmentChange = (selectedOption: unknown) => {
    setDepartment((selectedOption as { value: string }).value);
  };
  const handleJoinCompanyYearChange = (selectedOption: unknown) => {
    setJoinCompanyYear((selectedOption as { value: string }).value);
  };
  const findSelectedDepartment = (dept?: string) => {
    return teamOptions.find((option) => option.value === dept);
  };
  const findSelectedJoinCompanyYear = (year?: number) => {
    return getJoinCompanyYear().find((option) => option.value === year);
  };

  const joinCompanyYearOptions = useMemo(() => getJoinCompanyYear(), []);

  // 버튼
  const handleEditProfile = () => {
    if (userInfo?.userId !== currentLoginUserInfo?.userId) {
      // onCloseCheckPassword()
      toast({
        title: '수정 권한이 없습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  };

  const formatPhoneNumber = (value: any) => {
    let cleaned = ('' + value).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handleCancelProfileSave = () => {
    reset();
    setFullNameValue(null);
    setEmailValue(null);
    setEdit(false);
  };

  const onSuccessCheckPassword = (data: any) => {
    onCloseCheckPassword();
    setEdit(true);

    toast({
      title: '비밀번호 확인 성공.',
      description: '프로필 수정이 가능합니다.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const onErrorCheckPassword = () => {
    toast({
      title: '비밀번호 확인 실패.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const { mutate: validatePasswordMutate, isLoading: isLoadingValidatePassword } = validatePasswordAPI({
    onSuccess: onSuccessCheckPassword,
    onError: onErrorCheckPassword,
  });

  const onSuccessUpdateProfile = (data: any) => {
    queryClient.invalidateQueries([`/user/${userInfo?.userId}`]);
    queryClient.invalidateQueries([`/auth/me`]);

    toast({
      title: '프로필 업데이트 성공.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setValue('password', '');
    setValue('passwordCheck', '');
    setEdit(false);
  };

  const onErrorUpdateProfile = (error: AxiosError) => {
    toast({
      title: '프로필 업데이트 실패.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };
  const { mutate: updateProfileMutate, isLoading: isLoadingUpdateProfile } = updateUserInfoAPI(userInfo?.userId, {
    onSuccess: onSuccessUpdateProfile,
    onError: onErrorUpdateProfile,
  });

  const onClickSave = (data: any) => {
    if (Object.keys(errors).length === 0) {
      setFullNameValue(watch('fullName'));
      setEmailValue(watch('email'));

      updateProfileMutate({
        ...data,
        department,
        joinCompanyYear,
        profileId: newProfileId,
        password: data.password ? data.password : '',
        passwordCheck: data.passwordCheck ? data.passwordCheck : '',
        phone: data.phone,
      });
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    handleSubmit(onClickSave)();
  };

  return (
    <form onSubmit={onSubmit}>
      <P.AccountWrapper>
        <P.AccountHeader>
          <h1>계정 정보</h1>
          {userInfo?.userId === currentLoginUserInfo?.userId && (
            <Button isDisabled={true}>프로필 업데이트 버튼은 아래에 있습니다.</Button>
          )}
        </P.AccountHeader>
        {/* 이메일 */}
        <A.InputContainer>
          <FormLabel htmlFor="email">
            이메일
            {userInfo?.userId === currentLoginUserInfo?.userId ||
              (userInfo?.userId === 1 && <>(이메일은 수정이 불가합니다.)</>)}
          </FormLabel>
          <Input
            isDisabled={true}
            // value={fullNameValue === null ? userInfo?.fullName || '' : fullNameValue}
            // value={watch('fullName')}
            defaultValue={userInfo?.email}
            id="email"
            variant="flushed"
            borderColor="outlineColor"
            focusBorderColor="inputFocusColor"
          />
        </A.InputContainer>

        {/* 프로필 */}
        <A.ProfileWrapper>
          <FormLabel>프로필</FormLabel>
          <A.ProfileFigures>
            <ProfileImage src={profileImage || userInfo?.profileImageUrl} width={150} height={150} />
          </A.ProfileFigures>
          <A.ProfileIMGWrapper>
            {edit ? (
              <Button
                as="label" // 버튼으로 사용하기 위해 <label> 요소로 지정
                htmlFor="profileImageInput" // 파일 입력 필드와 연결
                colorScheme="teal"
                variant="outline"
                cursor="pointer" // 마우스 커서를 포인터로 변경하여 클릭 가능한 모양으로 만듦
                isDisabled={!edit}
              >
                프로필 이미지 업로드
              </Button>
            ) : (
              ''
            )}
            <Input
              type="file"
              id="profileImageInput" // label의 htmlFor 속성과 연결
              ref={fileInputRef}
              onChange={uploadImage}
              display="none" // 실제 파일 입력 필드는 보이지 않도록 함
              accept=".jpg, .jpeg, .webp, .png, .gif, .svg"
              isDisabled={!edit}
            />
          </A.ProfileIMGWrapper>
        </A.ProfileWrapper>

        {/* department */}
        <A.InputContainer>
          <FormControl isRequired>
            <label>현재 소속 팀은 어디인가요?</label>
            <A.StyledSelect
              instanceId="team-select"
              aria-live="polite"
              name="teams"
              options={teamOptions}
              placeholder="팀 선택"
              closeMenuOnSelect={true}
              size="sm"
              value={findSelectedDepartment(department || userInfo?.department)}
              onChange={handleDepartmentChange}
              isDisabled={!edit}
              // isReadOnly={!edit}
              // isInvalid={!edit}
              isRequired
            />
          </FormControl>
        </A.InputContainer>

        {/* 입사연도 선택 */}
        <A.InputContainer>
          <FormControl isRequired>
            <label>입사 연도는 언제인가요?</label>
            <A.StyledSelect
              instanceId="join-year-select"
              aria-live="polite"
              name="join year"
              options={joinCompanyYearOptions}
              placeholder="입사 연도 선택"
              closeMenuOnSelect={true}
              size="sm"
              // defaultValue={userInfo?.joinCompanyYear || ''}
              value={findSelectedJoinCompanyYear(parseInt(joinCompanyYear || userInfo?.joinCompanyYear))}
              onChange={handleJoinCompanyYearChange}
              isDisabled={!edit}
              // isReadOnly={!edit}
              // isInvalid={!edit}
              isRequired
            />
          </FormControl>
        </A.InputContainer>

        {/* 이름 */}
        <A.InputContainer>
          <FormControl isInvalid={Boolean(errors.fullName)}>
            <FormLabel htmlFor="fullName">이름</FormLabel>
            <Input
              isDisabled={!edit}
              // value={fullNameValue === null ? userInfo?.fullName || '' : fullNameValue}
              // value={watch('fullName') || userInfo?.fullName}
              defaultValue={userInfo?.fullName || watch('fullName')}
              id="fullName"
              placeholder="이름을 입력하세요"
              variant="flushed"
              borderColor="outlineColor"
              focusBorderColor="inputFocusColor"
              {...register('fullName', {
                required: '이름은 필수 입력사항 입니다.',
                maxLength: {
                  value: 20,
                  message: '이름이 20자가 넘으시나요? 관리자에게 연락하세요.',
                },
              })}
            />
            <FormErrorMessage>{errors.fullName && errors.fullName?.message?.toString()}</FormErrorMessage>
          </FormControl>
        </A.InputContainer>

        {/* 새 비밀번호 */}
        <A.InputContainer>
          <FormControl isInvalid={Boolean(errors.password)}>
            <FormLabel htmlFor="password">새 비밀번호</FormLabel>
            <InputGroup size="md" variant="flushed">
              <Input
                isDisabled={!edit}
                value={watch('password') || ''}
                id="password"
                placeholder="영어 소문자 6자~16자, (특수문자 . - 만 허용)"
                pr="4.5rem"
                variant="flushed"
                borderColor="outlineColor"
                focusBorderColor="inputFocusColor"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  // required: '필수 입력사항 입니다.',
                  pattern: {
                    value: /^[a-zA-Z0-9.\-]{6,16}$/,
                    message: '영어 소문자 6자~16자, (특수문자 . - 만 허용)',
                  },
                })}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleShowPassword} isDisabled={!edit}>
                  {showPassword ? '보기' : '숨기기'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password && errors.password?.message?.toString()}</FormErrorMessage>
          </FormControl>
        </A.InputContainer>

        {/* 새 비밀번호 확인 */}
        <A.InputContainer>
          <FormControl isInvalid={Boolean(errors.passwordCheck)}>
            <FormLabel htmlFor="passwordCheck">새 비밀번호 확인</FormLabel>
            <InputGroup size="md" variant="flushed">
              <Input
                isDisabled={!edit}
                value={watch('passwordCheck') || ''}
                id="passwordCheck"
                placeholder="영어 소문자 6자~16자, (특수문자 . - 만 허용)"
                pr="4.5rem"
                variant="flushed"
                borderColor="outlineColor"
                focusBorderColor="inputFocusColor"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('passwordCheck', {
                  // required: '필수 입력사항 입니다.',
                  validate: (val: string) => {
                    if (watch('password') !== val) {
                      return '입력하신 비밀번호/비밀번호 확인이 일치하지 않습니다.';
                    }
                  },
                })}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleShowConfirmPassword} isDisabled={!edit}>
                  {showConfirmPassword ? '보기' : '숨기기'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.passwordCheck && errors.passwordCheck?.message?.toString()}</FormErrorMessage>
          </FormControl>
        </A.InputContainer>
        {/*  */}
      </P.AccountWrapper>

      {/* 연락처 */}
      <A.InputContainer>
        <FormControl isInvalid={Boolean(errors.phone)}>
          <FormLabel htmlFor="phone">연락처</FormLabel>
          <A.PhoneNumWrapper>
            <Input
              isDisabled={!edit}
              id="phone"
              type="tel"
              placeholder="010-xxxx-xxxx"
              variant="flushed"
              borderColor="outlineColor"
              focusBorderColor="inputFocusColor"
              // value={watch('phone') || userInfo?.phone}
              defaultValue={userInfo?.phone || watch('phone')}
              {...register('phone', {
                required: '필수 입력사항 입니다.',
                pattern: {
                  value: /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/,
                  message: '올바른 형식으로 입력해주세요. 예) 010-0000-0000',
                },
              })}
              onChange={(e) => {
                e.target.value = formatPhoneNumber(e.target.value);
              }}
            />
          </A.PhoneNumWrapper>
          <FormErrorMessage>{errors.phone && errors.phone?.message?.toString()}</FormErrorMessage>
        </FormControl>
      </A.InputContainer>

      {/* Edit 버튼 */}
      {userInfo?.userId === currentLoginUserInfo?.userId && (
        <P.ButtonWrapper>
          {edit ? (
            <P.UpdateButton
              colorScheme="teal"
              size="md"
              color="white"
              type="button"
              onClick={handleSubmit(onClickSave)}
              isLoading={isLoadingUpdateProfile}
            >
              저장
            </P.UpdateButton>
          ) : (
            <CheckPasswordModal
              isOpenCheckPassword={isOpenCheckPassword}
              onOpenCheckPassword={onOpenCheckPassword}
              onCloseCheckPassword={onCloseCheckPassword}
              validatePasswordMutate={validatePasswordMutate}
              isLoadingValidatePassword={isLoadingValidatePassword}
            >
              <P.UpdateButton colorScheme="teal" size="md" color="white" onClick={handleEditProfile}>
                프로필 업데이트
              </P.UpdateButton>
            </CheckPasswordModal>
          )}

          <P.CancelButton color="labelColor" onClick={handleCancelProfileSave}>
            취소
          </P.CancelButton>
        </P.ButtonWrapper>
      )}
    </form>
  );
}

export default ProfileAccountInfo;
