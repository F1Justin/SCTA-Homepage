import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '社团活动方案库 | 上海高校东方联合会',
  description: '上海高校东方联合会活动方案库，为各高校东方社团提供活动策划参考。',
};

export default function ActivityLibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 