'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import TrendingCard from '@/components/TrendingCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { CategoryData, CategoryType } from '@/types';

const CATEGORIES = [
  { name: '热搜' as CategoryType, emoji: '🔥' },
  { name: '社区' as CategoryType, emoji: '💬' },
  { name: '娱乐' as CategoryType, emoji: '🎬' },
  { name: '购物' as CategoryType, emoji: '🛍️' },
  { name: '资讯' as CategoryType, emoji: '📰' },
  { name: '科技' as CategoryType, emoji: '💡' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('热搜');
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trending');
      const result = await response.json();
      setData(result.categories || []);
      setLastUpdated(result.lastUpdated);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentCategoryData = data.find(d => d.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950">
      <Header onRefresh={fetchData} lastUpdated={lastUpdated} />

      <CategoryTabs
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
          {currentCategoryData?.sources.length === 0 ? (
            <div className="text-center py-32">
              <div className="mb-6">
                <span className="text-8xl block mb-4">🌸</span>
                <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mx-auto rounded-full" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xl font-medium mb-2">
                暂无数据
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                请稍后再试或点击刷新按钮
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCategoryData?.sources.map((source, idx) => (
                <div
                  key={source.name}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* 源标题 */}
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="w-11 h-11 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {source.name[0]}
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {source.name}
                    </h2>
                  </div>

                  {/* 热榜列表 */}
                  <div className="space-y-3">
                    {source.items.slice(0, 10).map((item, index) => (
                      <TrendingCard key={index} item={item} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="mt-20 py-10 glass border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">
            <span className="text-3xl">🌸</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            数据来源于互联网公开信息 · 仅供参考
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs">
            Made with <span className="text-pink-500">💖</span> by 趣闻花园
          </p>
        </div>
      </footer>
    </div>
  );
}
