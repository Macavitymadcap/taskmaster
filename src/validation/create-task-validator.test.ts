import { beforeEach, describe, expect, jest, test } from "bun:test";
import {
  CreateTaskRequest,
  CreateTaskValidator,
} from "./create-task-validator";
import { TaskStatus } from "./model";

describe("CreateTaskValidator", () => {
  beforeEach(() => {
    jest.setSystemTime(new Date("2023-01-01T00:00"));
  });

  describe("title", () => {
    test("should have an empty errors array given valid title", () => {
      // Arrange
      const testCase: CreateTaskRequest = {
        title: "Test Task",
        description: undefined,
        dueDate: "2025-12-31T00:00",
        status: "overdue",
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([]);
    });

    test("should push an error to the errors array given an empty title", () => {
      // Arrange
      const testCase: CreateTaskRequest = {
        title: "",
        description: undefined,
        dueDate: "2025-12-31T00:00",
        status: "overdue",
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([
        {
          field: "title",
          message: "Title is required",
        },
      ]);
    });

    test("should push an error to the errors array given a long title", () => {
      // Arrange
      const testCase: CreateTaskRequest = {
        title: "a".repeat(256),
        description: undefined,
        dueDate: "2025-12-31T00:00",
        status: "overdue",
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([
        {
          field: "title",
          message: "Title must be less than 255 characters",
        },
      ]);
    });

    test("should push an error to the errors array given a short title", () => {
      // Arrange
      const testCase: CreateTaskRequest = {
        title: "ab",
        description: undefined,
        dueDate: "2025-12-31T00:00",
        status: "overdue",
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([
        {
          field: "title",
          message: "Title must be at least 3 characters",
        },
      ]);
    });
  });

  describe("description", () => {
    test("should have an empty errors array given valid description", () => {
      // Arrange
      const testCase: CreateTaskRequest = {
        title: "Test Task",
        description: "Short description",
        dueDate: "2025-12-31T00:00",
        status: "overdue",
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([]);
    });

    test("should push an error to the errors array given a long description", () => {
      // Arrange
      const testCase: CreateTaskRequest = {
        title: "Test Task",
        description: "a".repeat(1001),
        dueDate: "2025-12-31T00:00",
        status: "overdue",
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([
        {
          field: "description",
          message: "Description must be less than 1000 characters",
        },
      ]);
    });
  });

  describe("dueDate", () => {
    test("should push an error to the errors array given an a string of the wrong format", () => {
      // Arrange
      const testCase: CreateTaskRequest = {
        title: "Test Task",
        description: undefined,
        dueDate: "invalid-date",
        status: "overdue",
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([
        {
          field: "dueDate",
          message: "Invalid date format",
        },
      ]);
    });

    test("should push an error to the errors array given a past due date", () => {
      // Arrange
      jest.setSystemTime(new Date("2023-01-01T00:00"));

      const testCase: CreateTaskRequest = {
        title: "Test Task",
        description: undefined,
        dueDate: "2020-12-31T00:00",
        status: "overdue",
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([
        {
          field: "dueDate",
          message: "Due date cannot be in the past",
        },
      ]);
    });

    test("should not have errors for valid due date", () => {
      // Arrange
      jest.setSystemTime(new Date("2023-01-01T00:00"));

      const testCase: CreateTaskRequest = {
        title: "Valid Task",
        description: "Short description",
        dueDate: "2025-12-31T00:00",
        status: "completed" as TaskStatus,
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([]);
    });
  });

  describe("status", () => {
    test("should push an error to the errors array given an invalid status", () => {
      // Arrange
      const testCase: CreateTaskRequest = {
        title: "Test Task",
        description: undefined,
        dueDate: "2025-12-31T00:00",
        status: "invalid-status" as TaskStatus,
      };

      // Act
      const result = new CreateTaskValidator(
        testCase.title,
        testCase.description,
        testCase.dueDate,
        testCase.status,
      );

      // Assert
      expect(result.errors).toEqual([
        {
          field: "status",
          message: "Invalid task status",
        },
      ]);
    });
  });

  test("should validate all fields together", () => {
    // Arrange
    const testCase: CreateTaskRequest = {
      title: "",
      description: "a".repeat(1001),
      dueDate: "invalid-date",
      status: "invalid-status" as TaskStatus,
    };

    // Act
    const result = new CreateTaskValidator(
      testCase.title,
      testCase.description,
      testCase.dueDate,
      testCase.status,
    );

    // Assert
    expect(result.errors).toEqual([
      { field: "title", message: "Title is required" },
      {
        field: "description",
        message: "Description must be less than 1000 characters",
      },
      { field: "dueDate", message: "Invalid date format" },
      { field: "status", message: "Invalid task status" },
    ]);
  });

  test("should not have errors for valid task", () => {
    // Arrange
    jest.setSystemTime(new Date("2023-01-01T00:00"));

    const testCase: CreateTaskRequest = {
      title: "Valid Task",
      description: "Short description",
      dueDate: "2025-12-31T00:00",
      status: "overdue" as TaskStatus,
    };

    // Act
    const result = new CreateTaskValidator(
      testCase.title,
      testCase.description,
      testCase.dueDate,
      testCase.status,
    );

    // Assert
    expect(result.errors).toEqual([]);
  });
});
