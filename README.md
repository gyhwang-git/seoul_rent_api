# 서울 집값 리포트

Cloudflare Pages 시안입니다. 공개 전월세 OpenAPI, 매매 실거래 OpenAPI와 연결할 API Function이 포함되어 있습니다.

## 키 보안

- 저장소 루트의 `.env`는 브라우저 번들/정적 파일에 복사하지 않습니다. Cloudflare Pages 정적 배포 경로는 `public/`으로 제한했습니다.
- 개발 시 이 폴더에 `.dev.vars`를 만들고 `SEOUL_API_KEY=...`와 `CARTO_API_KEY=...`를 설정합니다. 이 파일은 Git에 커밋하지 마세요.
- 배포 시 `wrangler pages secret put SEOUL_API_KEY`와 `wrangler pages secret put CARTO_API_KEY`로 Cloudflare Pages secrets에 등록합니다.
- `/api/market` Function만 서울시 API를 호출합니다. 서울시 인증키는 브라우저에 반환되지 않습니다.
- 지도는 CARTO 타일을 사용합니다. CARTO 웹 키는 지도 타일 요청 시 브라우저에서 보이므로 `/api/map-config`로 전달하고, CARTO 대시보드에서 배포 도메인 제한을 설정해야 합니다. 서울시 키는 서버에만 남습니다.

## 시안 미리보기

`npm run preview`로 정적 시안을 엽니다. API Function까지 로컬에서 확인하려면 `npm install` 후 `npm run dev`를 실행합니다. 지도는 행정동 색상표현 및 선택 흐름을 보여주는 시안 지도입니다. 실서비스 전 공인 행정동 경계 GeoJSON과 행정동 코드 매핑을 연결해야 합니다.

## 배포 전 연결 작업

1. 실제 API 스키마/페이지 총량을 확인하고 서버에서 페이지 단위 조회 후 동·월별로 집계합니다. 지금 함수는 API 키를 숨긴 단일 1,000행 샘플 응답 골격입니다.
2. 공인 행정동 경계 자료와 코드 사전을 연결합니다. 거래 데이터의 법정동 코드는 행정동과 다르므로 별도 행정코드 매핑이 필요합니다.
3. CARTO 키의 허용 호스트를 Cloudflare 배포 도메인으로 제한하고, 저작자 표기를 유지합니다.
4. 전월세/매매의 가격 단위와 면적 구간을 정규화하고, 시안 예시값을 실제 집계값으로 교체합니다.

## 데이터

- [서울시 부동산 전월세가 정보](https://data.seoul.go.kr/dataList/OA-21276/A/1/datasetView.do)
- [서울시 부동산 실거래가 정보](https://data.seoul.go.kr/dataList/OA-21275/A/1/datasetView.do)
- [서울 행정동 경계 (vuski/admdongkor, 2025-01-01 기준)](https://github.com/vuski/admdongkor)

