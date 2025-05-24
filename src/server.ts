import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { html } from "./routes/html";

const app = new Hono();

app.use("/*", serveStatic({ root: "public" }));

app.route("/html", html);

export default app;
