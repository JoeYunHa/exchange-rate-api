# Node.js 앱 컨테이너 이미지 도커 파일

# Node.js 18 버전 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 포트 개방 (과제 요구사항 5110)
EXPOSE 5110

# 서버 실행
CMD ["npm", "start"]