import {
  describe,
  test,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from "bun:test";
import { TaskEntity, TaskRepository, TaskStatus } from "./task-repository";
import { DB_CONFIG } from "../config";
import { DbContext } from "../context";

const sampleTask = (
  overrides: Partial<Omit<TaskEntity, "id">> = {},
): Omit<TaskEntity, "id"> => ({
  title: "Test Task",
  description: "A test task",
  status: "in-progress",
  due_date: "2025-12-31",
  ...overrides,
});

describe("TaskRepository", () => {
  let taskRepository: TaskRepository;

  beforeAll(() => {
    (DbContext as any).instance = undefined; // Reset singleton instance before tests
    taskRepository = new TaskRepository(DB_CONFIG.inMemoryPath);
  });

  afterAll(() => {
    try {
      taskRepository.close();
    } catch (error) {
      // Ignore errors during cleanup
    }
    (DbContext as any).instance = undefined; // Reset singleton instance after tests
  });

  beforeEach(() => {
    // Clean up any existing tasks before each test
    const allTasks = taskRepository.readAll();
    allTasks.forEach((task) => taskRepository.delete(task.id));
  });

  test("should create the tasks table on init", () => {
    // Table creation is implicit; just ensure no error on instantiation
    expect(taskRepository).toBeInstanceOf(TaskRepository);
  });

  describe("create", () => {
    test("should create a new task and return the created entity with id", () => {
      // Arrange
      const taskData = sampleTask();

      // Act
      const result = taskRepository.create(taskData);

      // Assert
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.id).toBeTypeOf("number");
      expect(result!.id).toBeGreaterThan(0);
      expect(result!.title).toBe(taskData.title);
      expect(result!.description).toBe(taskData.description!);
      expect(result!.status).toBe(taskData.status);
      expect(result!.due_date).toBe(taskData.due_date);
    });

    test("should create a task without description", () => {
      // Arrange
      const taskData = sampleTask({ description: undefined });

      // Act
      const result = taskRepository.create(taskData);

      // Assert
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.id).toBeGreaterThan(0);
      expect(result!.description).toBeNull();
    });
  });

  describe("read", () => {
    test("should read an existing task by id", () => {
      // Arrange
      const taskData = sampleTask();
      const createdTask = taskRepository.create(taskData);
      expect(createdTask).not.toBeNull();

      // Act
      const result = taskRepository.read(createdTask!.id);

      // Assert
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.id).toBe(createdTask!.id);
      expect(result!.title).toBe(taskData.title);
    });

    test("should return null for non-existent task", () => {
      // Act
      const result = taskRepository.read(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("readAll", () => {
    test("should return all tasks", () => {
      // Arrange
      const task1 = taskRepository.create(sampleTask({ title: "Task 1" }));
      const task2 = taskRepository.create(sampleTask({ title: "Task 2" }));

      // Act
      const result = taskRepository.readAll();

      // Assert
      expect(result).toBeArrayOfSize(2);
      expect(result.map((t) => t.title)).toContain("Task 1");
      expect(result.map((t) => t.title)).toContain("Task 2");
    });

    test("should return empty array when no tasks exist", () => {
      // Act
      const result = taskRepository.readAll();

      // Assert
      expect(result).toBeArrayOfSize(0);
    });
  });
  
  describe("update", () => {
    test("should update an existing task and return the updated entity", () => {
      // Arrange
      const originalTask = taskRepository.create(sampleTask());
      expect(originalTask).not.toBeNull();

      const updatedData: TaskEntity = {
        ...originalTask!,
        title: "Updated Task",
        status: "completed" as TaskStatus,
        description: "Updated description",
      };

      // Act
      const result = taskRepository.update(updatedData);

      // Assert
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.id).toBe(originalTask!.id);
      expect(result!.title).toBe("Updated Task");
      expect(result!.status).toBe("completed");
      expect(result!.description).toBe("Updated description");
    });

    test("should return null when trying to update non-existent task", () => {
      // Arrange
      const nonExistentTask: TaskEntity = {
        id: 999,
        title: "Non-existent",
        status: "in-progress",
        due_date: "2025-12-31",
      };

      // Act
      const result = taskRepository.update(nonExistentTask);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    test("should delete an existing task and return true", () => {
      // Arrange
      const task = taskRepository.create(sampleTask());
      expect(task).not.toBeNull();

      // Act
      const result = taskRepository.delete(task!.id);

      // Assert
      expect(result).toBe(true);

      // Verify task is actually deleted
      const deletedTask = taskRepository.read(task!.id);
      expect(deletedTask).toBeNull();
    });

    test("should return false when trying to delete non-existent task", () => {
      // Act
      const result = taskRepository.delete(999);

      // Assert
      expect(result).toBe(false);
    });
  });
});
