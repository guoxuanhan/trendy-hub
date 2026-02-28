'use client';

import { TrendingItem } from '@/types';

interface TrendingCardProps {
  item: TrendingItem;
  index?: number;
}

export default function TrendingCard({ item, index }: TrendingCardProps) {
  // 获取排名样式
  const getRankStyle = (rank: number) => {
    if (rank === 1) {
      return 'rank-badge-gold text-white font-bold';
    }
    if (rank === 2) {
      return 'rank-badge-silver text-white font-bold';
    }
    if (rank === 3) {
      return 'rank-badge-bronze text-white font-bold';
    }
    if (rank <= 10) {
      return 'bg-gradient-to-br from-pink-400 to-purple-400 text-white font-semibold';
    }
    return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium';
  };

  // 热度值颜色
  const getHeatColor = (heat?: string) => {
    if (!heat) return 'text-gray-500';
    const numericHeat = parseFloat(heat.replace(/[^0-9.]/g, ''));
    if (numericHeat > 100000) return 'text-red-500 dark:text-red-400 pulse-glow';
    if (numericHeat > 50000) return 'text-orange-500 dark:text-orange-400';
    return 'text-yellow-600 dark:text-yellow-500';
  };

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block card-lift bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700 transition-all duration-300"
    >
      <div className="flex items-start space-x-3">
        {/* 排名徽章 */}
        <div
          className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
            text-lg shadow-md transition-transform duration-300 group-hover:scale-110
            ${getRankStyle(item.rank)}
          `}
        >
          {item.rank}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 dark:text-gray-100 font-medium leading-snug group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2 mb-2">
            {item.title}
          </h3>

          {/* 热度和外链图标 */}
          <div className="flex items-center justify-between">
            {item.heat && (
              <span className={`flex items-center space-x-1 text-sm font-semibold ${getHeatColor(item.heat)}`}>
                <span>🔥</span>
                <span>{item.heat}</span>
              </span>
            )}

            <span className="text-gray-400 group-hover:text-pink-500 transition-colors text-sm">
              ↗
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
