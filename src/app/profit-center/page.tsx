import Dashboard from '@/components/Dashboard';
import { seedDatabase } from '@/db';
import { getChartData, getMetricsData, getProfitTableData } from '../actions';

export default async function ProfitCenter() {
  try {
    // 데이터베이스 초기화
    await seedDatabase();
    
    // 2024년 데이터 가져오기
    const [metricsData2024, profitTableData2024, chartData2024] = await Promise.all([
      getMetricsData(2024),
      getProfitTableData(2024),
      getChartData(2024)
    ]);
    
    // 2025년 데이터 가져오기
    const [metricsData2025, profitTableData2025, chartData2025] = await Promise.all([
      getMetricsData(2025),
      getProfitTableData(2025),
      getChartData(2025)
    ]);

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Profit Center</h1>
        <Dashboard 
          initialMetricsData={metricsData2024}
          initialProfitTableData={profitTableData2024}
          initialChartData={chartData2024}
          metricsData2025={metricsData2025}
          profitTableData2025={profitTableData2025}
          chartData2025={chartData2025}
        />
      </div>
    );
  } catch (error) {
    console.error('데이터 로딩 오류:', error);
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
          <p className="text-gray-600">데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }
} 