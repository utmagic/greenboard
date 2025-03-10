import { NextResponse } from 'next/server';
import { UserDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // 필수 필드 검증
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 생성
    const user = await UserDB.createUser(email, password, name);
    
    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.', user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 