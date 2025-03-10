"use client";

import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import DepartmentProfitChart from './DepartmentProfitChart';
import ProfitTable from './ProfitTable';
import { ChartData, MetricData, ProfitData } from '@/app/actions';

interface DashboardProps {
  initialMetricsData: MetricData[];
  initialProfitTableData: ProfitData[];
  initialChartData: ChartData[];
  metricsData2025: MetricData[];
  profitTableData2025: ProfitData[];
  chartData2025: ChartData[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  initialMetricsData, 
  initialProfitTableData, 
  initialChartData,
  metricsData2025,
  profitTableData2025,
  chartData2025
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  
  // DB에서 가져온 데이터 사용
  const metricsDataByYear = {
    2024: initialMetricsData.map(metric => ({
      ...metric,
      title: metric.title === "Net Profit" ? "순이익" :
             metric.title === "Sale" ? "매출" :
             metric.title === "Receivables" ? "미수금" :
             metric.title === "Stock" ? "재고" : metric.title
    })),
    2025: metricsData2025
  };

  const profitTableDataByYear = {
    2024: initialProfitTableData,
    2025: profitTableData2025
  };

  const chartDataByYear = {
    2024: initialChartData,
    2025: chartData2025
  };

  // 연도 변경 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    // 로컬 스토리지에 선택한 연도 저장
    localStorage.setItem('selectedYear', year.toString());
  };

  // 컴포넌트 마운트 시 로컬 스토리지에서 연도 불러오기
  useEffect(() => {
    const savedYear = localStorage.getItem('selectedYear');
    if (savedYear) {
      setSelectedYear(Number(savedYear));
    }
  }, []);

  return (
    <div className="p-2 mx-auto max-w-7xl bg-gray-50">
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <div className="text-gray-600 font-semibold">연간 실적 현황</div>
          <div className="flex items-center space-x-1">
            <div className="text-gray-600 font-semibold mr-2">(주)한화 글로벌</div>
            <div className="flex items-center">
              <label htmlFor="year-select" className="mr-1 text-gray-700 font-medium">년도:</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                className="px-2 py-0.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
          </div>
        </div>
        
        <p className="text-gray-500 mt-0.5 text-center text-sm">
          {selectedYear === 2025 ? '1분기' : '연간'} 실적 현황
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
        {metricsDataByYear[selectedYear].map((metric, index) => (
          <div key={index}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              percentage={metric.percentage}
              color={metric.color}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
        <div>
          <ProfitTable data={profitTableDataByYear[selectedYear]} selectedYear={selectedYear} />
        </div>
        <div>
          <DepartmentProfitChart data={chartDataByYear[selectedYear]} selectedYear={selectedYear} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 