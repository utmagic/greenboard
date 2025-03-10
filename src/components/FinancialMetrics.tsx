'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Card } from './ui/card';

interface FinancialMetricsProps {
  initialData?: any;
}

export default function FinancialMetrics({ initialData }: FinancialMetricsProps) {
  const [data, setData] = useState(initialData);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<string>('Mar');
  const [availableYears, setAvailableYears] = useState<number[]>([2024, 2025]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([
    'Jan', 'Feb', 'Mar'
  ]);

  // Tableau 색상 팔레트 정의
  const tableauColors = {
    blue: '#4e79a7',
    orange: '#f28e2c',
    green: '#59a14f',
    red: '#e15759',
    purple: '#b07aa1',
    brown: '#9c755f',
    pink: '#ff9da7',
    gray: '#bab0ac',
    yellow: '#e9c46a',
    teal: '#76b7b2'
  };

  // 년도 변경 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    
    // 2025년은 1월~3월만 있음
    if (year === 2025) {
      setAvailableMonths(['Jan', 'Feb', 'Mar']);
      if (!['Jan', 'Feb', 'Mar'].includes(selectedMonth)) {
        setSelectedMonth('Mar');
      }
    } else {
      setAvailableMonths(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
      setSelectedMonth('Dec');
    }
  };

  // 월 변경 핸들러
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/financial-metrics?year=${selectedYear}&month=${selectedMonth}`);
        const result = await response.json();
        setData(result);
        
        // 사용 가능한 년도와 월 목록 업데이트
        if (result.availableYears) {
          setAvailableYears(result.availableYears);
        }
        
        if (result.availableMonths) {
          setAvailableMonths(result.availableMonths);
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  if (!data) return <div>Loading...</div>;

  const {
    financialMetrics,
    liquidityRatios,
    budgetVariance,
    vendorPayments,
  } = data;

  // 월 이름을 한글로 변환하는 함수
  const getMonthName = (month: string): string => {
    const monthMap: Record<string, string> = {
      'Jan': '1월', 'Feb': '2월', 'Mar': '3월', 'Apr': '4월', 
      'May': '5월', 'Jun': '6월', 'Jul': '7월', 'Aug': '8월', 
      'Sep': '9월', 'Oct': '10월', 'Nov': '11월', 'Dec': '12월'
    };
    return monthMap[month] || month;
  };

  // 선택된 년월 표시 문자열
  const selectedPeriodText = `${selectedYear}년 ${getMonthName(selectedMonth)}`;
  
  // 동적 메시지 생성 - 페이지 레이아웃으로 이동
  // const dynamicMessage = `${selectedPeriodText}를 기준으로 조회됩니다. 다른 년월을 선택하면 해당 시점까지의 데이터로 차트가 업데이트됩니다.`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 p-1">
      {/* 년월 선택 */}
      <div className="col-span-4 mb-2 flex justify-end items-center space-x-4">
        <div className="flex items-center">
          <label htmlFor="year-select" className="mr-2 text-sm font-medium">년도:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className="border rounded p-1 text-sm"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="month-select" className="mr-2 text-sm font-medium">월:</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border rounded p-1 text-sm"
          >
            {availableMonths.map(month => (
              <option key={month} value={month}>{getMonthName(month)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Working Capital */}
      <Card className="p-1 h-32">
        <h3 className="text-lg font-bold mb-0.5 text-center">운전자본</h3>
        <div className="flex items-center justify-center h-24">
          <div className="text-5xl font-bold text-center" style={{ color: tableauColors.blue }}>
            {financialMetrics.workingCapital.toLocaleString()}
          </div>
        </div>
      </Card>

      {/* Current Ratio */}
      <Card className="p-1 h-32">
        <h3 className="text-lg font-bold mb-0.5 text-center">유동비률 (%)</h3>
        <div className="flex items-center justify-center h-24">
          <div className="text-5xl font-bold text-center" style={{ color: tableauColors.green }}>
            {financialMetrics.ratios.current.toFixed(1)}
          </div>
        </div>
      </Card>

      {/* Quick Ratio */}
      <Card className="p-1 h-32">
        <h3 className="text-lg font-bold mb-0.5 text-center">당좌비률 (%)</h3>
        <div className="flex items-center justify-center h-24">
          <div className="text-5xl font-bold text-center" style={{ color: tableauColors.orange }}>
            {financialMetrics.ratios.quick.toFixed(1)}
          </div>
        </div>
      </Card>

      {/* Cash Flow Ratio */}
      <Card className="p-1 h-32">
        <h3 className="text-lg font-bold mb-0.5 text-center">현금흐름비률 (%)</h3>
        <div className="flex items-center justify-center h-24">
          <div className="text-5xl font-bold text-center" style={{ color: tableauColors.purple }}>
            {financialMetrics.ratios.cashFlow.toFixed(1)}
          </div>
        </div>
      </Card>

      {/* Liquidity Ratio Analysis */}
      <Card className="p-1 col-span-4">
        <h3 className="text-lg font-bold mb-1 text-center">
          유동성 비률 분석 (%) <span className="text-sm text-gray-500">[{selectedPeriodText}까지]</span>
        </h3>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liquidityRatios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} tickFormatter={getMonthName} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: `1px solid ${tableauColors.gray}` }} 
                       labelFormatter={getMonthName} />
              <Legend wrapperStyle={{ fontSize: '9px' }} />
              <Area
                type="monotone"
                dataKey="currentRatio"
                name="유동비률"
                stroke={tableauColors.green}
                fill={tableauColors.green}
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="quickRatio"
                name="당좌비률"
                stroke={tableauColors.blue}
                fill={tableauColors.blue}
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="cashFlowRatio"
                name="현금흐름비률"
                stroke={tableauColors.orange}
                fill={tableauColors.orange}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Budget Variance Analysis */}
      <Card className="p-1 col-span-2">
        <h3 className="text-lg font-bold mb-1 text-center">
          예산 변동 분석 <span className="text-sm text-gray-500">[{selectedPeriodText}까지]</span>
        </h3>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetVariance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: `1px solid ${tableauColors.gray}` }} />
              <Bar
                dataKey="amount"
                name="금액"
                fill={(d) => (d.amount >= 0 ? tableauColors.green : tableauColors.red)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Vendor Payment Error Rate */}
      <Card className="p-1 col-span-2">
        <h3 className="text-lg font-bold mb-1 text-center">
          공급업체 지불 오류률 (%) <span className="text-sm text-gray-500">[{selectedPeriodText}까지]</span>
        </h3>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vendorPayments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} tickFormatter={getMonthName} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: `1px solid ${tableauColors.gray}` }}
                       labelFormatter={getMonthName} />
              <Area
                type="monotone"
                dataKey="errorRate"
                name="오류률"
                stroke={tableauColors.red}
                fill={tableauColors.red}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Financial Details */}
      <Card className="p-1 col-span-4">
        <h3 className="text-lg font-bold mb-1 text-center">
          재무 세부 정보 <span className="text-sm text-gray-500">[{selectedPeriodText} 기준]</span>
        </h3>
        <div className="grid grid-cols-2 gap-1">
          <div>
            <h4 className="text-base font-bold mb-0.5 text-center" style={{ color: tableauColors.blue }}>유동자산</h4>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span>현금</span>
                <span>{financialMetrics.details.cash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>매출채권</span>
                <span>{financialMetrics.details.accountsReceivable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>재고자산</span>
                <span>{financialMetrics.details.inventory.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>선급비용</span>
                <span>{financialMetrics.details.prepaidExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold" style={{ color: tableauColors.blue }}>
                <span>유동자산 합계</span>
                <span>{financialMetrics.currentAssets.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-base font-bold mb-0.5 text-center" style={{ color: tableauColors.red }}>유동부채</h4>
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span>매입채무</span>
                <span>{financialMetrics.details.accountsPayable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>신용카드 부채</span>
                <span>{financialMetrics.details.creditCardDebit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>은행 운영 신용</span>
                <span>{financialMetrics.details.bankOperatingCredit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>미지급비용</span>
                <span>{financialMetrics.details.accruedExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>미지급세금</span>
                <span>{financialMetrics.details.taxesPayable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold" style={{ color: tableauColors.red }}>
                <span>유동부채 합계</span>
                <span>{financialMetrics.currentLiabilities.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 