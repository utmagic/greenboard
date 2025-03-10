"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

// Tableau 색상 팔레트
const tableauColors = {
  'grossActual': '#4e79a7',  // Tableau Blue
  'grossIndex': '#f28e2c',   // Tableau Orange
  'netActual': '#59a14f',    // Tableau Green
  'netIndex': '#e15759',     // Tableau Red
  'positive': '#59a14f',     // Tableau Green
  'negative': '#e15759',     // Tableau Red
  'thisYear': '#4e79a7',     // Tableau Blue
  'target': '#f28e2c',       // Tableau Orange
  'lastYear': '#59a14f',     // Tableau Green
};

interface MonthlyProfitData {
  month: string;
  grossProfit: {
    actual: number;
    index: number;
    completionRate: number;
  };
  netProfit: {
    actual: number;
    index: number;
    completionRate: number;
  };
}

interface MonthlyChartData {
  month: string;
  thisYear: number;
  target: number;
  lastYear: number;
}

interface DepartmentData {
  name: string;
  profitData: {
    grossProfit: {
      actual: number;
      index: number;
      completionRate: number;
    };
    netProfit: {
      actual: number;
      index: number;
      completionRate: number;
    };
  };
  monthlyProfitData: MonthlyProfitData[];
  annualData: {
    thisYear: number;
    target: number;
    lastYear: number;
  };
  monthlyChartData: MonthlyChartData[];
}

const DepartmentDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const name = params.name as string;
  const decodedName = decodeURIComponent(name);
  
  // URL 쿼리 파라미터에서 연도 가져오기
  const yearParam = searchParams.get('year');
  const [selectedYear, setSelectedYear] = useState<number>(yearParam ? parseInt(yearParam) : 2024);
  const [departmentData, setDepartmentData] = useState<DepartmentData | null>(null);
  
  // 컴포넌트 마운트 시 로컬 스토리지에 연도 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedYear', selectedYear.toString());
    }
  }, [selectedYear]);
  
  // 서버에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/departments/${encodeURIComponent(decodedName)}?year=${selectedYear}`);
        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다');
        }
        
        const data = await response.json();
        if (data) {
          // API에서 반환된 데이터 그대로 사용
          setDepartmentData(data);
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };
    
    fetchData();
  }, [decodedName, selectedYear]);
  
  if (!departmentData) {
    return <div className="p-8">데이터를 불러오는 중...</div>;
  }

  // 연도 변경 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    
    // URL 업데이트
    const url = new URL(window.location.href);
    url.searchParams.set('year', year.toString());
    window.history.pushState({}, '', url);
    
    // 로컬 스토리지에 선택한 연도 저장
    localStorage.setItem('selectedYear', year.toString());
  };
  
  return (
    <div className="p-4 md:p-10 mx-auto max-w-7xl bg-gray-50">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Link href="/profit-center" className="text-blue-600 hover:underline">← 대시보드로 돌아가기</Link>
          <div className="flex items-center space-x-2">
            <div className="text-gray-600 font-semibold mr-4">(주)한화 글로벌</div>
            <div className="flex items-center">
              <label htmlFor="year-select" className="mr-2 text-gray-700 font-medium">년도:</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{departmentData.name} 월별 상세 데이터</h1>
        <p className="text-gray-500 mt-2">{selectedYear === 2025 ? '1분기' : '연간'} 실적 현황</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>월별 총 수익 및 순 수익 (실제)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData.monthlyProfitData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="grossProfit.actual" name="총 수익 (실제)" fill={tableauColors.grossActual} />
                  <Bar dataKey="netProfit.actual" name="순 수익 (실제)" fill={tableauColors.netActual} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>월별 총 수익 달성률 (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={departmentData.monthlyProfitData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 150]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="grossProfit.completionRate" 
                    name="총 수익 달성률" 
                    stroke={tableauColors.grossActual} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netProfit.completionRate" 
                    name="순 수익 달성률" 
                    stroke={tableauColors.netActual} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  {/* 목표선 (100%) */}
                  <Line 
                    type="monotone" 
                    dataKey={() => 100} 
                    name="목표" 
                    stroke={tableauColors.target} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>월별 연간 총 수익 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={departmentData.monthlyChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="thisYear" 
                    name="금년" 
                    stroke={tableauColors.thisYear} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="목표" 
                    stroke={tableauColors.target} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lastYear" 
                    name="전년" 
                    stroke={tableauColors.lastYear} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>월별 데이터 테이블</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">월</th>
                    <th className="border p-2 text-right">총 수익 (실제)</th>
                    <th className="border p-2 text-right">총 수익 달성률 (%)</th>
                    <th className="border p-2 text-right">순 수익 (실제)</th>
                    <th className="border p-2 text-right">순 수익 달성률 (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.monthlyProfitData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border p-2">{item.month}</td>
                      <td className="border p-2 text-right">{item.grossProfit.actual.toFixed(2)}</td>
                      <td className="border p-2 text-right">
                        <span style={{ 
                          color: item.grossProfit.completionRate >= 100 ? tableauColors.positive : tableauColors.negative 
                        }}>
                          {item.grossProfit.completionRate.toFixed(2)}%
                        </span>
                      </td>
                      <td className="border p-2 text-right">{item.netProfit.actual.toFixed(2)}</td>
                      <td className="border p-2 text-right">
                        <span style={{ 
                          color: item.netProfit.completionRate >= 100 ? tableauColors.positive : tableauColors.negative 
                        }}>
                          {item.netProfit.completionRate.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentDetailPage; 