# 🏛️ 부산광역시 ✕ 부산상공회의소 기업정책협력관 비전 & 성과 포털

> **부산광역시에서 부산상공회의소로 파견 나간 기업정책협력관**의 핵심 역할, 성과, 진행 중인 업무, 향후 추진 계획을 누구나 투명하게 확인하고 소통할 수 있는 프리미엄 웹 애플리케이션 포털입니다.

---

## 📌 4대 주요 역할 및 핵심 비전

기업정책협력관은 부산광역시와 부산상공회의소 간 원팀(One-Team) 민관 가교로서 다음 4대 핵심 분야를 전담 수행합니다.

1. **🏢 기업애로 발굴 및 해결 (`TROUBLE`)**
   - 현장 규제 개선, 인허가 절차 간소화, 기업 물류/자금/입지 애로 원스톱 해소
2. **📜 제도개선 및 시책건의 (`REFORM`)**
   - 부산시 조례 개정, 중앙부처 법령 완화, 기업 친화적 투자 유치 제도 개선 건의
3. **💡 기업정책 발굴 (`POLICY`)**
   - 부산 미래 신산업(양자 컴퓨팅, AI, 제조업 DX, 해양 딥테크) 육성 및 기업 지원 자금 수립
4. **🤝 민관협력 (`COOPERATION`)**
   - 부산시-부산상공회의소-기업인 간 합동 현장 라운드테이블, 1:1 담당관 핫라인 매칭, 지역 상생발전 협력

---

## ✨ 핵심 기능

* **📊 4대 역할별 대시보드 & KPI 수치 요약**: 해결률, 추진 과제 수, 카테고리별 실적 한눈에 파악 (클릭 시 자동 필터링)
* **🔍 상태 & 역할 & 키워드 통합 트래커**: 
  * `전체 과제` | `✅ 완료된 일 (성과)` | `🔄 하고 있는 일 (진행중)` | `📅 할 계획인 일 (추진예정)`
  * 실시간 키워드/태그 검색 및 최신순/오래된순 정렬 지원
* **🔍 과제 상세 모달 (Detail View)**: 추진 배경, 담당 부서, 수혜 대상, 세부 경과 타임라인, 기대 효과 상세 제공
* **🔒 담당자/관리자 비밀번호 보호 및 수정 기능**:
  * **초기 비밀번호**: `busan123`
  * 누구나 실적 확인 및 건의는 가능하며, `[+ 업무/실적 등록]`, `[✏️ 수정]`, `[🗑️ 삭제]` 시 관리자 인증 팝업 출력
  * 비밀번호 변경 기능 지원 (`LocalStorage` 저장)
* **✉️ 기업애로 & 시책 아이디어 접수 창구**: 기업인들이 직접 애로사항을 접수하고 안내받는 소통 폼 (직통: `051-990-7171`, `pusan@korcham.net`)

---

## 🎨 디자인 시스템 & 공식 CI

* **부산광역시 공식 CI (3D B Symbol)**: 부산의 'B'와 'S' 모티브 3D 폴리곤 상징 & 전용 워드마크 (SVG)
* **부산상공회의소 공식 로고 (Digital Gear)**: 디지털 톱니바퀴 픽셀 스파크 상징 & 굵은 전용 워드마크 (SVG)
* **화이트 크리스피 뱃지 디스플레이**: 로고 본연의 쨍한 색감과 조형미를 100% 살려주는 세련된 카드 레이아웃

---

## 🛠️ 웹사이트 구현 ~ 깃허브 ~ 버셀(Vercel) 연동 전체 가이드

### 1단계: 웹사이트 구현 (Web Architecture)
* **Front-end**: HTML5, Vanilla CSS3 (Custom Properties, Flexbox, Grid, Glassmorphism, Micro-animations), Vanilla JavaScript (ES6+, Class-based State Management, LocalStorage Persistence)
* **파일 구조**:
  * `index.html` : 포털 메인 레이아웃, 대시보드, 트래커, 모달 UI 구조
  * `styles.css` : Deep Navy & Ocean Blue 테마, CI 로고 뱃지, 컴팩트 헤더 버튼, 반응형 CSS
  * `app.js` : 12개 실무 과제 데이터, 4대 역할/상태 필터링, 관리자 보안 인증 및 CRUD 연동

---

### 2단계: GitHub (깃허브) 저장소 연동 및 코드 업로드

#### 1) Git 초기화 및 커밋
```bash
git init
git config user.name "ktkim97"
git config user.email "pusan@korcham.net"
git add .
git commit -m "feat: Busan Business Policy Cooperation Officer Portal"
git branch -M main
```

#### 2) GitHub 원격 저장소 추가 및 Push
```bash
git remote add origin https://github.com/ktkim97/office.git
git push -u origin main --force
```
> **저장소 주소**: [https://github.com/ktkim97/office.git](https://github.com/ktkim97/office.git)

---

### 3단계: Vercel (버셀) 원클릭 자동 배포 연동 가이드

Vercel은 깃허브 저장소와 연동 시 소스 코드가 업데이트될 때마다 자동으로 초고속 배포를 지원합니다.

#### 1) Vercel 회원가입 및 로그인
1. [Vercel 공식 홈페이지 (https://vercel.com)](https://vercel.com) 접속
2. **`Continue with GitHub`** 버튼을 클릭하여 GitHub 계정(`ktkim97`)으로 간편 로그인

#### 2) 깃허브 프로젝트 불러오기 (Import Project)
1. Vercel 대시보드 우측 상단의 **`[Add New...]` ➔ `[Project]`** 클릭
2. `Import Git Repository` 목록에서 **`ktkim97/office`** 저장소를 찾고 **`[Import]`** 클릭
   *(만약 목록에 보이지 않는다면 `Adjust GitHub App Permissions` 클릭하여 `office` 저장소 접근 권한 허용)*

#### 3) 프로젝트 설정 및 배포 (Configure & Deploy)
1. **Project Name**: `busan-office` (또는 원하시는 이름 입력)
2. **Framework Preset**: `Other` (정적 HTML/CSS/JS 프로젝트)
3. **Root Directory**: `./` (기본값 유지)
4. 하단의 **`[Deploy]`** 버튼 클릭!

#### 4) 배포 완료 및 접속
* 약 10~15초 후 배포가 완료되며 폭죽 애니메이션과 함께 배포 URL이 생성됩니다.
* **예시 생성 주소**: `https://office-xxx.vercel.app` 또는 `https://busan-office.vercel.app`
* 이제 소스 코드를 GitHub `main` 브랜치에 push할 때마다 Vercel이 자동으로 실시간 재배포합니다.

---

## 📞 문의 및 소통 창구

* **소속**: 부산광역시 ↔ 부산상공회의소 기업정책협력관
* **직통 전화**: 051-990-7171
* **공식 이메일**: pusan@korcham.net
* **주소**: 부산광역시 연제구 중앙대로 1001 (부산시청) / 부산광역시 남구 황령대로 24 (부산상공회의소)

ⓒ 2026 Busan Metropolitan City & Chamber of Commerce. All Rights Reserved.
