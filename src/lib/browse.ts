import { localizedRegions, localizedCategories, categorySlugMap, regionSlugMap } from '../site.config';
import { getPostRegionSlug, normalizeCategory } from './travel';

export function browseCategory(category: string) {
  const normalized = normalizeCategory(category);
  for (const labels of Object.values(localizedCategories)) {
    const index = labels.indexOf(normalized);
    if (index >= 0) return categorySlugMap[localizedCategories.ko[index]];
  }
  const aliases: Record<string, string> = {
    'Day Trips': 'itineraries', '日帰り旅行': 'itineraries', '旅行コース': 'itineraries',
    'Seasonal Guides': 'seasonal-trips', 'Summer Travel': 'seasonal-trips',
    '季節ガイド': 'seasonal-trips', '季節の旅': 'seasonal-trips',
    'Transport Guides': 'transport', 'Transport Planning': 'transport', 'Travel Tips': 'transport',
    '交通ガイド': 'transport', '交通計画': 'transport', '空港アクセス': 'transport'
  };
  if (aliases[normalized]) return aliases[normalized];
  throw new Error(`Unmapped browse category: ${category}`);
}

export function browseGroups(posts: any[], locale: string, kind: string) {
  const groups = new Map<string, { key: string; label: string; posts: any[] }>();
  for (const post of posts) {
    const key = kind === 'regions' ? getPostRegionSlug(post) : browseCategory(post.data.category);
    const index = localizedRegions.ko.findIndex(region => regionSlugMap[region] === key);
    const categoryIndex = localizedCategories.ko.findIndex(category => categorySlugMap[category] === key);
    const label = kind === 'regions' ? localizedRegions[locale]?.[index] ?? post.data.region : localizedCategories[locale][categoryIndex];
    if (!groups.has(key)) groups.set(key, { key, label, posts: [] });
    groups.get(key)!.posts.push(post);
  }
  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label, locale));
}

export function browseUrl(locale: string, kind: string, key?: string) {
  return `/${locale}/${kind}/${key ? `${encodeURIComponent(key)}/` : ''}`;
}

export const browseLabels = {
  ko: { search: '검색', region: '지역', theme: '테마', all: '전체', empty: '검색 결과가 없습니다.', reset: '초기화', previous: '이전 페이지', next: '다음 페이지', results: '검색 결과', page: '페이지' },
  en: { search: 'Search', region: 'Region', theme: 'Theme', all: 'All', empty: 'No matching guides.', reset: 'Reset', previous: 'Previous page', next: 'Next page', results: 'Results', page: 'Page' },
  ja: { search: '検索', region: '地域', theme: 'テーマ', all: 'すべて', empty: '該当する記事はありません。', reset: 'リセット', previous: '前のページ', next: '次のページ', results: '検索結果', page: 'ページ' }
};
