'use client';

import { CategoryType } from '@/types';

interface CategoryTabsProps {
  categories: Array<{ name: CategoryType; emoji: string }>;
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-[140px] z-40 glass border-b-2 border-gray-300 dark:border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 笔记本书签标签风格 */}
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 py-4">
          {categories.map(({ name, emoji }) => (
            <button
              key={name}
              onClick={() => onCategoryChange(name)}
              className={`
                relative flex items-center space-x-2 px-5 py-2.5 whitespace-nowrap
                transition-all duration-300 font-medium text-base
                border-2 border-gray-400 dark:border-gray-500
                ${
                  activeCategory === name
                    ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-lg transform -translate-y-1'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm'
                }
              `}
              style={{
                borderRadius: '8px 8px 0 0',
                clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
              }}
            >
              <span className="text-lg">{emoji}</span>
              <span className="font-semibold">{name}</span>

              {/* 书签折角效果 */}
              {activeCategory === name && (
                <div className="absolute -bottom-0.5 left-0 right-0 h-1 bg-gray-800 dark:bg-gray-200" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
