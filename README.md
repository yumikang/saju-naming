# 사주 작명 서비스

사주팔자를 분석하여 부족한 오행을 보완하는 최적의 이름을 추천하는 서비스입니다.

## 🚀 기술 스택

- **Framework**: React Remix
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📋 주요 기능

1. **사주 분석**
   - 생년월일시 기반 천간지지 계산
   - 오행(목/화/토/금/수) 분포 분석
   - 용신(부족한 오행) 추출

2. **작명 추천**
   - 용신에 맞는 한자 선별
   - 부모님의 가치관 반영
   - 음향, 의미, 수리학 종합 평가

3. **한자 데이터베이스**
   - 오행별 한자 분류
   - 의미와 획수 정보
   - 작명 적합도 평가

## 🛠️ 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd saju-naming
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 입력:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SESSION_SECRET="[YOUR-SESSION-SECRET]"
```

### 4. 데이터베이스 설정
```bash
# Prisma 스키마 적용
npm run db:push

# 초기 데이터 입력
npm run db:seed
```

### 5. 개발 서버 실행
```bash
npm run dev
```

## 📁 프로젝트 구조

```
app/
├── routes/
│   ├── _index.tsx              # 랜딩 페이지
│   ├── naming.tsx              # 작명 레이아웃
│   ├── naming._index.tsx       # 작명 시작
│   ├── naming.saju.tsx         # 사주 입력
│   ├── naming.config.tsx       # 이름 설정
│   ├── naming.values.tsx       # 가치 선택
│   └── naming.results.tsx      # 결과 목록
├── lib/
│   ├── saju.server.ts          # 사주 계산 로직
│   ├── naming.server.ts        # 작명 알고리즘
│   ├── db.server.ts            # DB 연결
│   └── session.server.ts       # 세션 관리
└── components/
    └── (컴포넌트들)
```

## 🔧 주요 스크립트

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run db:push      # DB 스키마 적용
npm run db:seed      # 초기 데이터 입력
npm run db:studio    # Prisma Studio 실행
```

## 📝 개발 노트

### 사주 계산 로직
- 년주: 입춘 기준 (대략 2월 4일)
- 월주: 24절기 기준
- 일주: 만세력 기준 (1900년 1월 1일 = 갑진일)
- 시주: 2시간 단위 12지지

### 한자 오행 분류
1. 부수 우선 (가장 명확)
2. 의미 차순
3. 음 참고

### 작명 평가 기준
- 오행 조화: 40%
- 음향 조화: 20%
- 의미 조화: 20%
- 수리학: 20%

## 🚀 배포

Vercel을 통한 배포:
```bash
npm install -g vercel
vercel
```

## 📄 라이선스

MIT License
