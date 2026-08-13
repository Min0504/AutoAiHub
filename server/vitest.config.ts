import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    // 각 테스트 파일은 독립된 in-memory DB를 쓰므로 병렬 실행해도 안전하다.
  },
});
