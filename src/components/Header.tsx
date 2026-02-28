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
    // 使用 requestAnimationFrame 避免同步 setState
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
    <header className="sticky top-0 z-50 glass border-b border-white/20 dark:border-gray-700/50">
      {/* 渐变背景层 */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900 opacity-90" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo 和标题 */}
          <div className="flex items-center space-x-4">
            <span className="text-5xl drop-shadow-lg">🌸</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg tracking-wide">
                趣闻花园
              </h1>
              <p className="text-sm sm:text-base text-white/95 mt-1 font-medium">
                发现你的精彩世界
              </p>
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-3">
            {lastUpdated && (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-white/70">最后更新</span>
                <span className="text-sm text-white font-medium">
                  {formatTime(lastUpdated)}
                </span>
              </div>
            )}

            {/* 深色模式切换 */}
            <button
              onClick={toggleDarkMode}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
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
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              <span className={`text-xl transition-transform duration-700 ${isRefreshing ? 'animate-spin' : ''}`}>
                🔄
              </span>
              <span className="hidden sm:inline font-medium">刷新</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
