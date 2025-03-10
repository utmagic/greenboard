'use server';

import { getDb } from "@/db";
import { annualProfitData, departments, metrics, profitData } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface MetricData {
  title: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ProfitData {
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
}

export interface ChartData {
  department: string;
  'This year': number;
  'Target': number;
  'Last year': number;
}

// 메트릭 데이터 가져오기
export async function getMetricsData(year: number = 2024): Promise<MetricData[]> {
  const db = getDb();
  if (!db) {
    throw new Error('데이터베이스 연결 실패');
  }

  try {
    const metricsResult = await db.select().from(metrics).where(eq(metrics.year, year));
    return metricsResult.map(metric => ({
      title: metric.title,
      value: metric.value,
      percentage: metric.percentage,
      color: metric.color,
    }));
  } catch (error) {
    console.error('메트릭 데이터 가져오기 오류:', error);
    throw error;
  }
}

// 수익 테이블 데이터 가져오기
export async function getProfitTableData(year: number = 2024): Promise<ProfitData[]> {
  const db = getDb();
  if (!db) {
    throw new Error('데이터베이스 연결 실패');
  }

  try {
    // 부서 데이터 가져오기
    const departmentsResult = await db.select().from(departments);
    const departmentMap = departmentsResult.reduce((acc, dept) => {
      acc[dept.id] = dept.name;
      return acc;
    }, {} as Record<number, string>);

    // 수익 테이블 데이터 가져오기
    const profitDataResult = await db.select().from(profitData).where(eq(profitData.year, year));
    return profitDataResult.map(data => ({
      department: departmentMap[data.departmentId],
      grossProfit: {
        actual: data.grossProfitActual,
        index: data.grossProfitIndex,
        completionRate: data.grossProfitCompletionRate,
      },
      netProfit: {
        actual: data.netProfitActual,
        index: data.netProfitIndex,
        completionRate: data.netProfitCompletionRate,
      },
    }));
  } catch (error) {
    console.error('수익 테이블 데이터 가져오기 오류:', error);
    throw error;
  }
}

// 차트 데이터 가져오기
export async function getChartData(year: number = 2024): Promise<ChartData[]> {
  const db = getDb();
  if (!db) {
    throw new Error('데이터베이스 연결 실패');
  }

  try {
    // 부서 데이터 가져오기
    const departmentsResult = await db.select().from(departments);
    const departmentMap = departmentsResult.reduce((acc, dept) => {
      acc[dept.id] = dept.name;
      return acc;
    }, {} as Record<number, string>);

    // 차트 데이터 가져오기
    const chartDataResult = await db.select().from(annualProfitData).where(eq(annualProfitData.year, year));
    return chartDataResult.map(data => ({
      department: departmentMap[data.departmentId],
      'This year': data.thisYear,
      'Target': data.target,
      'Last year': data.lastYear,
    }));
  } catch (error) {
    console.error('차트 데이터 가져오기 오류:', error);
    throw error;
  }
} 