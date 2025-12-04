#!/bin/bash

BASE_URL="http://localhost:5110/graphql"
CONTENT_TYPE="Content-Type: application/json"

# jq 설치 여부 확인 함수
print_json() {
    if command -v jq &> /dev/null; then
        jq .
    else
        cat
        echo "" # 줄바꿈
    fi
}

echo "========================================"
echo "GraphQL API 테스트 시작"
echo "========================================"

# ---------------------------------------------------------
# 0. 사전 데이터 주입 (Query 테스트를 위해 데이터가 필요함)
# ---------------------------------------------------------
echo -e "\n[Setup] 테스트를 위한 기초 데이터 주입 중..."
# KRW -> USD 데이터 주입
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ "query": "mutation { postExchangeRate (info: { src: \"krw\", tgt: \"usd\", rate: 0.0007450954094671824, date:\"2022-11-28\" }) { src } }" }' > /dev/null
# USD -> KRW 데이터 주입
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ "query": "mutation { postExchangeRate (info: { src: \"usd\", tgt: \"krw\", rate: 1342.11, date:\"2022-11-28\" }) { src } }" }' > /dev/null
echo "데이터 주입 완료"

# ---------------------------------------------------------
# 1. 환율 조회 테스트 (Query)
# ---------------------------------------------------------
echo -e "\n========================================"
echo "1-1. [Query] KRW -> USD 조회"
echo "========================================"
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ 
  "query": "query { getExchangeRate (src: \"krw\", tgt: \"usd\") { src tgt rate date } }"
}' | print_json

echo -e "\n========================================"
echo "1-2. [Query] USD -> KRW 조회"
echo "========================================"
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ 
  "query": "query { getExchangeRate (src: \"usd\", tgt: \"krw\") { src tgt rate date } }"
}' | print_json

echo -e "\n========================================"
echo "1-3. [Query] USD -> USD 조회 (Same Currency)"
echo "========================================"
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ 
  "query": "query { getExchangeRate (src: \"usd\", tgt: \"usd\") { src tgt rate date } }"
}' | print_json

echo -e "\n========================================"
echo "1-4. [Query] KRW -> KRW 조회 (Same Currency)"
echo "========================================"
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ 
  "query": "query { getExchangeRate (src: \"krw\", tgt: \"krw\") { src tgt rate date } }"
}' | print_json


# ---------------------------------------------------------
# 2. 환율 업데이트 테스트 (Mutation)
# ---------------------------------------------------------
echo -e "\n========================================"
echo "2-1. [Mutation] USD -> KRW 업데이트 (Upsert)"
echo "========================================"
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ 
  "query": "mutation { postExchangeRate (info: { src: \"usd\", tgt: \"krw\", rate: 1342.11, date:\"2022-11-28\" }) { src tgt rate date } }"
}' | print_json

echo -e "\n========================================"
echo "2-2. [Mutation] KRW -> KRW 업데이트 (Rate: 2.0 시도 => Result: 1.0이 출력되야 함)"
echo "========================================"
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ 
  "query": "mutation { postExchangeRate (info: { src: \"krw\", tgt: \"krw\", rate: 2.0, date:\"2022-11-28\" }) { src tgt rate date } }"
}' | print_json


# ---------------------------------------------------------
# 3. 환율 삭제 테스트 (Mutation)
# ---------------------------------------------------------
echo -e "\n========================================"
echo "3-1. [Mutation] USD -> KRW 삭제"
echo "========================================"
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ 
  "query": "mutation { deleteExchangeRate (info: { src: \"usd\", tgt: \"krw\", date:\"2022-11-28\" }) { src tgt rate date } }"
}' | print_json

echo -e "\n========================================"
echo "3-2. [Mutation] KRW -> KRW 삭제"
echo "========================================"
curl -X POST "$BASE_URL" -s -H "$CONTENT_TYPE" \
-d '{ 
  "query": "mutation { deleteExchangeRate (info: { src: \"krw\", tgt: \"krw\", date:\"2022-11-28\" }) { src tgt rate date } }"
}' | print_json

echo -e "\n========================================"
echo "모든 테스트 완료"
echo "========================================"