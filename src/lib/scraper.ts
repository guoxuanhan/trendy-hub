import * as cheerio from 'cheerio';
import { TrendingItem, TrendingSource, CategoryData } from '@/types';

const TOPHUB_BASE = 'https://tophub.today';

// 分类映射
const CATEGORY_MAPPING = {
  '热搜': [
    { url: '/c/news', sources: ['微博热搜', '百度热点'] },
  ],
  '社区': [
    { url: '/c/community', sources: ['知乎热榜', '豆瓣'] },
  ],
  '娱乐': [
    { url: '/c/ent', sources: ['抖音', 'B站'] },
  ],
  '购物': [
    { url: '/c/shopping', sources: ['淘宝热卖'] },
  ],
  '资讯': [
    { url: '/c/news', sources: ['澎湃新闻', '今日头条', '36氪'] },
  ],
  '科技': [
    { url: '/c/tech', sources: ['少数派', '虎嗅'] },
  ],
};

// 源颜色映射
const SOURCE_COLORS: Record<string, string> = {
  '微博热搜': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  '百度热点': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  '知乎热榜': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  '豆瓣': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  '抖音': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'B站': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  '淘宝热卖': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  '澎湃新闻': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  '今日头条': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  '36氪': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  '少数派': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  '虎嗅': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export async function scrapeTophub(category: string): Promise<CategoryData | null> {
  try {
    const mapping = CATEGORY_MAPPING[category as keyof typeof CATEGORY_MAPPING];
    if (!mapping) return null;

    const sources: TrendingSource[] = [];

    for (const { url } of mapping) {
      const response = await fetch(`${TOPHUB_BASE}${url}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        next: { revalidate: 300 }, // 缓存5分钟
      });

      if (!response.ok) continue;

      const html = await response.text();
      const $ = cheerio.load(html);

      // 解析每个热榜源
      $('.cc-cd').each((_, element) => {
        const $card = $(element);
        const sourceName = $card.find('.cc-cd-lb').text().trim();

        // 只提取我们需要的源
        if (!mapping[0].sources.includes(sourceName)) return;

        const items: TrendingItem[] = [];

        $card.find('.cc-cd-cb-l a').each((index, link) => {
          const $link = $(link);
          const title = $link.find('.t').text().trim();
          const heat = $link.find('.e').text().trim();
          const href = $link.attr('href') || '';

          if (title) {
            items.push({
              rank: index + 1,
              title,
              heat: heat || undefined,
              source: sourceName,
              link: href.startsWith('http') ? href : `${TOPHUB_BASE}${href}`,
              category,
            });
          }
        });

        if (items.length > 0) {
          sources.push({
            name: sourceName,
            items: items.slice(0, 20), // 只取前20条
            color: SOURCE_COLORS[sourceName],
          });
        }
      });
    }

    return {
      category,
      emoji: getCategoryEmoji(category),
      sources,
    };
  } catch (error) {
    console.error(`Error scraping ${category}:`, error);
    return null;
  }
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    '热搜': '🔥',
    '社区': '💬',
    '娱乐': '🎬',
    '购物': '🛍️',
    '资讯': '📰',
    '科技': '💡',
  };
  return emojiMap[category] || '📌';
}

export async function scrapeAllCategories(): Promise<CategoryData[]> {
  const categories = Object.keys(CATEGORY_MAPPING);
  const results = await Promise.all(
    categories.map(cat => scrapeTophub(cat))
  );
  return results.filter((r): r is CategoryData => r !== null);
}
