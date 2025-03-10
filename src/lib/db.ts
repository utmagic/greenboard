import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('users.db');

// 사용자 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface User {
  id: number;
  email: string;
  name: string;
  password?: string;
  created_at?: string;
}

export class UserDB {
  // 사용자 생성
  static async createUser(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const stmt = db.prepare(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)'
      );
      const result = stmt.run(email, hashedPassword, name);
      
      return {
        id: result.lastInsertRowid as number,
        email,
        name,
      };
    } catch (error) {
      if ((error as any).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('이미 등록된 이메일입니다.');
      }
      throw error;
    }
  }

  // 사용자 검증
  static async validateUser(email: string, password: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as User | undefined;

    if (!user || !user.password) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 모든 사용자 조회 (개발용)
  static getAllUsers(): User[] {
    const stmt = db.prepare('SELECT id, email, name, created_at FROM users');
    return stmt.all() as User[];
  }
} 