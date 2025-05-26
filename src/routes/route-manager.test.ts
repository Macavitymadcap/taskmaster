import { describe, test, expect, mock } from "bun:test";
import { RouteManager } from "./route-manager";
import { Container } from "./container";

describe("RouteManager", () => {
  test("should instantiate with default container and mount routes", () => {
    // Arrange
    const container = Container.createTestContainer({});

    // Act
    const manager = new RouteManager(container);
    const app = manager.getApp();

    // Assert
    expect(manager).toBeInstanceOf(RouteManager);
    expect(app).toBeDefined();
    // Should have .route method (Hono instance)
    expect(typeof app.route).toBe("function");
  });

  test("getApp should return the Hono app instance", () => {
    // Arrange
    const manager = new RouteManager();

    // Act
    const app = manager.getApp();

    // Assert
    expect(app).toBeDefined();
    expect(typeof app.route).toBe("function");
  });
});
