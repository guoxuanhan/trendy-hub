import { NextResponse } from 'next/server';
import { scrapeAllCategories } from '@/lib/scraper';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5分钟缓存

export async function GET() {
  try {
    // 获取所有分类数据
    const allData = await scrapeAllCategories();
    return NextResponse.json({
      categories: allData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending data' },
      { status: 500 }
    );
  }
}
