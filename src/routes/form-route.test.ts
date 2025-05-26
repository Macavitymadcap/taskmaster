import { describe, test, expect, beforeEach, mock } from "bun:test";
import { FormRoute } from "./form-route";
import { TaskRepository } from "../database";
import { Container } from "./container";

describe("FormRoute", () => {
  let mockTaskRepository: Partial<TaskRepository>;
  let container: Container;
  let formRoute: FormRoute;

  beforeEach(() => {
    mockTaskRepository = {
      read: mock((id: number) =>
        id === 1
          ? {
              id: 1,
              title: "Test Task",
              description: "Test Description",
              status: "pending" as const,
              due_date: "2025-12-31",
            }
          : null,
      ),
    };

    container = Container.createTestContainer({
      taskRepository: mockTaskRepository as TaskRepository,
    });

    formRoute = new FormRoute(container);
  });

  test("should create form route with dependencies", () => {
    // Assert
    expect(formRoute).toBeInstanceOf(FormRoute);
    expect(formRoute.getPrefix()).toBe("/form");
  });

  test("should return update form with task data if task exists", async () => {
    // Arrange
    const app = formRoute.getRouter();

    // Act
    const response = await app.request("/update/1");

    // Assert
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Test Task");
    expect(html).not.toContain("Failed to load task with ID 1");
    expect(mockTaskRepository.read).toHaveBeenCalledWith(1);
  });

  test("should return update form with alert if task does not exist", async () => {
    // Arrange
    const app = formRoute.getRouter();

    // Act
    const response = await app.request("/update/999");

    // Assert
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Failed to load task with ID 999");
    expect(mockTaskRepository.read).toHaveBeenCalledWith(999);
  });

  test("should return delete form with task data if task exists", async () => {
    // Arrange
    const app = formRoute.getRouter();

    // Act
    const response = await app.request("/delete/1");

    // Assert
    expect(response.status).toBe(200);
    const html = await response.text();
    // Check for task ID and "Delete Task" button in the form
    expect(html).toContain(
      "Are you sure you want to delete task with ID <strong>1</strong>?",
    );
    expect(html).toContain("Delete Task");
    expect(html).not.toContain("Failed to load task with ID 1");
    expect(mockTaskRepository.read).toHaveBeenCalledWith(1);
  });

  test("should return delete form with alert if task does not exist", async () => {
    // Arrange
    const app = formRoute.getRouter();

    // Act
    const response = await app.request("/delete/999");

    // Assert
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Failed to load task with ID 999");
    expect(mockTaskRepository.read).toHaveBeenCalledWith(999);
  });
});
