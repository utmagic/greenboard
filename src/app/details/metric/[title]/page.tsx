"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

// Tableau 색상 팔레트
const tableauColors = {
  'value': '#4e79a7',  // Tableau Blue
  'percentage': '#f28e2c',  // Tableau Orange
  'target': '#59a14f',  // Tableau Green
};

interface MonthlyData {
  month: string;
  value: number;
  percentage: number;
}

interface MetricData {
  title: string;
  value: number;
  percentage: number;
  color: string;
  monthlyData: MonthlyData[];
}

const MetricDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const title = params.title as string;
  const decodedTitle = decodeURIComponent(title);
  
  // URL 쿼리 파라미터에서 연도 가져오기
  const yearParam = searchParams.get('year');
  const [selectedYear, setSelectedYear] = useState<number>(yearParam ? parseInt(yearParam) : 2024);
  const [metricData, setMetricData] = useState<MetricData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/metrics?title=${encodeURIComponent(decodedTitle)}&year=${selectedYear}`);
        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다');
        }
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        
        // API에서 반환된 데이터 그대로 사용
        setMetricData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다');
        console.error('데이터 가져오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [decodedTitle, selectedYear]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }
  
  if (!metricData || !metricData.monthlyData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">데이터가 없습니다</div>
      </div>
    );
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
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{metricData.title} 월별 상세 데이터</h1>
        <p className="text-gray-500 mt-2">{selectedYear === 2025 ? '1분기' : '연간'} 실적 현황</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>월별 {metricData.title} 값</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricData.monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="값" fill={tableauColors.value} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>월별 {metricData.title} 달성률 (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metricData.monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 120]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    name="달성률 (%)" 
                    stroke={tableauColors.percentage} 
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
            <CardTitle>{metricData.title} 월별 데이터 테이블</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">월</th>
                    <th className="border p-2 text-right">값</th>
                    <th className="border p-2 text-right">달성률 (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {metricData.monthlyData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border p-2">{item.month}</td>
                      <td className="border p-2 text-right">{item.value.toFixed(2)}</td>
                      <td className="border p-2 text-right">
                        <span style={{ 
                          color: item.percentage >= 100 ? tableauColors.target : tableauColors.percentage 
                        }}>
                          {item.percentage.toFixed(2)}%
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

export default MetricDetailPage; 