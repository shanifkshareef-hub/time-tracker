import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import api from "./v1";
import config from "./utils/config";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

const app = new Hono();

const port = config.port;
console.log(`Server is running on port ${port}`);
app.use("/*", cors());
app.use("/*", logger());

serve({
  fetch: app.fetch,
  port,
});

/**
 * API Routes v1
 */
app.route("/v1", api);

app.notFound((c) => {
  return c.json(
    {
      status: false,
      message: "route not found",
    },
    404
  );
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const error = err.getResponse() as any;

    return c.json(
      {
        status: false,
        message: err.message,
      },
      error.status
    );
  } else {
    return c.json(
      {
        status: false,
        message: err.message,
      },
      500
    );
  }
});

if (config.nodeEnv === "development") {
  showRoutes(app, {
    colorize: true,
  });
}
export default app;
