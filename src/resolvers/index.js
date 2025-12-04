// Query/Mutation 구현
import ExchangeRate from "../models/ExchangeRate.js";

const resolvers = {
  Query: {
    // REST API의 GET 요청과 유사
    getExchangeRate: async (_, { src, tgt }) => {
      // src == tgt -> DB 조회 없이 즉시 반환
      if (src == tgt) {
        return {
          src,
          tgt,
          rate: 1,
          date: new Date().toISOString().split("T")[0],
        };
      }

      // src != tgt -> DB index로 날짜순 정렬 후 가장 최신 것 조회
      const exchangeRate = await ExchangeRate.findOne({ src, tgt }).sort({
        date: -1,
      });

      return exchangeRate;
    },
  },

  Mutation: {
    // REST API의 POST, PUT, DELETE를 합친 개념 => 데이터 변경 시 사용
    postExchangeRate: async (_, { info }) => {
      let { src, tgt, rate, date } = info;

      // !date -> 오늘 날짜 할당
      if (!date) {
        date = new Date().toISOString().split("T")[0];
      }

      // src == tgt -> rate == 1
      if (src == tgt) {
        rate = 1;
      }

      // Upsert
      // new: true -> update된 문서 반환, upsert: true -> data 없으면 생성
      const result = await ExchangeRate.findOneAndUpdate(
        { src, tgt, date },
        { src, tgt, rate, date },
        { new: true, upsert: true }
      );

      return result;
    },

    deleteExchangeRate: async (_, { info }) => {
      const { src, tgt, date } = info;

      // 조건에 맞는 문서 찾아 삭제 후 삭제된 문서 반환
      const result = await ExchangeRate.findOneAndDelete({ src, tgt, date });

      return result;
    },
  },
};

export default resolvers;
