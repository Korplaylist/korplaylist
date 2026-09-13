# 한국플레이리스트

`korplaylist.com`을 위한 한국여행 정보 사이트입니다. Cloudflare Pages에서 Astro 정적 사이트로 배포하도록 구성되어 있습니다.

## Cloudflare Pages 설정

- Repository: `korplaylist`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Custom domain: `korplaylist.com`

## 로컬 명령

일반 환경에서는 다음을 사용합니다.

```bash
npm install
npm run dev
npm run build
```

현재 작업 환경처럼 npm이 없을 때는 검증용 정적 생성기를 사용할 수 있습니다.

```bash
node scripts/build-static.mjs
```

## 글 작성

새 글은 `src/content/travel/*.md`에 Markdown 파일로 추가합니다. 필수 frontmatter는 다음과 같습니다.

```yaml
---
title: "글 제목"
description: "검색 결과에 표시될 설명"
category: "당일치기"
region: "서울"
tags: ["서울", "당일치기", "국내여행"]
publishedAt: "2026-06-14"
updatedAt: "2026-06-14"
heroImage: "/images/seoul-day-trip.svg"
draft: false
---
```
