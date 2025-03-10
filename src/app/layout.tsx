import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import type { Metadata } from 'next';
import { NextAuthProvider } from '@/lib/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "경영 정보 시스템",
  description: "회사의 재무 상태와 수익 센터 성과를 분석하고 모니터링하는 통합 대시보드 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
