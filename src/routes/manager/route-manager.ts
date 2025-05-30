import { Hono } from "hono";
import { BaseRoute } from "../base-route";
import { TaskRoute } from "../task";
import { FormRoute } from "../form";
import { Container } from "../container";

export class RouteManager {
  private app: Hono;
  private routes: BaseRoute[] = [];
  private container: Container;

  constructor(container: Container = Container.getInstance()) {
    this.app = new Hono();
    this.container = container;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Register all routes
    this.routes = [
      new TaskRoute(this.container),
      new FormRoute(this.container),
    ];

    // Mount routes on app
    this.routes.forEach((route) => {
      this.app.route(route.getPrefix(), route.getRouter());
    });
  }

  public getApp(): Hono {
    return this.app;
  }
}
