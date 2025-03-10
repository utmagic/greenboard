import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { metrics, monthlyMetrics } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : 2024;
  
  if (!title) {
    return NextResponse.json({ error: '제목이 필요합니다' }, { status: 400 });
  }
  
  try {
    const db = getDb();
    if (!db) {
      throw new Error('데이터베이스 연결 실패');
    }
    
    // 영어 제목과 한글 제목 모두 검색
    let metricData;
    
    // 한글 제목으로 검색
    metricData = await db.select().from(metrics)
      .where(and(
        eq(metrics.title, title),
        eq(metrics.year, year)
      ))
      .limit(1);
    
    // 결과가 없으면 영어 제목으로 변환하여 검색
    if (metricData.length === 0) {
      const englishTitle = 
        title === "순이익" ? "Net Profit" :
        title === "매출" ? "Sale" :
        title === "미수금" ? "Receivables" :
        title === "재고" ? "Stock" : title;
      
      metricData = await db.select().from(metrics)
        .where(and(
          eq(metrics.title, englishTitle),
          eq(metrics.year, year)
        ))
        .limit(1);
    }
    
    if (metricData.length === 0) {
      return NextResponse.json({ error: '데이터를 찾을 수 없습니다' }, { status: 404 });
    }
    
    // 월별 데이터 가져오기
    const monthlyData = await db.select().from(monthlyMetrics)
      .where(and(
        eq(monthlyMetrics.metricId, metricData[0].id),
        eq(monthlyMetrics.year, year)
      ));
    
    // 데이터베이스에서 가져온 데이터만 반환
    return NextResponse.json({
      title,
      value: metricData[0].value,
      percentage: metricData[0].percentage,
      color: metricData[0].color,
      monthlyData: monthlyData.map(md => ({
        month: md.month,
        value: md.value,
        percentage: md.percentage
      }))
    });
  } catch (error) {
    console.error('메트릭 데이터 가져오기 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
} 