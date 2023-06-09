import React, { useMemo, useState } from 'react';
import * as A from '@/styles/auth.styles';
import { useRouter } from 'next/router';
import { useUserJoinStore } from '@/store/userJoinStore';
import JoinBackButton from '@/components/Auth/Join/JoinBackButton';

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import useInput from '@/hooks/useInput';

import { useForm } from 'react-hook-form';
import { isDuplicatedEmailAPI } from '@/apis/user';

export const inputProps = {
  variant: 'flushed',
  borderColor: 'outlineColor',
  focusBorderColor: 'inputFocusColor',
};

function StepTwo() {
  const router = useRouter();
  const { me, onSaveSignup } = useUserJoinStore();

  const [fullname, onChangeFullname] = useInput(me?.fullName ?? '');
  const [email, onChangeEmail] = useInput(me?.email ?? '');
  const [password, onChangePassword] = useInput(me?.password ?? '');
  const [confirmPassword, onChangeConfirmPassword] = useInput(me?.passwordCheck ?? '');

  const [isDuplicatedEmail, setIsDuplicatedEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const toast = useToast();

  const onError = (error: any) => {
    console.error('error>>', error);
    setIsDuplicatedEmail(false);

    toast({
      title: `${error?.response?.data?.data?.value}`,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const onSuccess = () => {
    setIsDuplicatedEmail(true);
    toast({
      title: '사용 가능한 이메일 입니다.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const { mutate: isDuplicatedEmailMutate, isLoading } = isDuplicatedEmailAPI({ onSuccess, onError });

  const isDisabled = useMemo(
    () => Boolean(!fullname || !email || !password || !confirmPassword),
    [fullname, email, password, confirmPassword],
  );

  interface IFormInput {
    fullname: string;
    email: string;
    password: string;
    passwordCheck: string;
  }

  const onClickNext = (data: IFormInput) => {
    if (Object.keys(errors).length === 0) {
      if (emailValue !== me?.email) {
        setIsDuplicatedEmail(false);
      }

      if (!emailValue || !isDuplicatedEmail) {
        toast({
          title: '이메일 중복 확인을 해주세요.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const { passwordCheck, ...rest } = data;

      onSaveSignup({ ...me, ...rest, passwordCheck });
      router.push('/join/3');
    }
  };

  const {
    watch,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<any>();

  const emailValue = watch('email');

  const handleIsDuplicated = () => {
    if (emailValue !== me?.email) {
      setIsDuplicatedEmail(false);
    }

    if (!emailValue) {
      toast({
        title: '이메일을 입력하세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    isDuplicatedEmailMutate(emailValue);
  };

  const handleBack = () => {
    router.push('/join/1');
  };

  return (
    <form onSubmit={handleSubmit(onClickNext)}>
      {/* 이름 */}
      <A.InputContainer>
        <FormControl isInvalid={Boolean(errors.fullName)}>
          <FormLabel htmlFor="fullName">이름</FormLabel>
          <Input
            id="fullName"
            placeholder="이름을 입력하세요"
            variant="flushed"
            borderColor="outlineColor"
            focusBorderColor="inputFocusColor"
            defaultValue={me?.fullName || watch('fullName')}
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

      {/* 이메일 */}
      <A.InputContainer>
        <FormControl isInvalid={Boolean(errors.email)}>
          <FormLabel htmlFor="email">이메일</FormLabel>
          <InputGroup size="md" variant="flushed">
            <Input
              id="email"
              placeholder="이메일을 입력하세요"
              pr="4.5rem"
              variant="flushed"
              borderColor="outlineColor"
              focusBorderColor="inputFocusColor"
              defaultValue={me?.email || watch('email')}
              {...register('email', {
                required: '이메일은 필수 입력사항입니다.',
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '유효한 이메일 주소를 입력하세요.',
                },
                maxLength: {
                  value: 50,
                  message: '이메일 주소가 너무 깁니다.',
                },
              })}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleIsDuplicated}
                isLoading={isLoading}
                isDisabled={!emailValue || errors.email ? true : false}
              >
                중복 확인
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.email && errors.email?.message?.toString()}</FormErrorMessage>
        </FormControl>
      </A.InputContainer>

      {/* 비밀번호 */}
      <A.InputContainer>
        <FormControl isInvalid={Boolean(errors.password)}>
          <FormLabel htmlFor="password">비밀번호</FormLabel>
          <InputGroup size="md" variant="flushed">
            <Input
              id="password"
              placeholder="비밀번호을 입력하세요"
              pr="4.5rem"
              variant="flushed"
              borderColor="outlineColor"
              focusBorderColor="inputFocusColor"
              type={showPassword ? 'text' : 'password'}
              defaultValue={me?.password || watch('password')}
              {...register('password', {
                required: '필수 입력사항 입니다.',
                pattern: {
                  value: /^[a-zA-Z0-9.\-]{6,16}$/,
                  message: '영어 소문자 6자~16자, (특수문자 . - 만 허용)',
                },
              })}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                {showPassword ? '보기' : '숨기기'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password && errors.password?.message?.toString()}</FormErrorMessage>
        </FormControl>
      </A.InputContainer>

      {/* 비밀번호 확인 */}
      <A.InputContainer>
        <FormControl isInvalid={Boolean(errors.passwordCheck)}>
          <FormLabel htmlFor="passwordCheck">비밀번호 확인</FormLabel>
          <InputGroup size="md" variant="flushed">
            <Input
              id="passwordCheck"
              placeholder="비밀번호를 다시 입력하세요"
              pr="4.5rem"
              variant="flushed"
              borderColor="outlineColor"
              focusBorderColor="inputFocusColor"
              type={showConfirmPassword ? 'text' : 'password'}
              defaultValue={me?.passwordCheck || watch('passwordCheck')}
              {...register('passwordCheck', {
                required: '필수 입력사항 입니다.',
                validate: (val: string) => {
                  if (watch('password') !== val) {
                    return '입력하신 비밀번호/비밀번호 확인이 일치하지 않습니다.';
                  }
                },
              })}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShowConfirmPassword}>
                {showConfirmPassword ? '보기' : '숨기기'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.passwordCheck && errors.passwordCheck?.message?.toString()}</FormErrorMessage>
        </FormControl>
      </A.InputContainer>

      {/* onClick={onClickNext} */}
      {/* isDisabled={isDisabled} */}
      <JoinBackButton step={1} />
      <A.ConfirmButton colorScheme="teal" size="md" type="submit">
        다음
      </A.ConfirmButton>
    </form>
  );
}

export default StepTwo;
