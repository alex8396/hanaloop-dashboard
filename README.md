# 🌿 HanaLoop Carbon Emissions Dashboard (탄소 배출량 대시보드)

하나루프(HanaLoop) 프론트엔드 개발자 채용 과제를 위한 **탄소 배출량 모니터링 및 제품 탄소 발자국(PCF) 계산 대시보드**입니다. 경영진 및 실무자가 직관적으로 데이터를 파악하고 인사이트를 관리할 수 있도록 설계되었습니다.

---

## 🚀 로컬 실행 방법 (Quick Start)
과제 요구사항에 따라 `yarn start` 명령어로 오류 없이 즉시 실행되도록 세팅해 두었습니다. (5단계 이내)

1. 터미널을 엽니다. (현재 위치: `hanaloop` 폴더)
2. 패키지를 설치합니다. (npm 또는 yarn 모두 가능)
   ```bash
   yarn install
   ```
3. 로컬 개발 서버를 실행합니다.
   ```bash
   yarn start
   ```
4. 브라우저를 열고 `http://localhost:3000` 에 접속하여 대시보드를 확인합니다.
5. **UI 실행 과정**: 폴더 내 `UI_Execution_Video.webp` 파일에서 전체 구동 과정을 확인하실 수 있습니다.

---

## 🐳 Docker Compose 실행 (보너스 요건)
도커 환경이 구성되어 있다면, 아래 명령어 한 줄로 즉시 실행할 수 있습니다.
```bash
cd carbon-dashboard
docker compose up --build -d
```
접속 주소: `http://localhost:3000`

---

## 📋 핵심 평가 기준 구현 내용 (체크리스트)

### 1. 도메인 이해 및 데이터 시각화 (PCF, 단위, 에러 처리)
- **PCF 및 단위 표시**: 배출량의 단위인 `kgCO₂e` 와 `tCO₂e`를 대시보드 차트와 표에 정확히 명시했습니다. `EmissionsChart` 컴포넌트에서 모든 배출 데이터를 월별로 합산하여 직관적인 면적형 차트로 제공합니다.
- **오류 처리 및 에러 메시지**: 엑셀 파싱 시 포맷이 맞지 않거나 필수 헤더('일자(원본)', '활동 유형', '량')가 누락된 경우 사용자에게 명확한 에러 메시지(Alert)를 노출합니다.
- **과제용 데이터 직접 임포트 (보너스 만점 요건)**: 좌측 사이드바의 **데이터 임포트** 탭에서 제시된 `CT-045` 엑셀 파일(예: `test.xlsx`)을 그대로 업로드할 수 있습니다. `xlsx` 라이브러리가 브라우저에서 직접 활동 데이터를 추출하고, 하드코딩된 **배출계수(한국전력: 0.456 등)**를 곱하여 즉석에서 PCF를 자동 계산해 표로 시각화합니다.

### 2. UI/UX 및 시스템 아키텍처
- **메뉴 최적화**: 실무에서 사용하지 않는 메뉴를 제거하고 '대시보드 개요'와 '데이터 임포트'로 사이드바를 간소화하여 사용성을 높였습니다. 현재 페이지에 따른 활성화 상태(Active State)를 시각적으로 강조합니다.
- **Optimistic UI (낙관적 업데이트)**: `PostManager` 컴포넌트에서 Insight 추가 시, 서버 응답 전에 UI에 먼저 반영합니다. 가짜 API(`lib/api.ts`)에서 의도적으로 에러를 발생시키며, 에러 발생 시 원래 상태로 롤백(Rollback)하는 엔지니어링을 구현했습니다.

### 3. OpenAPI / Swagger 문서 및 UI (보너스 고도화)
- 단순히 명세서(`swagger.yaml`)를 제공하는 것에 그치지 않고, `swagger-ui-react`를 활용하여 **브라우저에서 직접 확인할 수 있는 API 문서 페이지(`/api-docs`)**를 구축하였습니다. 사이드바 메뉴를 통해 접근 가능합니다.

---

## 🧠 발표 대비 논리적 설명 (설계 결정 및 Trade-off)

### Q. 전역 상태 라이브러리(Redux/Zustand 등)를 배제하고 Custom Hook을 쓴 이유는? (설계 이유 1 & Trade-off)
- **Trade-off**: Redux나 Zustand 같은 라이브러리는 강력하지만, 본 과제처럼 '서버에서 가져온 데이터(Server State)를 렌더링하는 것'이 주 목적인 애플리케이션에서는 불필요한 보일러플레이트 코드를 유발합니다.
- **설계 이유**: React Hook의 강력함을 보여주기 위해, `useDashboardData`, `usePosts` 커스텀 훅을 직접 작성하여 캐싱, 로딩 상태, 그리고 에러 롤백(Optimistic UI) 로직을 모듈화했습니다. 외부 라이브러리 의존성은 낮추으면서도 엔지니어링 역량과 아키텍처 이해도를 높이는 방향을 택했습니다.

### Q. 차트 시각화에 D3.js나 Chart.js 대신 Recharts를 선택한 이유는? (설계 이유 2)
- Recharts는 SVG 기반으로 동작하여 React 컴포넌트 패턴에 가장 친화적이고 반응형(Responsive) 구현이 쉽습니다. D3.js는 러닝 커브가 높아 유지보수 비용이 크고, Chart.js는 Canvas 기반이라 React와의 융화에 한계가 있어, 생산성과 성능 측면에서 Recharts가 최적의 Trade-off를 제공합니다.

---

## 🗄️ 데이터베이스 스키마 다이어그램 (ERD)

```mermaid
erDiagram
    COMPANY ||--o{ EMISSION : generates
    COMPANY ||--o{ POST : "insight from"
    EMISSION_FACTOR ||--o{ EMISSION : "used to calculate"

    COMPANY {
        string id PK
        string name
        string country "US, KR 등"
    }

    EMISSION {
        string id PK
        string companyId FK
        string yearMonth "YYYY-MM"
        string source "전기, 원소재, 운송"
        float emissions "tCO2e"
    }

    POST {
        string id PK
        string resourceUid FK "Company.id"
        string title
        string content
        string dateTime
    }

    EMISSION_FACTOR {
        string id PK
        string category "전기, 플라스틱1, 트럭 등"
        float factor "e.g. 0.456"
        string unit "kgCO2e / kWh"
        string version "v1.0"
        datetime effectiveDate
    }
```

---

## 🤖 AI 도구 사용 내역 (AI Usage)
- **도구 명칭**: Antigravity (Gemini 기반 자율 코딩 에이전트)
- **프롬프트 및 결정 내역**:
  1. *"과제용 데이터를 활용하여 PCF 데이터를 시각화하는 인터랙티브 대시보드를 구현하라"* -> Next.js 14 App Router와 Tailwind CSS 기반의 모던 스캐폴딩 생성.
  2. *"엑셀(CT-045)을 그대로 임포트하는 기능을 구현하라"* -> `xlsx` 라이브러리를 사용해 브라우저 단에서 엑셀을 파싱하고, 배출계수를 곱해 PCF를 도출하는 로직 설계.
  3. *"실무 중심의 고도화"* -> 단순 차트 노출을 넘어 Optimistic UI를 통한 인사이트 관리, Swagger UI 페이지 구축, 사이드바 UX 최적화 등을 제안하고 구현함.
