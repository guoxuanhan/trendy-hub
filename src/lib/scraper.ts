import * as cheerio from 'cheerio';
import { TrendingItem, TrendingSource, CategoryData, CategoryType } from '@/types';

const TOPHUB_BASE = 'https://tophub.today';

// 15个必抓取的热榜源配置
const HOT_SOURCES = [
  { name: '知乎热榜', node: 'mproPpoq6O', category: '社区' as CategoryType },
  { name: '微博热搜', node: 'KqndgxeLl9', category: '热搜' as CategoryType },
  { name: '微信24h热文', node: 'WnBe01o371', category: '微信' as CategoryType },
  { name: '澎湃热榜', node: 'wWmoO5Rd4E', category: '资讯' as CategoryType },
  { name: '百度热点', node: 'Jb0vmloB1G', category: '热搜' as CategoryType },
  { name: 'B站日榜', node: '74KvxwokxM', category: '娱乐' as CategoryType },
  { name: '36氪热榜', node: 'Q1Vd5Ko85R', category: '资讯' as CategoryType },
  { name: '抖音总榜', node: 'DpQvNABoNE', category: '热搜' as CategoryType },
  { name: '少数派', node: 'Y2KeDGQdNP', category: '科技' as CategoryType },
  { name: '今日头条', node: 'x9ozB4KoXb', category: '资讯' as CategoryType },
  { name: '豆瓣新片榜', node: 'mDOvnyBoEB', category: '娱乐' as CategoryType },
  { name: '虎嗅热文', node: '5VaobgvAj1', category: '资讯' as CategoryType },
  { name: '百度贴吧', node: 'Om4ejxvxEN', category: '社区' as CategoryType },
  { name: '虎扑步行街', node: 'G47o8weMmN', category: '社区' as CategoryType },
  { name: '知乎日报', node: 'KMZd7VOvrO', category: '科技' as CategoryType },
];

// 抓取单个热榜源
async function scrapeSingleSource(config: typeof HOT_SOURCES[0]): Promise<TrendingSource | null> {
  try {
    const url = `${TOPHUB_BASE}/n/${config.node}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      next: { revalidate: 300 }, // 缓存5分钟
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${config.name}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const items: TrendingItem[] = [];

    // 解析热榜列表
    $('.cc-cd-cb-l a').each((index, element) => {
      const $link = $(element);
      const title = $link.find('.t').text().trim();
      const heat = $link.find('.e').text().trim();
      const href = $link.attr('href') || '';

      if (title && index < 30) { // 取前30条
        items.push({
          rank: index + 1,
          title,
          heat: heat || undefined,
          source: config.name,
          link: href.startsWith('http') ? href : `${TOPHUB_BASE}${href}`,
          category: config.category,
        });
      }
    });

    if (items.length === 0) {
      console.warn(`No items found for ${config.name}`);
      return null;
    }

    return {
      name: config.name,
      items,
    };
  } catch (error) {
    console.error(`Error scraping ${config.name}:`, error);
    return null;
  }
}

// 并行抓取所有源
export async function scrapeAllSources(): Promise<TrendingSource[]> {
  const results = await Promise.all(
    HOT_SOURCES.map(config => scrapeSingleSource(config))
  );

  return results.filter((source): source is TrendingSource => source !== null);
}

// 按分类组织数据
export async function scrapeAllCategories(): Promise<CategoryData[]> {
  const allSources = await scrapeAllSources();

  // 按分类分组
  const categoryMap = new Map<CategoryType, TrendingSource[]>();

  // 添加"全部"分类
  categoryMap.set('全部', allSources);

  // 按分类分组
  allSources.forEach(source => {
    const category = HOT_SOURCES.find(s => s.name === source.name)?.category || '资讯';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(source);
  });

  // 转换为CategoryData数组
  const categories: CategoryData[] = [];
  categoryMap.forEach((sources, category) => {
    categories.push({
      category,
      emoji: getCategoryEmoji(category),
      sources,
    });
  });

  return categories;
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    '全部': '📚',
    '热搜': '🔥',
    '社区': '💬',
    '娱乐': '🎬',
    '资讯': '📰',
    '科技': '💡',
    '微信': '💚',
  };
  return emojiMap[category] || '📌';
}
