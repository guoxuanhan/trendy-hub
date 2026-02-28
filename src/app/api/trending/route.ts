import { NextResponse } from 'next/server';
import { scrapeAllCategories, scrapeTophub } from '@/lib/scraper';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5分钟缓存

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (category) {
      const data = await scrapeTophub(category);
      if (!data) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(data);
    }

    // 获取所有分类
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
