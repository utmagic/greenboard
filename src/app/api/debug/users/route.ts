import { NextResponse } from 'next/server';
import { UserDB } from '@/lib/db';

export async function GET() {
  // 개발 환경에서만 접근 가능
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { message: '개발 환경에서만 접근 가능합니다.' },
      { status: 403 }
    );
  }

  try {
    const users = UserDB.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: '사용자 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 