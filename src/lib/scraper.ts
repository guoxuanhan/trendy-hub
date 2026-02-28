import * as cheerio from 'cheerio';
import { TrendingItem, TrendingSource, CategoryData, CategoryType } from '@/types';

const TOPHUB_BASE = 'https://tophub.today';

const SOURCE_CATEGORY: Record<string, CategoryType> = {
  '微博': '热搜', '百度': '热搜', '抖音': '热搜',
  '知乎': '社区', '百度贴吧': '社区', '虎扑社区': '社区', '吾爱破解': '社区',
  '哔哩哔哩': '娱乐', '豆瓣电影': '娱乐', '猫眼': '娱乐', 'AcFun': '娱乐', '快手': '娱乐',
  '腾讯新闻': '资讯', '36氪': '资讯', '虎嗅网': '资讯', 'IT之家': '资讯',
  '少数派': '科技', '掘金': '科技', 'GitHub': '科技', 'CSDN博客': '科技',
  '机器之心': '科技', '量子位': '科技', '开源中国': '科技', 'Product Hunt': '科技',
  '微信': '微信', '微信读书': '微信',
};

const WANTED_SOURCES = new Set([
  '微博', '知乎', '百度', '微信', '抖音',
  '哔哩哔哩', '36氪', '少数派', '虎嗅网', 'IT之家',
  '腾讯新闻', '百度贴吧', '虎扑社区', '快手',
  '豆瓣电影', '猫眼', '吾爱破解', 'AcFun',
  '掘金', 'GitHub', 'CSDN博客', '机器之心',
  '量子位', '开源中国', 'Product Hunt',
  '知乎日报', '微信读书', '雪球',
]);

export async function scrapeAllSources(): Promise<TrendingSource[]> {
  try {
    const response = await fetch(TOPHUB_BASE, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`Failed to fetch tophub homepage: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const sources: TrendingSource[] = [];
    const seenNames = new Set<string>();

    $('.cc-cd').each((_, cardEl) => {
      const $card = $(cardEl);
      const sourceName = $card.find('.cc-cd-lb').text().trim();

      if (!sourceName || !WANTED_SOURCES.has(sourceName) || seenNames.has(sourceName)) return;
      seenNames.add(sourceName);

      const items: TrendingItem[] = [];
      const category = SOURCE_CATEGORY[sourceName] || '资讯';

      $card.find('.cc-cd-cb-l a').each((index, linkEl) => {
        if (index >= 25) return;
        const $link = $(linkEl);
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
        sources.push({ name: sourceName, items });
      }
    });

    console.log(`Scraped ${sources.length} sources with ${sources.reduce((sum, s) => sum + s.items.length, 0)} total items`);
    return sources;
  } catch (error) {
    console.error('Error scraping tophub homepage:', error);
    return [];
  }
}

export async function scrapeAllCategories(): Promise<CategoryData[]> {
  const allSources = await scrapeAllSources();

  const categoryMap = new Map<CategoryType, TrendingSource[]>();
  categoryMap.set('全部', allSources);

  allSources.forEach(source => {
    const category = (SOURCE_CATEGORY[source.name] || '资讯') as CategoryType;
    if (!categoryMap.has(category)) categoryMap.set(category, []);
    categoryMap.get(category)!.push(source);
  });

  const categories: CategoryData[] = [];
  const order: CategoryType[] = ['全部', '热搜', '社区', '娱乐', '资讯', '科技', '微信'];

  order.forEach(cat => {
    const sources = categoryMap.get(cat);
    if (sources && sources.length > 0) {
      categories.push({ category: cat, emoji: getCategoryEmoji(cat), sources });
    }
  });

  return categories;
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    '全部': '📚', '热搜': '🔥', '社区': '💬', '娱乐': '🎬',
    '资讯': '📰', '科技': '💡', '微信': '💚',
  };
  return map[category] || '📌';
}
