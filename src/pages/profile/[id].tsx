import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import * as P from '@/styles/profile.styles';
import ProfileImage from '@/components/CommonHeader/ProfileImage';
import CommonFooter from '@/components/common/CommonFooter';
import { useUserInfo } from '@/store/userInfoStore';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ProfileAccountInfo from '@/components/Profile/ProfileAccountInfo';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/apis/configs';
import { useRouter } from 'next/router';
import { getUserInfoAPI } from '@/apis/user';
import { useAccessTokenStore } from '@/store/acceessTokenStore';
import { Box, Skeleton, SkeletonCircle, SkeletonText, Stack, useToast } from '@chakra-ui/react';
import Head from 'next/head';
import ProfileRoleInfo from '@/components/Profile/ProfileRoleInfo';

interface IProfilePage {
  id: string;
}

function ProfilePage({ id }: IProfilePage) {
  const toast = useToast();
  const router = useRouter();
  const { userInfo: currentLoginUserInfo } = useUserInfo();

  const { getAccessToken } = useAccessTokenStore();
  const accessToken = getAccessToken();

  const [tab, setTab] = useState('UserInfoTab');

  const { data: userInfo } = accessToken && id ? getUserInfoAPI(id) : { data: null };

  useEffect(() => {
    if (!accessToken) {
      toast({
        title: '인증되지 않은 사용자는 접근할 수 없습니다.',
        description: '로그인 페이지로 이동합니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      router.push('/login');
    }
  }, [accessToken]);

  return (
    <Layout hasHeader>
      <Head>
        <title>Need More Task · {userInfo?.data.fullName} 프로필</title>
      </Head>
      <P.Container>
        <P.LeftContainer>
          <P.AsideWrapper>
            {/* Profile info */}
            <P.ProfileWrapper>
              <SkeletonCircle size="100" isLoaded={Boolean(userInfo)} fadeDuration={1}>
                {userInfo && <ProfileImage width={100} height={100} src={userInfo?.data.profileImageUrl} />}
              </SkeletonCircle>

              {/* <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="2" isLoaded={Boolean(userInfo)}> */}
              <h3>{userInfo?.data?.fullName}</h3>
              <span>{userInfo?.data?.email}</span>
              {/* </SkeletonText> */}
            </P.ProfileWrapper>

            {/* NavList */}
            <P.NavWrapper>
              <nav>
                <ul>
                  <li onClick={() => setTab('UserInfoTab')} className={tab === 'UserInfoTab' ? 'selected' : ''}>
                    <AccountCircleOutlinedIcon />
                    <div>
                      <h4>계정 정보</h4>
                      <span>프로필 사진, 이름</span>
                    </div>
                  </li>

                  {currentLoginUserInfo?.role === 'ADMIN' && (
                    <li onClick={() => setTab('UserRoleTab')} className={tab === 'UserRoleTab' ? 'selected' : ''}>
                      <AccountCircleOutlinedIcon />
                      <div>
                        <h4>사용자 권한 설정</h4>
                        {/* <span>프로필 사진, 이름</span> */}
                      </div>
                    </li>
                  )}
                </ul>
              </nav>
            </P.NavWrapper>
          </P.AsideWrapper>
        </P.LeftContainer>

        {/* 개인정보 */}

        {userInfo && currentLoginUserInfo && (
          <P.RightContainer>
            {tab === 'UserInfoTab' && (
              <ProfileAccountInfo userInfo={userInfo.data} currentLoginUserInfo={currentLoginUserInfo} />
            )}

            {currentLoginUserInfo.role === 'ADMIN' ? (
              <>
                {tab === 'UserRoleTab' && (
                  <ProfileRoleInfo userInfo={userInfo.data} currentLoginUserInfo={currentLoginUserInfo} />
                )}
              </>
            ) : (
              ''
            )}
          </P.RightContainer>
        )}
      </P.Container>

      {/* common footer */}
      <CommonFooter />
    </Layout>
  );
}

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();
  const queryKey = `/profile/${params?.id}`;
  const queryFn = () => axiosInstance.get(queryKey).then((res) => res.data);

  await queryClient.prefetchQuery([queryKey], queryFn);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      id: params?.id,
    },
  };
};
