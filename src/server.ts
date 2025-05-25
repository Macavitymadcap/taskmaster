import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { htmx } from "./routes/htmx";

const app = new Hono();

app.use("/*", serveStatic({ root: "public" }));

app.route("/htmx", htmx);

export default app;
