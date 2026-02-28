'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  onRefresh: () => void;
  lastUpdated?: string;
}

export default function Header({ onRefresh, lastUpdated }: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 初始化深色模式
  useEffect(() => {
    requestAnimationFrame(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="sticky top-0 z-50 glass border-b-2 border-gray-300 dark:border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo 和标题 - 笔记本标题页风格 */}
          <div className="flex items-center space-x-4">
            <span className="text-5xl">📔</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 handwriting-zh tracking-wide">
                趣闻花园
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 handwriting">
                Discover Your World
              </p>
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-3">
            {lastUpdated && (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">最后更新</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {formatTime(lastUpdated)}
                </span>
              </div>
            )}

            {/* 深色模式切换 */}
            <button
              onClick={toggleDarkMode}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg sketch-border"
              title={isDark ? '切换到浅色模式' : '切换到深色模式'}
            >
              <span className="text-xl">
                {isDark ? '☀️' : '🌙'}
              </span>
            </button>

            {/* 刷新按钮 */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-5 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 shadow-md hover:shadow-lg sketch-border"
            >
              <span className={`text-xl transition-transform duration-700 ${isRefreshing ? 'animate-spin' : ''}`}>
                🔄
              </span>
              <span className="hidden sm:inline font-medium">刷新</span>
            </button>
          </div>
        </div>

        {/* 装饰性手绘线条 */}
        <div className="mt-4 flex items-center space-x-2">
          <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-50" />
          <span className="text-gray-400 dark:text-gray-500">✏️</span>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-50" />
        </div>
      </div>
    </header>
  );
}
