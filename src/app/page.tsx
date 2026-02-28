'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import TrendingCard from '@/components/TrendingCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { CategoryData, CategoryType } from '@/types';

const CATEGORIES = [
  { name: '全部' as CategoryType, emoji: '📚' },
  { name: '热搜' as CategoryType, emoji: '🔥' },
  { name: '社区' as CategoryType, emoji: '💬' },
  { name: '娱乐' as CategoryType, emoji: '🎬' },
  { name: '资讯' as CategoryType, emoji: '📰' },
  { name: '科技' as CategoryType, emoji: '💡' },
  { name: '微信' as CategoryType, emoji: '💚' },
];

// 卡片旋转样式数组
const CARD_ROTATIONS = [
  'paper-card-rotate-1',
  'paper-card-rotate-2',
  'paper-card-rotate-3',
  '',
  'paper-card-rotate-1',
  'paper-card-rotate-2',
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('全部');
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
    <div className="min-h-screen paper-texture">
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
                <span className="text-8xl block mb-4">📔</span>
                <div className="w-32 h-1 bg-gray-400 dark:bg-gray-600 mx-auto" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-xl font-medium mb-2 handwriting-zh">
                暂无数据
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                请稍后再试或点击刷新按钮
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCategoryData?.sources.map((source, idx) => (
                <div
                  key={source.name}
                  className={`paper-card rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-300 dark:border-gray-600 sketch-draw card-hover ${CARD_ROTATIONS[idx % CARD_ROTATIONS.length]}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* 源标题 - 笔记本页眉风格 */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-dashed border-gray-300 dark:border-gray-600 relative">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-700 dark:bg-gray-300 rounded-full flex items-center justify-center text-white dark:text-gray-900 font-bold text-sm shadow-sm sketch-circle">
                        {source.name[0]}
                      </div>
                      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 handwriting-zh">
                        {source.name}
                      </h2>
                    </div>
                    {/* 装饰性铅笔 */}
                    <span className="text-gray-400 dark:text-gray-500">✏️</span>
                  </div>

                  {/* 热榜列表 - 横线纸效果 */}
                  <div className="space-y-2 lined-paper py-2">
                    {source.items.slice(0, 15).map((item, index) => (
                      <TrendingCard key={index} item={item} index={index} />
                    ))}
                  </div>

                  {/* 页脚装饰 */}
                  <div className="mt-4 pt-3 border-t border-dashed border-gray-300 dark:border-gray-600 text-right">
                    <span className="text-xs text-gray-400 dark:text-gray-500 handwriting">
                      {source.items.length} items
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Footer - 笔记本底页风格 */}
      <footer className="mt-20 py-10 glass border-t-2 border-gray-300 dark:border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <div className="w-16 h-0.5 bg-gray-400 dark:bg-gray-600" />
            <span className="text-3xl">📔</span>
            <div className="w-16 h-0.5 bg-gray-400 dark:bg-gray-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            数据来源于互联网公开信息 · 仅供参考
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs handwriting">
            Made with ✏️ by 趣闻花园
          </p>
        </div>
      </footer>
    </div>
  );
}
