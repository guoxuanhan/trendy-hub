export default function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="paper-card rounded-lg p-5 border-2 border-gray-300 dark:border-gray-600 sketch-draw"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* 源标题骨架 - 笔记本页眉风格 */}
            <div className="flex items-center space-x-3 mb-4 pb-3 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full shimmer" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 shimmer" />
            </div>

            {/* 列表项骨架 - 横线纸风格 */}
            <div className="space-y-3">
              {[...Array(8)].map((_, j) => (
                <div key={j} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full shimmer flex-shrink-0 sketch-circle" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded shimmer w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded shimmer w-2/3" />
                  </div>
                </div>
              ))}
            </div>

            {/* 装饰性铅笔图标 */}
            <div className="mt-4 text-right text-gray-300 dark:text-gray-600">
              ✏️
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
