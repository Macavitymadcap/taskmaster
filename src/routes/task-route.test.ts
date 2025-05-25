import { describe, test, expect, beforeEach, mock } from "bun:test";
import { TaskRoute } from "./task-route";
import { TaskRepository } from "../database";
import { Container } from "./container";

describe("TaskRoute", () => {
  let mockTaskRepository: Partial<TaskRepository>;
  let container: Container;
  let taskRoute: TaskRoute;

  beforeEach(() => {
    // Create mock repository
    mockTaskRepository = {
      create: mock(() => ({
        id: 1,
        title: "Test Task",
        description: "Test Description",
        status: "pending" as const,
        due_date: "2025-12-31",
      })),
      read: mock((id: number) => ({
        id,
        title: "Test Task",
        description: "Test Description",
        status: "pending" as const,
        due_date: "2025-12-31",
      })),
      readAll: mock(() => []),
      update: mock(() => ({
        id: 1,
        title: "Updated Task",
        description: "Updated Description",
        status: "completed" as const,
        due_date: "2025-12-31",
      })),
      delete: mock(() => true),
    };

    // Create test container with mock dependencies
    container = Container.createTestContainer({
      taskRepository: mockTaskRepository as TaskRepository,
    });

    // Create route with test container
    taskRoute = new TaskRoute(container);
  });

  test("should create task route with dependencies", () => {
    // Assert
    expect(taskRoute).toBeInstanceOf(TaskRoute);
    expect(taskRoute.getPrefix()).toBe("/task");
  });

  test("should call repository create method when creating task", async () => {
    // Arrange
    const app = taskRoute.getRouter();

    const formData = new FormData();
    formData.append("title", "New Task");
    formData.append("description", "New Description");
    formData.append("status", "pending");
    formData.append("due_date", "2025-12-31");

    // Act
    const response = await app.request("/", {
      method: "POST",
      body: formData,
    });

    // Assert
    expect(response.status).toBe(200);
    expect(mockTaskRepository.create).toHaveBeenCalledTimes(1);
  });

  test("should call repository read method when getting task by id", async () => {
    // Arrange
    const app = taskRoute.getRouter();

    // Act
    const response = await app.request("/1");

    // Assert
    expect(response.status).toBe(200);
    expect(mockTaskRepository.read).toHaveBeenCalledWith(1);
  });

  test("should call repository readAll method when getting all tasks", async () => {
    // Arrange
    const app = taskRoute.getRouter();

    // Act
    const response = await app.request("/");

    // Assert
    expect(response.status).toBe(200);
    expect(mockTaskRepository.readAll).toHaveBeenCalledTimes(1);
  });

  test("should call repository delete method when deleting task", async () => {
    // Arrange
    const app = taskRoute.getRouter();

    // Act
    const response = await app.request("/1", {
      method: "DELETE",
    });

    // Assert
    expect(response.status).toBe(200);
    expect(mockTaskRepository.delete).toHaveBeenCalledWith(1);
  });
});
