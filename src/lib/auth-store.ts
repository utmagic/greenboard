interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

// 임시 메모리 저장소
class AuthStore {
  private users: User[] = [
    {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      password: "password"
    }
  ];

  async createUser(email: string, password: string, name: string): Promise<User> {
    // 이메일 중복 체크
    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('이미 등록된 이메일입니다.');
    }

    const newUser = {
      id: (this.users.length + 1).toString(),
      email,
      password,
      name
    };

    this.users.push(newUser);
    return newUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = this.users.find(
      user => user.email === email && user.password === password
    );
    
    if (!user) return null;

    // 비밀번호는 제외하고 반환
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}

export const authStore = new AuthStore(); 