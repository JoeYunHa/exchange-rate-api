// Mongoose model
import mongoose from "mongoose";

// MongoDB에 저장될 Document 구조 정의
const exchangeRateSchema = new mongoose.Schema(
  {
    src: { type: String, required: true }, // source 통화
    tgt: { type: String, required: true }, // target 통화
    rate: { type: Number, required: true }, // 환율
    date: { type: String, required: true }, // YYYY-MM-DD string
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

// 최신 날짜 정렬을 위한 index
exchangeRateSchema.index({ src: 1, tgt: 1, date: -1 });

// 생성일 기준 정렬을 위한 index
exchangeRateSchema.index({ createdAt: -1 });

// 해당 schema를 기반으로 데이터 조작을 담당할 모델 생성
const ExchangeRate = mongoose.model("ExchangeRate", exchangeRateSchema);

export default ExchangeRate;
