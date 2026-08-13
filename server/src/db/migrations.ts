/**
 * 스키마 마이그레이션 정의.
 *
 * 규칙:
 * - 이미 적용(커밋)된 마이그레이션은 절대 수정하지 않는다. 변경은 항상 "새 마이그레이션 추가"로.
 * - id는 1부터 단조 증가. 적용 이력은 schema_migrations 테이블에 기록된다.
 * - 시간은 UTC ISO-8601 TEXT로 저장한다 (SQLite에는 날짜 타입이 없다).
 */
export interface Migration {
  id: number;
  name: string;
  up: string;
}

export const MIGRATIONS: Migration[] = [
  {
    id: 1,
    name: "create-users-and-refresh-tokens",
    up: `
      CREATE TABLE users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        email         TEXT    NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT    NOT NULL,
        nickname      TEXT    NOT NULL,
        role          TEXT    NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );

      -- refresh token은 원문이 아닌 sha256 해시로 저장한다.
      -- DB가 유출되어도 토큰 원문을 재사용할 수 없게 하기 위함이다.
      CREATE TABLE refresh_tokens (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT    NOT NULL UNIQUE,
        expires_at TEXT    NOT NULL,
        revoked_at TEXT,
        created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
    `,
  },
  {
    id: 2,
    name: "create-tools",
    up: `
      CREATE TABLE tools (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        slug             TEXT    NOT NULL UNIQUE,
        name             TEXT    NOT NULL,
        category         TEXT    NOT NULL CHECK (category IN (
                           'Workflow Automation', 'No-Code Automation',
                           'AI Agents', 'Developer Automation'
                         )),
        badge            TEXT,
        slogan           TEXT    NOT NULL,
        price_info       TEXT    NOT NULL,
        pricing_details  TEXT    NOT NULL, -- JSON: { free, starter, pro, pricingModel }
        difficulty       TEXT    NOT NULL CHECK (difficulty IN ('쉬움', '보통', '어려움')),
        difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
        editorial_rating REAL    NOT NULL CHECK (editorial_rating BETWEEN 0 AND 5),
        features         TEXT    NOT NULL, -- JSON string[]
        pros             TEXT    NOT NULL, -- JSON string[]
        cons             TEXT    NOT NULL, -- JSON string[]
        best_for         TEXT    NOT NULL,
        ai_integration   TEXT    NOT NULL,
        affiliate_url    TEXT    NOT NULL,
        alternatives     TEXT    NOT NULL, -- JSON string[] (slug 목록)
        logo_color       TEXT,
        logo_text_color  TEXT,
        created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX idx_tools_category ON tools(category);
    `,
  },
  {
    id: 3,
    name: "create-reviews-and-bookmarks",
    up: `
      CREATE TABLE reviews (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        tool_id    INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        content    TEXT    NOT NULL CHECK (length(content) BETWEEN 10 AND 2000),
        created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        UNIQUE (tool_id, user_id) -- 한 사용자당 툴 하나에 리뷰 1개
      );
      CREATE INDEX idx_reviews_tool_id ON reviews(tool_id);

      CREATE TABLE bookmarks (
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tool_id    INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
        created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        PRIMARY KEY (user_id, tool_id)
      ) WITHOUT ROWID;
    `,
  },
  {
    id: 4,
    name: "create-click-events",
    up: `
      -- 제휴 링크 클릭 이벤트 (append-only 이벤트 로그).
      -- 수익 분석의 원천 데이터이므로 UPDATE/DELETE 없이 쌓기만 한다.
      CREATE TABLE click_events (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        tool_id    INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
        user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
        referrer   TEXT,
        user_agent TEXT,
        created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
      );
      CREATE INDEX idx_click_events_tool_created ON click_events(tool_id, created_at);
      CREATE INDEX idx_click_events_created ON click_events(created_at);
    `,
  },
];
