import Link from 'next/link';
import { FaChartLine, FaBuilding } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">경영 정보 시스템</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          회사의 재무 상태와 수익 센터 성과를 분석하고 모니터링하는 통합 대시보드 시스템입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/financial-dashboard" className="block">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <FaChartLine className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">재무 현황</h2>
              <p className="text-gray-600">
                회사의 재무 상태, 유동성 비율, 예산 변동 분석 등 주요 재무 지표를 시각화하여 제공합니다.
              </p>
            </div>
            <div className="px-6 py-3 bg-blue-50">
              <span className="text-sm text-blue-600 font-medium">대시보드 보기 →</span>
            </div>
          </div>
        </Link>

        <Link href="/profit-center" className="block">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <FaBuilding className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Profit Center</h2>
              <p className="text-gray-600">
                부서별 수익성 분석, 목표 달성률, 성과 지표 등을 통해 수익 센터의 성과를 모니터링합니다.
              </p>
            </div>
            <div className="px-6 py-3 bg-green-50">
              <span className="text-sm text-green-600 font-medium">대시보드 보기 →</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
