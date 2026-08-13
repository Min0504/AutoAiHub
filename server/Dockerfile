# ── 1) build stage: 소스 컴파일 ─────────────────────────────────────────────
# 멀티 스테이지 빌드: 빌드 도구(tsc, devDependencies)를 최종 이미지에서 제거해
# 이미지 크기와 공격 표면(attack surface)을 줄인다.
FROM node:26-alpine AS build
WORKDIR /app

# 의존성 레이어를 소스와 분리 — 소스만 바뀌면 npm ci 레이어는 캐시에서 재사용된다.
COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

# ── 2) runtime stage: 실행에 필요한 것만 ────────────────────────────────────
FROM node:26-alpine
ENV NODE_ENV=production
WORKDIR /app

# 컨테이너를 root로 돌리지 않는다 (컨테이너 탈출 시 피해 최소화)
RUN addgroup -S app && adduser -S app -G app \
  && mkdir -p /app/data && chown -R app:app /app

COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/dist ./dist
COPY --chown=app:app package.json ./

USER app
EXPOSE 4000

# 오케스트레이터(compose/k8s)가 컨테이너 상태를 판단할 수 있게 헬스체크를 선언한다.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/health || exit 1

CMD ["node", "dist/index.js"]
