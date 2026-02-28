export interface TrendingItem {
  rank: number;
  title: string;
  heat?: string;
  source: string;
  link: string;
  category: string;
}

export interface TrendingSource {
  name: string;
  items: TrendingItem[];
  icon?: string;
  color?: string;
}

export interface CategoryData {
  category: string;
  emoji: string;
  sources: TrendingSource[];
}

export type CategoryType = '全部' | '热搜' | '社区' | '娱乐' | '资讯' | '科技' | '微信';
