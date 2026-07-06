const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

const allowedDeepLEndpoints = new Set([
  "https://api-free.deepl.com/v2/translate",
  "https://api.deepl.com/v2/translate",
]);

const allowedDeepLTargets = new Set(["ZH-HANS", "ZH-HANT", "EN-US"]);

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS" && requestUrl.pathname === "/api/deepl") {
    sendCorsPreflight(res);
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/api/deepl") {
    await handleDeepLProxy(req, res);
    return;
  }

  const pathname = decodeURIComponent(requestUrl.pathname);
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(root, safePath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
});

async function handleDeepLProxy(req, res) {
  try {
    const payload = JSON.parse(await readRequestBody(req, 128 * 1024));
    const texts = Array.isArray(payload.texts) ? payload.texts.map(String) : [];
    const authKey = String(payload.authKey || "");
    const endpoint = String(payload.endpoint || "");
    const targetLang = String(payload.targetLang || "ZH-HANS");

    if (!texts.length || !authKey || !allowedDeepLEndpoints.has(endpoint) || !allowedDeepLTargets.has(targetLang)) {
      sendText(res, 400, "Invalid DeepL request");
      return;
    }

    if (typeof fetch !== "function") {
      sendText(res, 500, "Current Node.js version does not support fetch. Please use Node.js 18 or newer.");
      return;
    }

    const body = new URLSearchParams();
    for (const text of texts) body.append("text", text);
    body.set("target_lang", targetLang);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${authKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const responseText = await response.text();
    if (!response.ok) {
      sendText(res, response.status, responseText || response.statusText);
      return;
    }

    const data = JSON.parse(responseText);
    const translations = Array.isArray(data.translations)
      ? data.translations.map((item) => item.text || "")
      : [];

    sendJson(res, 200, { translations });
  } catch (error) {
    sendText(res, 500, error.message || "DeepL proxy failed");
  }
}

function readRequestBody(req, limit) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > limit) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function sendText(res, status, text) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(text);
}

function sendCorsPreflight(res) {
  res.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  });
  res.end();
}

server.listen(port, "127.0.0.1", () => {
  console.log(`CraftEngine asset generator: http://127.0.0.1:${port}`);
});
