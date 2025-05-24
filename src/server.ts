import { type Context, Hono } from "hono";
import { serveStatic } from "hono/bun";
import { data } from "./routes/data";

const app = new Hono();

app.use("/*", serveStatic({ root: "public" }));

app.route("/data", data);

export default app;
