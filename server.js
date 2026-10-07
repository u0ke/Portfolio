const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = path.join(
        __dirname,
        req.url === "/" ? "index.html" : req.url
    );

    const ext = path.extname(filePath);

    const mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".webp": "image/webp"
    };

    const contentType = mimeTypes[ext] || "text/plain";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 - File not found");
            return;
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`Portfolio running at http://localhost:${PORT}`);
});