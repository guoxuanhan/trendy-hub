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
    <div className="sticky top-[112px] z-40 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide space-x-3 py-5">
          {categories.map(({ name, emoji }) => (
            <button
              key={name}
              onClick={() => onCategoryChange(name)}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-full whitespace-nowrap
                transition-all duration-300 font-medium text-base
                transform hover:scale-105
                ${
                  activeCategory === name
                    ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white shadow-lg shadow-pink-300/50 dark:shadow-pink-900/50 scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm'
                }
              `}
            >
              <span className="text-xl">{emoji}</span>
              <span className="font-semibold">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
