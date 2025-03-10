import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { annualProfitData, departments, metrics, monthlyMetrics, monthlyProfitData, monthlyChartData, profitData, budgetVariance, financialMetrics, vendorPayments } from "./schema";

// 서버 컴포넌트에서만 실행되는 코드
let db: ReturnType<typeof drizzle> | null = null;

// 시드 기반의 의사 난수 생성기
function pseudoRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x);
}

// 데이터베이스 연결 함수
export function getDb() {
  if (typeof window === 'undefined' && !db) {
    // 서버 사이드에서만 실행
    const sqlite = new Database("profit_center.db");
    db = drizzle(sqlite);
  }
  return db;
}

// 테이블이 존재하는지 확인하는 함수
function tableExists(sqlite: any, tableName: string): boolean {
  try {
    const result = sqlite.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(tableName);
    return !!result;
  } catch (error) {
    console.error(`테이블 확인 오류 (${tableName}):`, error);
    return false;
  }
}

// 테이블에 데이터가 있는지 확인하는 함수
function hasData(sqlite: any, tableName: string): boolean {
  try {
    const result = sqlite.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get();
    return result.count > 0;
  } catch (error) {
    console.error(`데이터 확인 오류 (${tableName}):`, error);
    return false;
  }
}

// 월별 데이터 생성 함수 (시드 값 추가)
function generateMonthlyValues(value: number, year: number, seed: number, variance: number = 0.2) {
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월", 
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];
  
  // 2025년은 1월~3월까지만 데이터 생성
  const monthsToGenerate = year === 2025 ? months.slice(0, 3) : months;
  
  // 계절성 패턴
  const quarterFactor = [
    [0.8, 0.9, 1.1],  // 1분기 (1-3월)
    [1.0, 1.1, 1.2],  // 2분기 (4-6월)
    [1.2, 1.1, 1.0],  // 3분기 (7-9월)
    [1.1, 1.0, 0.9],  // 4분기 (10-12월)
  ];
  
  return monthsToGenerate.map((month, index) => {
    const quarter = Math.floor(index / 3);
    const monthInQuarter = index % 3;
    const seasonalFactor = quarterFactor[quarter][monthInQuarter];
    
    // 시드 기반 변동성 추가
    const randomFactor = 1 + (pseudoRandom(seed, index) * 2 - 1) * variance;
    
    // 월별 값 계산
    const divisor = year === 2025 ? 3 : 12;
    const monthlyValue = (value / divisor) * seasonalFactor * randomFactor;
    
    return {
      month,
      value: parseFloat(monthlyValue.toFixed(2))
    };
  });
}

// 초기 데이터 삽입 함수
export async function seedDatabase() {
  if (typeof window !== 'undefined') {
    console.error('seedDatabase는 서버에서만 실행할 수 있습니다.');
    return;
  }

  const db = getDb();
  if (!db) {
    console.error('데이터베이스 연결 실패');
    return;
  }

  try {
    const sqlite = new Database("profit_center.db");
    
    // 테이블 생성 (없는 경우)
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        value REAL NOT NULL,
        percentage REAL NOT NULL,
        color TEXT NOT NULL,
        year INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS monthly_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        metric_id INTEGER NOT NULL,
        month TEXT NOT NULL,
        value REAL NOT NULL,
        percentage REAL NOT NULL,
        year INTEGER NOT NULL,
        FOREIGN KEY (metric_id) REFERENCES metrics(id)
      );
      
      CREATE TABLE IF NOT EXISTS profit_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id INTEGER NOT NULL,
        gross_profit_actual REAL NOT NULL,
        gross_profit_index REAL NOT NULL,
        gross_profit_completion_rate REAL NOT NULL,
        net_profit_actual REAL NOT NULL,
        net_profit_index REAL NOT NULL,
        net_profit_completion_rate REAL NOT NULL,
        year INTEGER NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      );
      
      CREATE TABLE IF NOT EXISTS monthly_profit_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id INTEGER NOT NULL,
        month TEXT NOT NULL,
        gross_profit_actual REAL NOT NULL,
        gross_profit_index REAL NOT NULL,
        gross_profit_completion_rate REAL NOT NULL,
        net_profit_actual REAL NOT NULL,
        net_profit_index REAL NOT NULL,
        net_profit_completion_rate REAL NOT NULL,
        year INTEGER NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      );
      
      CREATE TABLE IF NOT EXISTS annual_profit_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id INTEGER NOT NULL,
        this_year REAL NOT NULL,
        target REAL NOT NULL,
        last_year REAL NOT NULL,
        year INTEGER NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      );
      
      CREATE TABLE IF NOT EXISTS monthly_chart_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_id INTEGER NOT NULL,
        month TEXT NOT NULL,
        this_year REAL NOT NULL,
        target REAL NOT NULL,
        last_year REAL NOT NULL,
        year INTEGER NOT NULL,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      );

      CREATE TABLE IF NOT EXISTS financial_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT NOT NULL,
        year INTEGER NOT NULL,
        working_capital INTEGER NOT NULL,
        current_ratio REAL NOT NULL,
        quick_ratio REAL NOT NULL,
        cash_flow_ratio REAL NOT NULL,
        cash INTEGER NOT NULL,
        accounts_receivable INTEGER NOT NULL,
        inventory INTEGER NOT NULL,
        prepaid_expenses INTEGER NOT NULL,
        accounts_payable INTEGER NOT NULL,
        credit_card_debit INTEGER NOT NULL,
        bank_operating_credit INTEGER NOT NULL,
        accrued_expenses INTEGER NOT NULL,
        taxes_payable INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS budget_variance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT NOT NULL,
        year INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vendor_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT NOT NULL,
        year INTEGER NOT NULL,
        error_rate REAL NOT NULL
      );
    `);
    
    // 데이터가 이미 존재하는지 확인
    if (hasData(sqlite, 'departments')) {
      console.log('데이터가 이미 존재합니다. 초기화를 건너뜁니다.');
      return;
    }
    
    // 기존 데이터 삭제
    const tables = [
      'monthly_chart_data',
      'monthly_profit_data',
      'monthly_metrics',
      'annual_profit_data',
      'profit_data',
      'metrics',
      'departments'
    ];
    
    for (const table of tables) {
      if (tableExists(sqlite, table)) {
        sqlite.exec(`DELETE FROM ${table}`);
      }
    }

    // 부서 데이터 삽입
    const departmentIds = await db.insert(departments).values([
      { name: "M사업부" },
      { name: "BS사업부" },
      { name: "IS사업부" },
      { name: "Total" },
    ]).returning({ id: departments.id, name: departments.name });

    // 부서 ID 매핑
    const departmentMap = departmentIds.reduce((acc, dept) => {
      acc[dept.name] = dept.id;
      return acc;
    }, {} as Record<string, number>);

    // 2024년 메트릭 데이터
    const metrics2024 = [
      { title: "순이익", value: 1468.48, percentage: 101.68, color: "tableau-blue", year: 2024 },
      { title: "매출", value: 2288.17, percentage: 94.10, color: "tableau-orange", year: 2024 },
      { title: "미수금", value: 23.77, percentage: 95.08, color: "tableau-green", year: 2024 },
      { title: "재고", value: 1.08, percentage: 90.00, color: "tableau-red", year: 2024 },
    ];

    // 2025년 메트릭 데이터
    const metrics2025 = [
      { title: "순이익", value: 440.54, percentage: 122.02, color: "tableau-blue", year: 2025 },
      { title: "매출", value: 686.45, percentage: 112.91, color: "tableau-orange", year: 2025 },
      { title: "미수금", value: 7.50, percentage: 88.20, color: "tableau-green", year: 2025 },
      { title: "재고", value: 0.35, percentage: 85.40, color: "tableau-red", year: 2025 },
    ];

    // 메트릭 데이터 삽입 및 월별 데이터 생성
    for (const year of [2024, 2025]) {
      const metricsData = year === 2024 ? metrics2024 : metrics2025;
      const seed = year; // 연도를 시드로 사용
      
      // 메트릭 데이터 삽입
      const insertedMetrics = await db.insert(metrics).values(metricsData)
        .returning({ id: metrics.id, title: metrics.title, value: metrics.value, percentage: metrics.percentage });
      
      // 각 메트릭에 대한 월별 데이터 생성 및 삽입
      for (const metric of insertedMetrics) {
        const monthlyValues = generateMonthlyValues(metric.value, year, seed + metric.id);
        
        // 2025년은 1분기 데이터만 있음 (1월~3월)
        const months = year === 2025 ? ["1월", "2월", "3월"] : 
          ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
        
        // 월별 메트릭 데이터 삽입
        await db.insert(monthlyMetrics).values(
          months.map((month, index) => ({
            metricId: metric.id,
            month: month,
            value: monthlyValues[index].value,
            percentage: metric.percentage * (0.9 + pseudoRandom(seed, month.charCodeAt(0)) * 0.2),
            year
          }))
        );
      }
    }

    // 2024년 수익 데이터
    const profitData2024 = [
      {
        departmentId: departmentMap["M사업부"],
        grossProfitActual: 435.88,
        grossProfitIndex: 674.11,
        grossProfitCompletionRate: 64.66,
        netProfitActual: 265.88,
        netProfitIndex: 374.11,
        netProfitCompletionRate: 71.07,
        year: 2024
      },
      {
        departmentId: departmentMap["BS사업부"],
        grossProfitActual: 996.30,
        grossProfitIndex: 811.76,
        grossProfitCompletionRate: 122.73,
        netProfitActual: 546.30,
        netProfitIndex: 611.76,
        netProfitCompletionRate: 89.30,
        year: 2024
      },
      {
        departmentId: departmentMap["IS사업부"],
        grossProfitActual: 855.99,
        grossProfitIndex: 945.88,
        grossProfitCompletionRate: 90.50,
        netProfitActual: 656.30,
        netProfitIndex: 458.33,
        netProfitCompletionRate: 143.19,
        year: 2024
      },
      {
        departmentId: departmentMap["Total"],
        grossProfitActual: 2288.17,
        grossProfitIndex: 2431.75,
        grossProfitCompletionRate: 94.10,
        netProfitActual: 1468.48,
        netProfitIndex: 1444.20,
        netProfitCompletionRate: 101.68,
        year: 2024
      },
    ];

    // 2025년 수익 데이터
    const profitData2025 = [
      {
        departmentId: departmentMap["M사업부"],
        grossProfitActual: 130.76,
        grossProfitIndex: 168.53,
        grossProfitCompletionRate: 77.59,
        netProfitActual: 79.76,
        netProfitIndex: 93.53,
        netProfitCompletionRate: 85.28,
        year: 2025
      },
      {
        departmentId: departmentMap["BS사업부"],
        grossProfitActual: 298.89,
        grossProfitIndex: 202.94,
        grossProfitCompletionRate: 147.28,
        netProfitActual: 163.89,
        netProfitIndex: 152.94,
        netProfitCompletionRate: 107.16,
        year: 2025
      },
      {
        departmentId: departmentMap["IS사업부"],
        grossProfitActual: 256.80,
        grossProfitIndex: 236.47,
        grossProfitCompletionRate: 108.60,
        netProfitActual: 196.89,
        netProfitIndex: 114.58,
        netProfitCompletionRate: 171.83,
        year: 2025
      },
      {
        departmentId: departmentMap["Total"],
        grossProfitActual: 686.45,
        grossProfitIndex: 607.94,
        grossProfitCompletionRate: 112.91,
        netProfitActual: 440.54,
        netProfitIndex: 361.05,
        netProfitCompletionRate: 122.02,
        year: 2025
      },
    ];

    // 수익 데이터 삽입 및 월별 데이터 생성
    for (const year of [2024, 2025]) {
      const profitDataArray = year === 2024 ? profitData2024 : profitData2025;
      const seed = year * 1000; // 연도를 시드로 사용
      
      // 수익 데이터 삽입
      await db.insert(profitData).values(profitDataArray);
      
      // 각 부서에 대한 월별 데이터 생성 및 삽입
      for (const pd of profitDataArray) {
        const monthlyGrossActual = generateMonthlyValues(pd.grossProfitActual, year, seed + pd.departmentId * 1);
        const monthlyGrossIndex = generateMonthlyValues(pd.grossProfitIndex, year, seed + pd.departmentId * 2);
        const monthlyNetActual = generateMonthlyValues(pd.netProfitActual, year, seed + pd.departmentId * 3);
        const monthlyNetIndex = generateMonthlyValues(pd.netProfitIndex, year, seed + pd.departmentId * 4);
        
        // 2025년은 1분기 데이터만 있음 (1월~3월)
        const months = year === 2025 ? ["1월", "2월", "3월"] : 
          ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
        
        // 월별 수익 데이터 삽입
        await db.insert(monthlyProfitData).values(
          months.map((month, index) => ({
            departmentId: pd.departmentId,
            month,
            grossProfitActual: monthlyGrossActual[index].value,
            grossProfitIndex: monthlyGrossIndex[index].value,
            grossProfitCompletionRate: (monthlyGrossActual[index].value / monthlyGrossIndex[index].value) * 100,
            netProfitActual: monthlyNetActual[index].value,
            netProfitIndex: monthlyNetIndex[index].value,
            netProfitCompletionRate: (monthlyNetActual[index].value / monthlyNetIndex[index].value) * 100,
            year
          }))
        );
      }
    }

    // 2024년 연간 차트 데이터
    const chartData2024 = [
      {
        departmentId: departmentMap["M사업부"],
        thisYear: 300,
        target: 250,
        lastYear: 200,
        year: 2024
      },
      {
        departmentId: departmentMap["BS사업부"],
        thisYear: 200,
        target: 175,
        lastYear: 150,
        year: 2024
      },
      {
        departmentId: departmentMap["IS사업부"],
        thisYear: 180,
        target: 150,
        lastYear: 120,
        year: 2024
      },
    ];

    // 2025년 연간 차트 데이터
    const chartData2025 = [
      {
        departmentId: departmentMap["M사업부"],
        thisYear: 90,
        target: 75,
        lastYear: 60,
        year: 2025
      },
      {
        departmentId: departmentMap["BS사업부"],
        thisYear: 60,
        target: 52.5,
        lastYear: 45,
        year: 2025
      },
      {
        departmentId: departmentMap["IS사업부"],
        thisYear: 54,
        target: 45,
        lastYear: 36,
        year: 2025
      },
    ];

    // 차트 데이터 삽입 및 월별 데이터 생성
    for (const year of [2024, 2025]) {
      const chartDataArray = year === 2024 ? chartData2024 : chartData2025;
      const seed = year * 2000; // 연도를 시드로 사용
      
      // 연간 차트 데이터 삽입
      await db.insert(annualProfitData).values(chartDataArray);
      
      // 각 부서에 대한 월별 차트 데이터 생성 및 삽입
      for (const cd of chartDataArray) {
        const monthlyThisYear = generateMonthlyValues(cd.thisYear, year, seed + cd.departmentId * 1);
        const monthlyTarget = generateMonthlyValues(cd.target, year, seed + cd.departmentId * 2);
        const monthlyLastYear = generateMonthlyValues(cd.lastYear, year, seed + cd.departmentId * 3);
        
        // 2025년은 1분기 데이터만 있음 (1월~3월)
        const months = year === 2025 ? ["1월", "2월", "3월"] : 
          ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
        
        // 월별 차트 데이터 삽입
        await db.insert(monthlyChartData).values(
          months.map((month, index) => ({
            departmentId: cd.departmentId,
            month,
            thisYear: monthlyThisYear[index].value,
            target: monthlyTarget[index].value,
            lastYear: monthlyLastYear[index].value,
            year
          }))
        );
      }
    }
    
    // 재무 지표 데이터 생성
    await db.delete(financialMetrics);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months2025 = ['Jan', 'Feb', 'Mar']; // 2025년 1월~3월
    
    // 2024년 데이터
    for (const month of months) {
      await db.insert(financialMetrics).values({
        month,
        year: 2024,
        workingCapital: 78000 + Math.floor(Math.random() * 5000),
        currentRatio: 1.8 + (Math.random() * 0.2 - 0.1),
        quickRatio: 1.7 + (Math.random() * 0.2 - 0.1),
        cashFlowRatio: 1.6 + (Math.random() * 0.2 - 0.1),
        cash: 102000 + Math.floor(Math.random() * 5000),
        accountsReceivable: 74000 + Math.floor(Math.random() * 3000),
        inventory: 21000 + Math.floor(Math.random() * 2000),
        prepaidExpenses: 19000 + Math.floor(Math.random() * 1000),
        accountsPayable: 82000 + Math.floor(Math.random() * 4000),
        creditCardDebit: 11000 + Math.floor(Math.random() * 1000),
        bankOperatingCredit: 37000 + Math.floor(Math.random() * 2000),
        accruedExpenses: 6000 + Math.floor(Math.random() * 500),
        taxesPayable: 2000 + Math.floor(Math.random() * 200),
      });
    }
    
    // 2025년 데이터 (1월~3월)
    for (const month of months2025) {
      await db.insert(financialMetrics).values({
        month,
        year: 2025,
        workingCapital: 80000 + Math.floor(Math.random() * 5000),
        currentRatio: 1.9 + (Math.random() * 0.2 - 0.1),
        quickRatio: 1.8 + (Math.random() * 0.2 - 0.1),
        cashFlowRatio: 1.7 + (Math.random() * 0.2 - 0.1),
        cash: 106000 + Math.floor(Math.random() * 5000),
        accountsReceivable: 76000 + Math.floor(Math.random() * 3000),
        inventory: 22000 + Math.floor(Math.random() * 2000),
        prepaidExpenses: 20000 + Math.floor(Math.random() * 1000),
        accountsPayable: 84000 + Math.floor(Math.random() * 4000),
        creditCardDebit: 12000 + Math.floor(Math.random() * 1000),
        bankOperatingCredit: 38000 + Math.floor(Math.random() * 2000),
        accruedExpenses: 6500 + Math.floor(Math.random() * 500),
        taxesPayable: 2200 + Math.floor(Math.random() * 200),
      });
    }

    // 예산 변동 데이터 생성
    await db.delete(budgetVariance);
    
    // 2024년 예산 변동 데이터
    const varianceData2024 = [
      { month: 'Q1', amount: 2000, type: 'positive' },
      { month: 'Q2', amount: -1000, type: 'negative' },
      { month: 'Q3', amount: 1800, type: 'positive' },
      { month: 'Q4', amount: -1900, type: 'negative' },
    ];

    for (const data of varianceData2024) {
      await db.insert(budgetVariance).values({
        month: data.month,
        year: 2024,
        amount: data.amount,
        type: data.type,
      });
    }
    
    // 2025년 예산 변동 데이터 (1분기만)
    const varianceData2025 = [
      { month: 'Q1', amount: 2200, type: 'positive' },
    ];

    for (const data of varianceData2025) {
      await db.insert(budgetVariance).values({
        month: data.month,
        year: 2025,
        amount: data.amount,
        type: data.type,
      });
    }

    // 공급업체 지불 오류율 데이터 생성
    await db.delete(vendorPayments);
    
    // 2024년 오류율 데이터
    const errorRates2024 = [
      { month: 'Jan', errorRate: 0.01 },
      { month: 'Mar', errorRate: 0.02 },
      { month: 'May', errorRate: 0.015 },
      { month: 'Jul', errorRate: 0.018 },
      { month: 'Sep', errorRate: 0.014 },
      { month: 'Nov', errorRate: 0.019 },
    ];

    for (const data of errorRates2024) {
      await db.insert(vendorPayments).values({
        month: data.month,
        year: 2024,
        errorRate: data.errorRate,
      });
    }
    
    // 2025년 오류율 데이터 (1월~3월)
    const errorRates2025 = [
      { month: 'Jan', errorRate: 0.009 },
      { month: 'Feb', errorRate: 0.012 },
      { month: 'Mar', errorRate: 0.015 },
    ];

    for (const data of errorRates2025) {
      await db.insert(vendorPayments).values({
        month: data.month,
        year: 2025,
        errorRate: data.errorRate,
      });
    }
    
    console.log('데이터베이스 초기화 완료');
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error);
  }
} 