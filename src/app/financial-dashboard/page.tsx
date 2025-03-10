import { seedDatabase } from '@/db';
import FinancialDashboardClient from './client';

export default async function FinancialDashboard() {
  try {
    // 데이터베이스 초기화 (서버 컴포넌트에서 수행)
    await seedDatabase();
    
    // 클라이언트 컴포넌트로 렌더링 위임
    return <FinancialDashboardClient />;
  } catch (error) {
    console.error('데이터 로딩 오류:', error);
    return (
      <div className="container mx-auto py-1 px-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold text-red-600 mb-1">오류가 발생했습니다</h1>
          <p className="text-gray-600 text-xs">데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }
} 