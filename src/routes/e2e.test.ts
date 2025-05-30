import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { TaskRoute } from "./task";
import { FormRoute } from "./form";
import { Container } from "./container";
import { TaskRepository, DB_CONFIG, DbContext } from "../database";

describe("Route Integration Tests", () => {
  let container: Container;
  let taskRoute: TaskRoute;
  let formRoute: FormRoute;
  let taskRepository: TaskRepository;

  beforeAll(() => {
    // Reset DbContext singleton
    (DbContext as any).instance = undefined;

    // Create container with test database
    container = Container.getInstance();
    container.set("taskRepository", new TaskRepository(DB_CONFIG.inMemoryPath));

    taskRepository = container.get<TaskRepository>("taskRepository");
    taskRoute = new TaskRoute(container);
    formRoute = new FormRoute(container);
  });

  afterAll(() => {
    // Clean up
    taskRepository.close();
    (DbContext as any).instance = undefined;
  });

  beforeEach(() => {
    // Clean up tasks
    const tasks = taskRepository.readAll();
    tasks.forEach((task) => taskRepository.delete(task.id));
  });

  test("should create and retrieve task through routes", async () => {
    const taskApp = taskRoute.getRouter();

    // Create task
    const formData = new FormData();
    formData.append("title", "Integration Test Task");
    formData.append("description", "Testing integration");
    formData.append("status", "overdue");
    formData.append("dueDate", "2025-12-31");

    const createResponse = await taskApp.request("/", {
      method: "POST",
      body: formData,
    });

    expect(createResponse.status).toBe(200);

    // Verify task was created
    const tasks = taskRepository.readAll();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Integration Test Task");

    // Get task through route
    const getResponse = await taskApp.request(`/${tasks[0].id}`);
    expect(getResponse.status).toBe(200);

    const html = await getResponse.text();
    expect(html).toContain("Integration Test Task");
  });

  test("should get update form through form route", async () => {
    // Create a task first
    const task = taskRepository.create({
      title: "Task to Update",
      description: "Will be updated",
      status: "overdue",
      due_date: "2025-12-31",
    });

    const formApp = formRoute.getRouter();
    const response = await formApp.request(`/update/${task!.id}`);

    expect(response.status).toBe(200);

    const html = await response.text();
    expect(html).toContain("Task to Update");
    expect(html).toContain("Update Task");
  });
});
