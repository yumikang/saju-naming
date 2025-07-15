# 🚀 Supabase 설정 및 실행 가이드

## 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 방문
2. "Start your project" 클릭 → GitHub 로그인
3. "New project" 클릭
4. 설정:
   - **Project name**: `saju-naming`
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
   - **Region**: `Northeast Asia (Seoul)`
   - **Plan**: Free tier

## 2. API 키 및 URL 확인

프로젝트 생성 후 대시보드에서:

### Settings > API
- **Project URL**: `https://[project-ref].supabase.co`
- **anon/public key**: `eyJ...` (긴 토큰)

### Settings > Database  
- **Connection string**: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

## 3. 환경 변수 업데이트

`.env` 파일을 열어서 대괄호 부분을 실제 값으로 교체:

```bash
# 예시:
DATABASE_URL="postgresql://postgres:your-password@db.abcdefghijk.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:your-password@db.abcdefghijk.supabase.co:5432/postgres"
SUPABASE_URL="https://abcdefghijk.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SESSION_SECRET="my-super-secret-key-12345"
```

## 4. 데이터베이스 설정

환경 변수 설정 완료 후 실행:

```bash
# 1. 데이터베이스 스키마 적용
npm run db:push

# 2. 초기 한자 데이터 입력
npm run db:seed

# 3. 개발 서버 실행
npm run dev
```

## 5. 확인 사항

- ✅ Supabase 프로젝트 생성됨
- ✅ 환경 변수 설정 완료
- ✅ 데이터베이스 스키마 적용됨
- ✅ 초기 데이터 입력됨
- ✅ 개발 서버 실행됨

## 6. 문제 해결

### 데이터베이스 연결 오류
```bash
# Prisma 클라이언트 재생성
npx prisma generate

# 연결 테스트
npx prisma db push --preview-feature
```

### 환경 변수 오류
- `.env` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수에 공백이나 특수문자가 없는지 확인
- Supabase 프로젝트가 활성화 상태인지 확인

## 7. 다음 단계

서버가 실행되면:
1. `http://localhost:5173` 접속
2. "작명 시작하기" 클릭
3. 테스트 데이터로 작명 기능 확인

---

**💡 팁**: Supabase 대시보드의 Table Editor에서 입력된 한자 데이터를 확인할 수 있습니다!