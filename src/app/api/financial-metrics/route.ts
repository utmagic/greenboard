import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { budgetVariance, financialMetrics, vendorPayments } from "@/db/schema";
import { and, eq, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "데이터베이스 연결 실패" }, { status: 500 });
  }

  // URL 파라미터에서 년도와 월 가져오기
  const searchParams = request.nextUrl.searchParams;
  const year = parseInt(searchParams.get('year') || '2025');
  const month = searchParams.get('month') || 'Mar';

  try {
    // 해당 년도의 모든 데이터 가져오기
    const allMetricsForYear = await db.select().from(financialMetrics).where(eq(financialMetrics.year, year));
    
    // 선택한 월까지의 데이터만 필터링
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const selectedMonthIndex = monthOrder.indexOf(month);
    
    if (selectedMonthIndex === -1) {
      return NextResponse.json({ error: "잘못된 월 형식입니다" }, { status: 400 });
    }
    
    // 선택한 월까지의 데이터만 필터링
    const allMetrics = allMetricsForYear.filter(m => 
      monthOrder.indexOf(m.month) <= selectedMonthIndex
    );
    
    // 예산 변동 데이터 필터링 (분기별 데이터)
    const allVariance = await db.select().from(budgetVariance).where(eq(budgetVariance.year, year));
    const quarterMap: Record<string, number> = {
      'Q1': 2, // 3월까지
      'Q2': 5, // 6월까지
      'Q3': 8, // 9월까지
      'Q4': 11 // 12월까지
    };
    
    const variance = allVariance.filter(v => {
      const quarterEndMonthIndex = quarterMap[v.month];
      return quarterEndMonthIndex !== undefined && selectedMonthIndex >= quarterEndMonthIndex - 2;
    });
    
    // 공급업체 지불 오류율 데이터 필터링
    const allPayments = await db.select().from(vendorPayments).where(eq(vendorPayments.year, year));
    const payments = allPayments.filter(p => 
      monthOrder.indexOf(p.month) <= selectedMonthIndex
    );

    // 선택한 월의 데이터 가져오기
    const selectedMetric = allMetrics.find(m => m.month === month) || allMetrics[allMetrics.length - 1];
    
    if (!selectedMetric) {
      return NextResponse.json({ error: "해당 월의 데이터를 찾을 수 없습니다" }, { status: 404 });
    }
    
    // 유동성 비율 분석 데이터 구성
    const liquidityRatios = allMetrics.map(m => ({
      month: m.month,
      currentRatio: m.currentRatio,
      quickRatio: m.quickRatio,
      cashFlowRatio: m.cashFlowRatio,
    }));

    // 수익률 분석 데이터 구성
    const profitMargin = {
      currentAssets: selectedMetric.cash + selectedMetric.accountsReceivable + 
                    selectedMetric.inventory + selectedMetric.prepaidExpenses,
      currentLiabilities: selectedMetric.accountsPayable + selectedMetric.creditCardDebit + 
                         selectedMetric.bankOperatingCredit + selectedMetric.accruedExpenses + 
                         selectedMetric.taxesPayable,
      workingCapital: selectedMetric.workingCapital,
      ratios: {
        current: selectedMetric.currentRatio,
        quick: selectedMetric.quickRatio,
        cashFlow: selectedMetric.cashFlowRatio,
      },
      details: {
        cash: selectedMetric.cash,
        accountsReceivable: selectedMetric.accountsReceivable,
        inventory: selectedMetric.inventory,
        prepaidExpenses: selectedMetric.prepaidExpenses,
        accountsPayable: selectedMetric.accountsPayable,
        creditCardDebit: selectedMetric.creditCardDebit,
        bankOperatingCredit: selectedMetric.bankOperatingCredit,
        accruedExpenses: selectedMetric.accruedExpenses,
        taxesPayable: selectedMetric.taxesPayable,
      }
    };

    // 사용 가능한 년도와 월 목록 가져오기
    const availableYears = [2024, 2025];
    const availableMonths = year === 2025 ? ['Jan', 'Feb', 'Mar'] : 
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return NextResponse.json({
      financialMetrics: profitMargin,
      liquidityRatios,
      budgetVariance: variance,
      vendorPayments: payments,
      selectedYear: year,
      selectedMonth: month,
      availableYears,
      availableMonths,
    });
  } catch (error) {
    console.error('재무 지표 데이터 가져오기 오류:', error);
    return NextResponse.json({ error: "데이터 가져오기 실패" }, { status: 500 });
  }
} 