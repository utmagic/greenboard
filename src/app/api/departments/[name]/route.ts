import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { departments, profitData, monthlyProfitData, annualProfitData, monthlyChartData } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : 2024;
  const name = decodeURIComponent(params.name);
  
  try {
    const db = getDb();
    if (!db) {
      throw new Error('데이터베이스 연결 실패');
    }
    
    // 부서 ID 가져오기
    const departmentResult = await db.select().from(departments)
      .where(eq(departments.name, name))
      .limit(1);
    
    if (departmentResult.length === 0) {
      return NextResponse.json({ error: '부서를 찾을 수 없습니다' }, { status: 404 });
    }
    
    const departmentId = departmentResult[0].id;
    
    // 연간 수익 데이터 가져오기
    const profitDataResult = await db.select().from(profitData)
      .where(and(
        eq(profitData.departmentId, departmentId),
        eq(profitData.year, year)
      ))
      .limit(1);
    
    // 월별 수익 데이터 가져오기
    const monthlyProfitDataResult = await db.select().from(monthlyProfitData)
      .where(and(
        eq(monthlyProfitData.departmentId, departmentId),
        eq(monthlyProfitData.year, year)
      ));
    
    // 연간 차트 데이터 가져오기
    const chartDataResult = await db.select().from(annualProfitData)
      .where(and(
        eq(annualProfitData.departmentId, departmentId),
        eq(annualProfitData.year, year)
      ))
      .limit(1);
    
    // 월별 차트 데이터 가져오기
    const monthlyChartDataResult = await db.select().from(monthlyChartData)
      .where(and(
        eq(monthlyChartData.departmentId, departmentId),
        eq(monthlyChartData.year, year)
      ));
    
    if (profitDataResult.length === 0 || chartDataResult.length === 0) {
      return NextResponse.json({ error: '데이터를 찾을 수 없습니다' }, { status: 404 });
    }
    
    // 데이터베이스에서 가져온 데이터만 반환
    return NextResponse.json({
      name,
      profitData: {
        grossProfit: {
          actual: profitDataResult[0].grossProfitActual,
          index: profitDataResult[0].grossProfitIndex,
          completionRate: profitDataResult[0].grossProfitCompletionRate,
        },
        netProfit: {
          actual: profitDataResult[0].netProfitActual,
          index: profitDataResult[0].netProfitIndex,
          completionRate: profitDataResult[0].netProfitCompletionRate,
        }
      },
      monthlyProfitData: monthlyProfitDataResult.map(mpd => ({
        month: mpd.month,
        grossProfit: {
          actual: mpd.grossProfitActual,
          index: mpd.grossProfitIndex,
          completionRate: mpd.grossProfitCompletionRate,
        },
        netProfit: {
          actual: mpd.netProfitActual,
          index: mpd.netProfitIndex,
          completionRate: mpd.netProfitCompletionRate,
        }
      })),
      annualData: {
        thisYear: chartDataResult[0].thisYear,
        target: chartDataResult[0].target,
        lastYear: chartDataResult[0].lastYear,
      },
      monthlyChartData: monthlyChartDataResult.map(mcd => ({
        month: mcd.month,
        thisYear: mcd.thisYear,
        target: mcd.target,
        lastYear: mcd.lastYear,
      }))
    });
  } catch (error) {
    console.error('부서 데이터 가져오기 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
} 