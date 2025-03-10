'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { FaCalendar, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-[#2e2a5a] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 왼쪽: 로고와 타이틀 */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <FaCalendar className="w-6 h-6" />
              <span className="font-semibold text-lg">Outlook Report</span>
            </Link>
          </div>

          {/* 중앙: 네비게이션 링크 */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/financial-dashboard"
              className={`hover:text-blue-200 ${
                isActive('/financial-dashboard') ? 'text-blue-300' : ''
              }`}
            >
              재무현황
            </Link>
            <Link
              href="/profit-center"
              className={`hover:text-blue-200 ${
                isActive('/profit-center') ? 'text-blue-300' : ''
              }`}
            >
              Profit Center
            </Link>
          </nav>

          {/* 오른쪽: 사용자 정보 */}
          {session?.user && (
            <div className="relative">
              <button
                className="flex items-center space-x-2 hover:text-blue-200"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                  <FaUser className="w-4 h-4" />
                </div>
                <span>{session.user.name || session.user.email}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    {session.user.email}
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 