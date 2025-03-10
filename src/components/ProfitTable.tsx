"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from '@/db';
import { departments, profitData } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';

interface ProfitTableProps {
  data: {
    department: string;
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
  }[];
  selectedYear: number;
}

// Tableau 색상 팔레트
const tableauColors = {
  positive: '#59a14f',  // Tableau Green
  negative: '#e15759',  // Tableau Red
  headerBg: '#d9e8f5', // Tableau Light Blue
  headerBorder: '#4e79a7', // Tableau Blue
  rowEven: '#f5f8fa', // Light Blue-Gray
  rowOdd: '#ffffff', // White
  cellBorder: '#d9e8f5', // Tableau Light Blue
};

const ProfitTable: React.FC<ProfitTableProps> = ({ data, selectedYear }) => {
  const router = useRouter();
  
  // 부서 상세 페이지로 이동하는 함수
  const handleDepartmentClick = (department: string) => {
    // Total은 상세 페이지가 없으므로 제외
    if (department !== 'Total') {
      router.push(`/details/department/${encodeURIComponent(department)}?year=${selectedYear}`);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="py-1 px-3">
        <CardTitle className="text-base font-bold">부서별 수익 현황 (10k RMB)</CardTitle>
      </CardHeader>
      <CardContent className="py-1 px-2">
        <div className="overflow-x-auto">
          <Table className="border-collapse text-sm">
            <TableHeader style={{ backgroundColor: tableauColors.headerBg }}>
              <TableRow className="h-7">
                <TableHead className="text-center font-bold border p-1" style={{ borderColor: tableauColors.headerBorder }}>부서</TableHead>
                <TableHead colSpan={3} className="text-center font-bold border p-1" style={{ borderColor: tableauColors.headerBorder }}>영업이익</TableHead>
                <TableHead colSpan={3} className="text-center font-bold border p-1" style={{ borderColor: tableauColors.headerBorder }}>순이익</TableHead>
              </TableRow>
              <TableRow className="h-7">
                <TableHead className="border p-1" style={{ borderColor: tableauColors.headerBorder }}></TableHead>
                <TableHead className="text-center font-bold border p-1" style={{ borderColor: tableauColors.headerBorder }}>실적</TableHead>
                <TableHead className="text-center font-bold border p-1" style={{ borderColor: tableauColors.headerBorder }}>목표</TableHead>
                <TableHead className="text-center font-bold border p-1" style={{ borderColor: tableauColors.headerBorder }}>달성률</TableHead>
                <TableHead className="text-center font-bold border p-1" style={{ borderColor: tableauColors.headerBorder }}>실적</TableHead>
                <TableHead className="text-center font-bold border p-1" style={{ borderColor: tableauColors.headerBorder }}>목표</TableHead>
                <TableHead className="text-center font-bold border p-1" style={{ borderColor: tableauColors.headerBorder }}>달성률</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.department} className="h-7" style={{ backgroundColor: index % 2 === 0 ? tableauColors.rowEven : tableauColors.rowOdd }}>
                  <TableCell 
                    className="border p-1" 
                    style={{ 
                      borderColor: tableauColors.cellBorder,
                      cursor: item.department !== 'Total' ? 'pointer' : 'default',
                      color: item.department !== 'Total' ? '#4e79a7' : 'inherit',
                      textDecoration: item.department !== 'Total' ? 'underline' : 'none',
                    }}
                    onClick={() => handleDepartmentClick(item.department)}
                  >
                    {item.department}
                  </TableCell>
                  <TableCell className="text-right border p-1" style={{ borderColor: tableauColors.cellBorder }}>{item.grossProfit.actual.toFixed(2)}</TableCell>
                  <TableCell className="text-right border p-1" style={{ borderColor: tableauColors.cellBorder }}>{item.grossProfit.index.toFixed(2)}</TableCell>
                  <TableCell className="text-right border p-1" style={{ borderColor: tableauColors.cellBorder }}>
                    <span style={{ color: item.grossProfit.completionRate >= 100 ? tableauColors.positive : tableauColors.negative }}>
                      {item.grossProfit.completionRate.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right border p-1" style={{ borderColor: tableauColors.cellBorder }}>{item.netProfit.actual.toFixed(2)}</TableCell>
                  <TableCell className="text-right border p-1" style={{ borderColor: tableauColors.cellBorder }}>{item.netProfit.index.toFixed(2)}</TableCell>
                  <TableCell className="text-right border p-1" style={{ borderColor: tableauColors.cellBorder }}>
                    <span style={{ color: item.netProfit.completionRate >= 100 ? tableauColors.positive : tableauColors.negative }}>
                      {item.netProfit.completionRate.toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitTable; 