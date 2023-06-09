import Head from 'next/head';
import Layout from '@/components/Layout';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAccessTokenStore } from '@/store/acceessTokenStore';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Drawer';

const CalendarView = dynamic(() => import('@/components/Calendar/CalendarView'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { getAccessToken } = useAccessTokenStore();
  const accessToken = getAccessToken();
  const toast = useToast();

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
    <>
      <Head>
        <title>Need More Task · Calendar</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout hasHeader>
        <CalendarView />
        <Sidebar />
      </Layout>
    </>
  );
}
