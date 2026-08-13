import { Router } from "express";
import { openApiDocument } from "./openapi.js";

/**
 * Swagger UI를 CDN(unpkg)에서 로드하는 정적 HTML.
 * 전역 helmet CSP는 'self'만 허용하므로 이 라우트에서만 CDN을 허용하는 CSP로 덮어쓴다.
 */
const DOCS_CSP = [
  "default-src 'self'",
  "script-src 'self' https://unpkg.com 'unsafe-inline'",
  "style-src 'self' https://unpkg.com 'unsafe-inline'",
  "img-src 'self' data: https://unpkg.com",
  "connect-src 'self'",
].join("; ");

const SWAGGER_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AutoHub AI API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: "/api/docs/openapi.json",
      dom_id: "#swagger-ui",
      deepLinking: true,
      persistAuthorization: true,
    });
  </script>
</body>
</html>`;

export function createDocsRouter(): Router {
  const router = Router();

  router.get("/openapi.json", (_req, res) => {
    res.json(openApiDocument);
  });

  router.get("/", (_req, res) => {
    res.setHeader("Content-Security-Policy", DOCS_CSP);
    res.type("html").send(SWAGGER_HTML);
  });

  return router;
}
