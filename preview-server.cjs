const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const root = path.join(__dirname, "public");
const secrets = Object.fromEntries(
  fs.readFileSync(path.join(__dirname, ".dev.vars"), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const splitAt = line.indexOf("=");
      return [line.slice(0, splitAt), line.slice(splitAt + 1)];
    })
);

http.createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (url.pathname === "/api/map-config") {
    response.writeHead(secrets.CARTO_API_KEY ? 200 : 503, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(JSON.stringify(secrets.CARTO_API_KEY ? { cartoKey: secrets.CARTO_API_KEY } : { error: "CARTO key not set" }));
    return;
  }
  if (url.pathname === "/data/seoul-admdong.geojson") {
    response.writeHead(200, { "Content-Type": "application/geo+json; charset=utf-8" });
    fs.createReadStream(path.join(root, "data", "seoul-admdong.geojson")).pipe(response);
    return;
  }
  if (url.pathname !== "/" && url.pathname !== "/index.html") {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  fs.createReadStream(path.join(root, "index.html")).pipe(response);
}).listen(4173, "127.0.0.1", () => console.log("Preview: http://localhost:4173"));

