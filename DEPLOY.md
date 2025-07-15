# 🚀 Vercel + Supabase 배포 가이드

## 1. GitHub 리포지토리 생성

1. GitHub에서 새 리포지토리 생성
2. 리포지토리명: `saju-naming`
3. Public/Private 선택

```bash
# 원격 리포지토리 연결
git remote add origin https://github.com/[your-username]/saju-naming.git
git branch -M main
git push -u origin main
```

## 2. Vercel에서 프로젝트 배포

1. [vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. GitHub 리포지토리 `saju-naming` 선택
5. Framework Preset: **Remix** 자동 감지됨
6. **Deploy** 클릭

## 3. Vercel Marketplace에서 Supabase 연동

### 방법 1: Vercel 대시보드에서
1. 배포된 프로젝트 → **Settings** → **Integrations**
2. **Browse Marketplace** 클릭
3. **Supabase** 검색 → **Add Integration**
4. **Create new Supabase project** 선택
5. 프로젝트 설정:
   - Project name: `saju-naming`
   - Region: `Northeast Asia (ap-northeast-1)`
   - Password: 자동 생성됨

### 방법 2: Supabase 템플릿 사용
1. [Supabase + Remix 템플릿](https://vercel.com/templates/remix/supabase-remix)
2. **Deploy** 클릭
3. GitHub 리포지토리 연결

## 4. 환경 변수 자동 설정

Vercel Marketplace 연동 후 자동으로 설정됨:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` 
- `DATABASE_URL`
- `DIRECT_URL`

추가로 설정할 환경 변수:
```
SESSION_SECRET=your-random-secret-key-here
```

## 5. 데이터베이스 초기화

### Vercel Dashboard에서:
1. **Settings** → **Functions**
2. **Serverless Functions** 활성화

### 로컬에서 스키마 적용:
```bash
# 환경 변수 확인
npx vercel env pull .env.local

# 데이터베이스 스키마 적용
npx prisma db push

# 초기 데이터 입력
npx prisma db seed
```

## 6. 빌드 설정 확인

`package.json`에 빌드 스크립트 확인:
```json
{
  "scripts": {
    "build": "remix vite:build",
    "postinstall": "prisma generate"
  }
}
```

## 7. 배포 확인

1. Vercel 대시보드에서 배포 상태 확인
2. 생성된 URL 접속
3. 사주 작명 기능 테스트

## 8. 도메인 설정 (선택사항)

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 커스텀 도메인 연결

---

## 🔍 문제 해결

### 빌드 오류
```bash
# Prisma 클라이언트 재생성
npx prisma generate

# 타입 체크
npm run typecheck
```

### 환경 변수 오류
- Vercel Dashboard → Settings → Environment Variables 확인
- Production, Preview, Development 모두 설정되어 있는지 확인

### 데이터베이스 연결 오류
- Supabase 프로젝트가 활성 상태인지 확인
- DATABASE_URL이 올바른지 확인

---

**💡 팁**: Vercel Preview 브랜치로 테스트 후 main 브랜치에 병합하면 자동 배포됩니다!