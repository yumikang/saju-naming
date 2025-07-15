# 📋 GitHub 리포지토리 연결 가이드

## 1. GitHub에서 리포지토리 생성

1. [github.com](https://github.com) 접속
2. 우상단 "+" → "New repository"
3. 설정:
   - **Repository name**: `saju-naming`
   - **Description**: `사주팔자 분석을 통한 AI 작명 서비스 - Remix + Supabase`
   - **Public** 선택
   - ❌ Add a README file (체크 해제)
   - ❌ Add .gitignore (체크 해제)  
   - ❌ Choose a license (체크 해제)

## 2. 로컬과 GitHub 연결

```bash
# GitHub 리포지토리와 연결 (your-username을 실제 사용자명으로 변경)
git remote add origin https://github.com/[your-username]/saju-naming.git

# 브랜치명 확인 및 설정
git branch -M main

# GitHub에 업로드
git push -u origin main
```

## 3. 성공 확인

- GitHub 리포지토리 페이지에서 파일들이 업로드되었는지 확인
- README.md, package.json 등이 보이면 성공!

## 4. 다음 단계

GitHub 업로드 완료 후:
1. [vercel.com](https://vercel.com)에서 배포 진행
2. Supabase 연동
3. 환경 변수 설정

---

**💡 팁**: 
- GitHub 사용자명을 모르시면 GitHub 프로필 페이지에서 확인 가능
- SSH를 사용하시려면 `git@github.com:[username]/saju-naming.git` 형식 사용