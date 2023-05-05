import React from 'react';
import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';

const ComponentsWithNoSSR = dynamic(() => import('@/components/Calendar/CalendarView'), { ssr: false });

function CalendarPage() {
  return (
    <Layout>
      <ComponentsWithNoSSR />
    </Layout>
  );
}

export default CalendarPage;