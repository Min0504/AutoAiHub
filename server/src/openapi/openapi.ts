/**
 * OpenAPI 3.1 스펙 — 손으로 관리하는 API 계약서.
 *
 * 코드에서 자동 생성하는 도구(tsoa, zod-openapi 등)도 있지만,
 * 스펙을 직접 써보면 "API가 곧 계약"이라는 감각과 스펙 문법 자체를 익힐 수 있다.
 * 엔드포인트를 추가/변경하면 반드시 이 문서도 함께 갱신한다.
 */
const errorResponse = {
  type: "object",
  properties: {
    error: {
      type: "object",
      properties: {
        code: {
          type: "string",
          enum: [
            "VALIDATION_ERROR",
            "UNAUTHORIZED",
            "INVALID_CREDENTIALS",
            "INVALID_TOKEN",
            "TOKEN_EXPIRED",
            "REFRESH_REUSE_DETECTED",
            "FORBIDDEN",
            "NOT_FOUND",
            "CONFLICT",
            "RATE_LIMITED",
            "INTERNAL",
          ],
        },
        message: { type: "string" },
        details: {},
        requestId: { type: "string" },
      },
      required: ["code", "message", "requestId"],
    },
  },
  required: ["error"],
} as const;

const err = (description: string) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
});

const pageMeta = {
  type: "object",
  properties: {
    page: { type: "integer" },
    limit: { type: "integer" },
    totalItems: { type: "integer" },
    totalPages: { type: "integer" },
  },
} as const;

const user = {
  type: "object",
  properties: {
    id: { type: "integer" },
    email: { type: "string", format: "email" },
    nickname: { type: "string" },
    role: { type: "string", enum: ["user", "admin"] },
    createdAt: { type: "string", format: "date-time" },
  },
} as const;

const tokenPair = {
  type: "object",
  properties: {
    accessToken: { type: "string", description: "JWT. Authorization: Bearer {token}" },
    accessTokenExpiresInSec: { type: "integer" },
    refreshToken: { type: "string", description: "1회용. /auth/refresh 시 회전된다." },
    refreshTokenExpiresAt: { type: "string", format: "date-time" },
  },
} as const;

const reviewStats = {
  type: "object",
  properties: {
    count: { type: "integer" },
    averageRating: { type: ["number", "null"] },
  },
} as const;

const toolListItem = {
  type: "object",
  properties: {
    slug: { type: "string" },
    name: { type: "string" },
    category: {
      type: "string",
      enum: ["Workflow Automation", "No-Code Automation", "AI Agents", "Developer Automation"],
    },
    badge: { type: ["string", "null"] },
    slogan: { type: "string" },
    priceInfo: { type: "string" },
    difficulty: { type: "string", enum: ["쉬움", "보통", "어려움"] },
    difficultyLevel: { type: "integer", minimum: 1, maximum: 5 },
    editorialRating: { type: "number" },
    bestFor: { type: "string" },
    affiliateUrl: { type: "string", format: "uri" },
    logoColor: { type: ["string", "null"] },
    logoTextColor: { type: ["string", "null"] },
    reviewStats: { $ref: "#/components/schemas/ReviewStats" },
  },
} as const;

const toolDetail = {
  allOf: [
    { $ref: "#/components/schemas/ToolListItem" },
    {
      type: "object",
      properties: {
        pricingDetails: {
          type: "object",
          properties: {
            free: { type: "string" },
            starter: { type: "string" },
            pro: { type: "string" },
            pricingModel: { type: "string" },
          },
        },
        features: { type: "array", items: { type: "string" } },
        pros: { type: "array", items: { type: "string" } },
        cons: { type: "array", items: { type: "string" } },
        aiIntegration: { type: "string" },
        alternatives: { type: "array", items: { type: "string" } },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
  ],
} as const;

const review = {
  type: "object",
  properties: {
    id: { type: "integer" },
    toolSlug: { type: "string" },
    rating: { type: "integer", minimum: 1, maximum: 5 },
    content: { type: "string" },
    author: {
      type: "object",
      properties: { id: { type: "integer" }, nickname: { type: "string" } },
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

const bearerAuth = [{ bearerAuth: [] }];
const slugParam = {
  name: "slug",
  in: "path",
  required: true,
  schema: { type: "string" },
} as const;
const paginationParams = [
  { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
  { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
] as const;

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "AutoHub AI API",
    version: "1.0.0",
    description:
      "업무 자동화 툴 비교 서비스의 백엔드 API. 인증(JWT + refresh rotation), 툴 카탈로그, 리뷰, 북마크, 제휴 클릭 통계를 제공한다.",
  },
  servers: [{ url: "/", description: "current host" }],
  tags: [
    { name: "health" },
    { name: "auth" },
    { name: "tools" },
    { name: "reviews" },
    { name: "bookmarks" },
    { name: "stats" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      ErrorResponse: errorResponse,
      PageMeta: pageMeta,
      User: user,
      TokenPair: tokenPair,
      ReviewStats: reviewStats,
      ToolListItem: toolListItem,
      ToolDetail: toolDetail,
      Review: review,
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["health"],
        summary: "Liveness probe",
        responses: { "200": { description: "프로세스 정상" } },
      },
    },
    "/health/ready": {
      get: {
        tags: ["health"],
        summary: "Readiness probe (DB 접근 확인)",
        responses: { "200": { description: "준비됨" }, "503": { description: "DB 불가" } },
      },
    },
    "/api/v1/auth/register": {
      post: {
        tags: ["auth"],
        summary: "회원가입",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "nickname"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8, description: "영문+숫자 포함 8자 이상" },
                  nickname: { type: "string", minLength: 2, maxLength: 30 },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "가입 완료 + 토큰 발급",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                    tokens: { $ref: "#/components/schemas/TokenPair" },
                  },
                },
              },
            },
          },
          "400": err("검증 실패"),
          "409": err("이메일 중복"),
          "429": err("레이트 리밋 초과"),
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["auth"],
        summary: "로그인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "로그인 성공 (user + tokens)" },
          "401": err("자격 증명 불일치 (INVALID_CREDENTIALS)"),
          "429": err("레이트 리밋 초과"),
        },
      },
    },
    "/api/v1/auth/refresh": {
      post: {
        tags: ["auth"],
        summary: "토큰 갱신 (refresh token 회전)",
        description:
          "사용한 refresh token은 즉시 폐기되고 새 토큰 쌍이 발급된다. 폐기된 토큰 재사용 시 모든 세션이 종료된다(REFRESH_REUSE_DETECTED).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: { refreshToken: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "새 토큰 쌍" },
          "401": err("무효/만료/재사용 감지"),
        },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        tags: ["auth"],
        summary: "로그아웃 (refresh token 폐기, 멱등)",
        responses: { "204": { description: "폐기 완료" } },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["auth"],
        summary: "내 정보",
        security: bearerAuth,
        responses: { "200": { description: "사용자 정보" }, "401": err("인증 필요") },
      },
    },
    "/api/v1/tools": {
      get: {
        tags: ["tools"],
        summary: "툴 목록 (페이지네이션/필터/검색/정렬)",
        parameters: [
          ...paginationParams,
          { name: "category", in: "query", schema: toolListItem.properties.category },
          { name: "difficulty", in: "query", schema: toolListItem.properties.difficulty },
          { name: "q", in: "query", schema: { type: "string" }, description: "이름/슬로건/추천대상 검색" },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["rating", "difficulty", "name", "createdAt", "reviews"],
              default: "rating",
            },
          },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" } },
        ],
        responses: {
          "200": {
            description: "툴 목록",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/ToolListItem" } },
                    meta: { $ref: "#/components/schemas/PageMeta" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["tools"],
        summary: "툴 등록 (관리자)",
        security: bearerAuth,
        responses: {
          "201": { description: "생성됨" },
          "401": err("인증 필요"),
          "403": err("관리자 아님"),
          "409": err("slug 중복"),
        },
      },
    },
    "/api/v1/tools/{slug}": {
      get: {
        tags: ["tools"],
        summary: "툴 상세",
        parameters: [slugParam],
        responses: {
          "200": {
            description: "툴 상세",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/ToolDetail" } },
                },
              },
            },
          },
          "404": err("없음"),
        },
      },
      patch: {
        tags: ["tools"],
        summary: "툴 부분 수정 (관리자)",
        security: bearerAuth,
        parameters: [slugParam],
        responses: { "200": { description: "수정됨" }, "404": err("없음") },
      },
      delete: {
        tags: ["tools"],
        summary: "툴 삭제 (관리자)",
        security: bearerAuth,
        parameters: [slugParam],
        responses: { "204": { description: "삭제됨" }, "404": err("없음") },
      },
    },
    "/api/v1/tools/{slug}/reviews": {
      get: {
        tags: ["reviews"],
        summary: "툴 리뷰 목록",
        parameters: [slugParam, ...paginationParams],
        responses: { "200": { description: "리뷰 목록" }, "404": err("툴 없음") },
      },
      post: {
        tags: ["reviews"],
        summary: "리뷰 작성 (툴당 1개)",
        security: bearerAuth,
        parameters: [slugParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating", "content"],
                properties: {
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                  content: { type: "string", minLength: 10, maxLength: 2000 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "작성됨" },
          "401": err("인증 필요"),
          "409": err("이미 리뷰 작성함"),
        },
      },
    },
    "/api/v1/reviews/{id}": {
      patch: {
        tags: ["reviews"],
        summary: "리뷰 수정 (작성자 본인)",
        security: bearerAuth,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "수정됨" }, "403": err("본인 아님") },
      },
      delete: {
        tags: ["reviews"],
        summary: "리뷰 삭제 (본인 또는 관리자)",
        security: bearerAuth,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "204": { description: "삭제됨" }, "403": err("권한 없음") },
      },
    },
    "/api/v1/me/bookmarks": {
      get: {
        tags: ["bookmarks"],
        summary: "내 북마크 목록",
        security: bearerAuth,
        responses: { "200": { description: "북마크된 툴 목록" }, "401": err("인증 필요") },
      },
    },
    "/api/v1/me/bookmarks/{slug}": {
      put: {
        tags: ["bookmarks"],
        summary: "북마크 추가 (멱등)",
        security: bearerAuth,
        parameters: [slugParam],
        responses: { "204": { description: "추가됨(또는 이미 존재)" }, "404": err("툴 없음") },
      },
      delete: {
        tags: ["bookmarks"],
        summary: "북마크 제거 (멱등)",
        security: bearerAuth,
        parameters: [slugParam],
        responses: { "204": { description: "제거됨(또는 원래 없음)" } },
      },
    },
    "/api/v1/tools/{slug}/clicks": {
      post: {
        tags: ["stats"],
        summary: "제휴 링크 클릭 이벤트 기록 (공개, 본문 불필요)",
        parameters: [slugParam],
        responses: { "202": { description: "접수됨" }, "404": err("툴 없음") },
      },
    },
    "/api/v1/stats/clicks": {
      get: {
        tags: ["stats"],
        summary: "클릭 통계 (관리자)",
        security: bearerAuth,
        parameters: [
          { name: "groupBy", in: "query", schema: { type: "string", enum: ["tool", "day"], default: "tool" } },
          { name: "from", in: "query", schema: { type: "string", format: "date" } },
          { name: "to", in: "query", schema: { type: "string", format: "date" } },
        ],
        responses: { "200": { description: "집계 결과" }, "403": err("관리자 아님") },
      },
    },
  },
} as const;
