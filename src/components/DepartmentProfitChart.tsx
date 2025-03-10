"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '@/db';
import { departments, annualProfitData } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';

interface DepartmentProfitChartProps {
  data: {
    department: string;
    'This year': number;
    'Target': number;
    'Last year': number;
  }[];
  selectedYear: number;
}

// Tableau 색상 팔레트
const tableauColors = {
  'This year': '#4e79a7',  // Tableau Blue
  'Target': '#f28e2c',     // Tableau Orange
  'Last year': '#59a14f',  // Tableau Green
};

const DepartmentProfitChart: React.FC<DepartmentProfitChartProps> = ({ data, selectedYear }) => {
  const router = useRouter();
  
  // 부서 상세 페이지로 이동하는 함수
  const handleBarClick = (data: any) => {
    const department = data.department;
    if (department && department !== 'Total') {
      router.push(`/details/department/${encodeURIComponent(department)}`);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="py-1 px-3">
        <CardTitle className="text-base font-bold">부서별 연간 영업이익 비교 (10k RMB)</CardTitle>
      </CardHeader>
      <CardContent className="py-1 px-2">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 5,
              }}
              onClick={(e) => e && e.activePayload && handleBarClick(e.activePayload[0].payload)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="This year" name="금년" fill={tableauColors['This year']} cursor="pointer" />
              <Bar dataKey="Target" name="목표" fill={tableauColors['Target']} cursor="pointer" />
              <Bar dataKey="Last year" name="전년" fill={tableauColors['Last year']} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-1 text-xs text-gray-500">
          <p>차트의 막대를 클릭하면 해당 부서의 상세 페이지로 이동합니다.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentProfitChart; 