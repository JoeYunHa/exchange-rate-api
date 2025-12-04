// GraphQL 스키마
const typeDers = `#graphql
    type Query {
        "환율 조회: src와 tgt는 필수값입니다."
        getExchangeRate(src: String!, tgt: String!): ExchangeInfo
    }

    type Mutation{
        "환율 등록: 정보가 없으면 생성, 있으면 수정(Upsert)"
        postExchangeRate(info: InputUpdateExchangeInfo): ExchangeInfo

        "환율 삭제: 해당 일자의 환율 정보를 삭제합니다."
        deleteExchangeRate(info: InputDeleteExchangeInfo): ExchangeInfo
    }

    input InputUpdateExchangeInfo{
        str: String!
        tgt: String!
        rate: Float!
        "값이 없을 경우, 서버 로직에서 오늘 날짜로 처리"
        date: String
    }

    input InputDeleteExchangeInfo{
        src: String!
        tgt: String!
        date: String!
    }

    type ExchangeInfo @key(fields: "src, tgt"){
        src: String!
        tgt: String!
        rate: Float!
        date: String!
    }
`;

export default typeDefs;