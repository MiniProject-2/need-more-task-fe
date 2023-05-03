import Head from 'next/head';
import Button from '@/components/common/CommonButton';
import Layout from '@/components/Layout';
import CalendarPage from './CalendarPage';

export default function Home() {
  return (
    <>
      <Head>
        <title>Need More Task</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <CalendarPage />
      </Layout>
    </>
  );
}
