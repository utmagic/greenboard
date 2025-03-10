# Greenboard

Greenboard는 회사의 재무 상태와 수익 센터 성과를 분석하고 모니터링하는 통합 대시보드 시스템입니다.

## 주요 기능
- **로그인 및 회원가입**: 이메일/비밀번호 및 소셜 로그인(Google, GitHub) 지원
- **재무 대시보드**: 주요 재무 지표 시각화
- **Profit Center**: 부서별 수익성 분석
- **사용자 관리**: SQLite 데이터베이스를 통한 사용자 정보 저장

## 프로젝트 구조

- **src/app**: 페이지 및 API 라우트
  - **api**: API 엔드포인트
    - **auth**: 인증 관련 API
    - **debug**: 디버그용 API
    - **departments**: 부서 관련 API
    - **financial-metrics**: 재무 지표 API
    - **metrics**: 일반 지표 API
  - **auth**: 로그인 및 회원가입 페이지
  - **details**: 세부 정보 페이지
  - **financial-dashboard**: 재무 대시보드 페이지
  - **profit-center**: Profit Center 페이지
  - **layout.tsx**: 공통 레이아웃
  - **page.tsx**: 메인 페이지

- **src/components**: UI 컴포넌트
  - **auth**: 인증 관련 컴포넌트
  - **ui**: 공통 UI 컴포넌트
  - **Dashboard.tsx**: 대시보드 컴포넌트
  - **Header.tsx**: 헤더 컴포넌트

- **src/db**: 데이터베이스 설정 및 스키마
- **src/lib**: 라이브러리 및 유틸리티
- **src/middleware.ts**: 미들웨어 설정

## 설치 및 실행

1. 저장소 클론:
   ```bash
   git clone https://github.com/utmagic/greenboard.git
   cd greenboard
   ```

2. 패키지 설치:
   ```bash
   npm install
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

4. 브라우저에서 `http://localhost:3000` 접속

## 환경 변수 설정
`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 기여
기여를 환영합니다! 버그 제보, 기능 요청 및 풀 리퀘스트를 통해 기여할 수 있습니다.
