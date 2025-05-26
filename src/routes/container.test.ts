import { describe, test, afterEach } from "bun:test";
import { expect, jest } from "bun:test";

import { Container } from "./container";
import { TaskRepository } from "../database";

describe("Container", () => {
  afterEach(() => {
    // Reset singleton for isolation
    Container.getInstance().reset();
  });

  test("should return the same singleton instance", () => {
    // Act
    const instance1 = Container.getInstance();
    const instance2 = Container.getInstance();

    // Assert
    expect(instance1).toBe(instance2);
  });

  test("should register and retrieve taskRepository dependency", () => {
    // Arrange
    const container = Container.getInstance();

    // Act
    const deps = container.getDependencies();

    // Assert
    expect(deps.taskRepository).toBeInstanceOf(TaskRepository);
  });

  test("should throw if dependency does not exist", () => {
    // Arrange
    const container = Container.getInstance();

    // Act & Assert
    expect(() => container.get("nonExistent")).toThrow(
      "Dependency 'nonExistent' not found",
    );
  });

  test("should allow setting and getting a dependency", () => {
    const container = Container.getInstance();
    const mockRepo = { foo: "bar" };
    container.set("taskRepository", mockRepo);
    expect(container.get("taskRepository")).toBe(mockRepo as any);
  });

  test("should reset dependencies to original", () => {
    // Arrange
    const container = Container.getInstance();
    const original = container.get("taskRepository");
    const mockRepo = { foo: "bar" };

    // Act
    container.set("taskRepository", mockRepo);

    // Assert
    expect(container.get("taskRepository")).toBe(mockRepo as any);
    container.reset();
    expect(container.get("taskRepository")).toBeInstanceOf(TaskRepository);
    expect(container.get("taskRepository")).not.toBe(mockRepo);
    expect(container.get("taskRepository") as any).toEqual(original);
  });

  test("should create a test container with mock dependencies", () => {
    // Arrange
    const mockRepo = {
      initDb: jest.fn(),
      createTable: jest.fn(),
      create: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      close: jest.fn(),
      test: true,
    } as unknown as TaskRepository;

    // Act
    const testContainer = Container.createTestContainer({
      taskRepository: mockRepo,
    });

    // Assert
    expect(testContainer.get<TaskRepository>("taskRepository")).toBe(mockRepo);
    // Should not affect singleton
    expect(Container.getInstance().get("taskRepository")).not.toBe(mockRepo);
  });
});
