"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

interface MetricCardProps {
  title: string;
  value: number;
  percentage: number;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  percentage,
  color,
}) => {
  const router = useRouter();
  
  // 색상 매핑
  const colorMap = {
    'tableau-blue': '#4e79a7',
    'tableau-orange': '#f28e2c',
    'tableau-green': '#59a14f',
    'tableau-red': '#e15759',
  };
  
  const strokeColor = colorMap[color as keyof typeof colorMap] || '#4e79a7';
  const textColor = strokeColor;
  
  // 상세 페이지로 이동하는 함수
  const handleCardClick = () => {
    // 로컬 스토리지에서 선택된 연도 가져오기
    const selectedYear = localStorage.getItem('selectedYear') || '2024';
    router.push(`/details/metric/${encodeURIComponent(title)}?year=${selectedYear}`);
  };
  
  return (
    <Card 
      className="h-full cursor-pointer transition-all hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between py-1 px-3">
        <CardTitle className="text-base font-bold">{title}</CardTitle>
        <span className="text-xl">≡</span>
      </CardHeader>
      <CardContent className="py-1 px-3">
        <div className="flex items-center justify-center space-x-2">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold" style={{ color: textColor }}>{percentage.toFixed(2)}%</span>
            </div>
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                className="stroke-gray-200"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ stroke: strokeColor }}
              />
            </svg>
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-xl font-semibold">{value.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard; 