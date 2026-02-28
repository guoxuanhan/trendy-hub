'use client';

import { TrendingItem } from '@/types';

interface TrendingCardProps {
  item: TrendingItem;
  index?: number;
}

export default function TrendingCard({ item, index }: TrendingCardProps) {
  // 获取排名样式 - 手绘圆圈风格
  const getRankStyle = (rank: number) => {
    if (rank === 1) {
      return 'rank-badge-gold sketch-circle';
    }
    if (rank === 2) {
      return 'rank-badge-silver sketch-circle';
    }
    if (rank === 3) {
      return 'rank-badge-bronze sketch-circle';
    }
    return 'text-gray-600 dark:text-gray-400 sketch-circle';
  };

  // 热度值颜色
  const getHeatColor = (heat?: string) => {
    if (!heat) return 'text-gray-500';
    const numericHeat = parseFloat(heat.replace(/[^0-9.]/g, ''));
    if (numericHeat > 100000) return 'text-red-600 dark:text-red-400';
    if (numericHeat > 50000) return 'text-orange-600 dark:text-orange-400';
    return 'text-yellow-700 dark:text-yellow-500';
  };

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block card-hover paper-card rounded-lg p-3 border border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-300 pencil-write"
      style={{ animationDelay: `${(index || 0) * 0.05}s` }}
    >
      <div className="flex items-start space-x-3">
        {/* 排名徽章 - 手绘圆圈 */}
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            text-base font-bold transition-transform duration-300 group-hover:scale-110
            ${getRankStyle(item.rank)}
          `}
        >
          {item.rank}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-800 dark:text-gray-100 font-medium leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2 text-sm mb-1">
            {item.title}
          </h3>

          {/* 热度 */}
          {item.heat && (
            <div className="flex items-center space-x-1">
              <span className={`text-xs font-semibold ${getHeatColor(item.heat)}`}>
                🔥 {item.heat}
              </span>
            </div>
          )}
        </div>

        {/* 外链箭头 */}
        <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors text-sm flex-shrink-0">
          ↗
        </span>
      </div>
    </a>
  );
}
