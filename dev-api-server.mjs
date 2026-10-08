import http from "node:http";
import handler from "./api/chat.js";

const server = http.createServer(async (req, res) => {
  if (req.url !== "/api/chat") { res.statusCode = 404; return res.end("Not found"); }
  let raw = "";
  for await (const chunk of req) raw += chunk;
  req.body = raw ? JSON.parse(raw) : {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (value) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(value)); };
  await handler(req, res);
});
server.listen(3001, () => console.log("Local API ready at http://localhost:3001/api/chat"));
