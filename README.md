# 경영 대시보드 애플리케이션

회사의 경영 현황을 한눈에 볼 수 있는 대시보드 애플리케이션입니다. 이 애플리케이션은 Next.js, React, Tailwind CSS, Tremor를 사용하여 구현되었습니다.

## 주요 기능

- **메트릭 카드**: 순 수익, 매출, 미수금, 재고 등 주요 지표를 시각적으로 표시
- **부서별 수익 테이블**: 각 부서의 총 수익과 순 수익, 목표 대비 달성률을 표시
- **부서별 연간 수익 비교 차트**: 부서별 올해, 목표, 작년 수익을 비교하는 차트

## 기술 스택

- **프레임워크**: Next.js
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **데이터 시각화**: Tremor, Recharts

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 빌드

```bash
npm run build
# 또는
yarn build
```

## 프로젝트 구조

```
src/
├── app/                # Next.js 앱 디렉토리
│   ├── page.tsx        # 메인 페이지
│   └── layout.tsx      # 레이아웃
├── components/         # 컴포넌트
│   ├── Dashboard.tsx   # 대시보드 레이아웃
│   ├── MetricCard.tsx  # 메트릭 카드 컴포넌트
│   ├── ProfitTable.tsx # 수익 테이블 컴포넌트
│   └── DepartmentProfitChart.tsx # 부서별 수익 차트
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
