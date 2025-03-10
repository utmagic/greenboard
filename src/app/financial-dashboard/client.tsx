'use client';

import FinancialMetrics from '@/components/FinancialMetrics';

export default function FinancialDashboardClient({ initialData }: { initialData: any }) {
  return (
    <div className="p-4">
      <FinancialMetrics initialData={initialData} />
    </div>
  );
} 