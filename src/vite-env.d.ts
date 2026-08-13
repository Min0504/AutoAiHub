/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 백엔드 API 오리진 (예: http://localhost:4000).
   * 미설정 시 사이트는 순수 정적으로 동작한다 — 프로덕션(Vercel) 기본 상태.
   */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
