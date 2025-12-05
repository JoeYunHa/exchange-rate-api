# exchange-rate-api

currency CRUD GraphQL API server

- 원화 (KRW) <> 미화(USD) 의 환율정보를 CRUD하는 Graphql API Server 구현
- 환율정보는 mongodb database 에 저장

Tech Stack

- Node.js
- Apollo Server v4
- MongoDB
- Docker & Docker Compose

프로젝트 구조
exchange-rate-api/
├── src/
│ ├── index.js # 서버 진입점 (Server Entry Point)
│ ├── schema/ # GraphQL Type Definitions (Schema)
│ ├── resolvers/ # Business Logic (Query & Mutation)
│ └── models/ # MongoDB Schema & Model
├── docker-compose.yml # 컨테이너 오케스트레이션 설정
├── Dockerfile # Node.js 서버 이미지 빌드 설정
├── test_api.sh # 자동 테스트 스크립트
└── README.md # 프로젝트 문서

실행 방법

1. 사전 요구 사항

- Docker Desktop이 설치되어 있고 실행 중이어야 합니다.

2. 빌드 및 실행

- 프로젝트 루트 디렉토리에서 아래 명령어를 실행합니다.

# 이미지 빌드 및 컨테이너 실행

docker-compose up --build

3. 테스트 방법

- 서버가 실행 중인 상태에서 제공된 테스트 스크립트를 활용하여 작성한 쉘 스크립트를 통해 테스트를 한 번에 진행할 수 있습니다.

# 실행 권한 부여 (최초 1회)

chmod +x test_api.sh

# 테스트 실행

./test_api.sh

4. 트러블슈팅

- Apollo Sandbox 접속 불가 시: test_api.sh 스크립트를 실행해 주시면 모든 테스트 케이스를 검증하실 수 있습니다.
- Docker 실행 오류 시: Docker Desktop이 실행 중인지 확인해주시고, 기존 컨테이너 충돌 시 docker-compose down -v 후 다시 실행해 주십시오.
