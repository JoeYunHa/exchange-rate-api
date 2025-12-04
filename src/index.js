// 서버 진입점
// Express 서버와 Apollo Server 결합 + MongoDB에 연결 => server 시작
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// sandbox ui plugin import
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// import schema, resolver
import typeDefs from "./schema/typeDefs.js";
import resolvers from "./resolvers/index.js";

dotenv.config(); // 환경변수 로드

const app = express();
// Express 앱을 감싸는 HTTP 서버 생성
// -> Apollo의 grace terminate를 위함
const httpServer = http.createServer(app);

// Apollo Server instance 생성
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // 브라우저 접속 시 샌드박스 UI를 보여주도록 설정
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

// (async)Apollo Server 시작
await server.start();

// middleware : /graphql -> Apollo가 처리
// CORS 허용
app.use(cors());
// JSON parser 전역 적용
// 모든 요청에 대해 Body -> JSON 으로 파싱하여 req.body 생성
app.use(express.json());
//GraphQL 엔드포인트 연결
app.use("/graphql", expressMiddleware(server));

const PORT = process.env.PORT || 5110;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/exchange_db";

// DB 연결 및 서버 실행
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
    return new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  })
  .then(() => {
    // 과제 조건
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  })
  .catch((err) => {
    console.error("Server Error:", err);
  });
