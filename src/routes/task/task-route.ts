import { Context } from "hono";
import { TaskRepository, TaskStatus } from "../../database";
import {
  Alert,
  type AlertProps,
  CreateTaskResponse,
  GetTaskByIDResponse, 
  ReadTask,
  UpdateTaskResponse 
} from "../../components";
import { Container } from "../container/container";
import { BaseRoute } from "../base-route";
import { CreateTaskValidator, UpdateTaskValidator } from "../../validation";

export class TaskRoute extends BaseRoute {
  private taskRepository: TaskRepository;

  constructor(container: Container = Container.getInstance()) {
    super({ prefix: "/task" });
    this.taskRepository = container.get<TaskRepository>("taskRepository");
  }

  protected initializeRoutes(): void {
    this.app.post("/", this.createTask.bind(this));
    this.app.get("/:id", this.getTaskById.bind(this));
    this.app.get("/", this.getAllTasks.bind(this));
    this.app.post("/search", this.searchTasks.bind(this));
    this.app.put("/:id", this.updateTask.bind(this));
    this.app.delete("/:id", this.deleteTask.bind(this));
  }

  private async createTask(context: Context): Promise<Response> {
    console.log("Creating task...");
    let alert: AlertProps | undefined;
    const { title, description, status, due_date } =
      await this.getFormData(context);

    const validity = new CreateTaskValidator(
      title,
      description || undefined,
      due_date,
      status as TaskStatus,
    );

    if (!validity.isValid) {
      alert = {
        alertType: "danger",
        title: "Validation Error",
        message: validity.errors.map((e) => e.message).join(", "),
      };
    }

    const task = this.taskRepository.create({
      title,
      description,
      status: status as TaskStatus,
      due_date,
    });

    alert = task
      ? {
          alertType: "success",
          title: "Task Created",
          message: `Task "${task.title}" created successfully!`,
        }
      : {
          alertType: "danger",
          title: "Error",
          message: "Failed to create task",
        };

    return context.html(
      CreateTaskResponse({ alert, task: task ?? undefined }),
    );
  }

  private async searchTasks(context: Context): Promise<Response> {
    console.log("Searching for task by ID...");
    const formData = await context.req.formData();
    const id = parseInt(formData.get("id") as string, 10);
    
    let alert: AlertProps | undefined;
    
    if (isNaN(id)) {
      alert = {
        alertType: "danger",
        title: "Validation Error",
        message: `Invalid ID ${id} provided for search.`,
      };
    }

    const task = this.taskRepository.read(id);

    if (!task) {
      alert = {
        alertType: "danger",
        title: "Not Found",
        message: `No task found with ID ${id}.`,
      };
    }

    return context.html(
      GetTaskByIDResponse({ alert, task: task ?? undefined }),
      {
        headers: alert ? { "HX-Trigger": "taskSearchFailed" } : {},
      }
    );
  }

  private async getTaskById(context: Context): Promise<Response> {
    console.log("Fetching task by ID...");
    let alert: AlertProps | undefined;
    const id = parseInt(context.req.param("id"), 10);
    console.log("Task ID:", id);

    const task = this.taskRepository.read(id);

    if (!task) {
      alert = {
        alertType: "danger",
        title: "Error",
        message: `No task found with ID ${id}`,
      };
    }

    return context.html(GetTaskByIDResponse({ alert, task: task ?? undefined }));
  }

  private async getAllTasks(context: Context): Promise<Response> {
    console.log("Fetching all tasks...");
    const tasks = this.taskRepository.readAll();

    return context.html(`${tasks.map((task) => ReadTask(task)).join("")}`);
  }

  private async updateTask(context: Context): Promise<Response> {
    console.log("Updating task...");
    let alert: AlertProps | undefined;
    const id = parseInt(context.req.param("id"), 10);
    const { title, description, status, due_date } =
      await this.getFormData(context);

    const validity = new UpdateTaskValidator(
      title,
      description || undefined,
      due_date,
      status as TaskStatus,
    );

    if (!validity.isValid) {
      alert = {
        alertType: "danger",
        title: "Validation Error",
        message: validity.errors.map((e) => e.message).join(", "),
      };
    }

    const task = this.taskRepository.update({
      id,
      title,
      description,
      status: status as TaskStatus,
      due_date,
    });

    alert = task
      ? {
          alertType: "success",
          title: "Task Updated",
          message: `Task "${task.title}" updated successfully!`,
        }
      : {
          alertType: "danger",
          title: "Error",
          message: "Failed to update task with ID " + id,
        };

    return context.html(
      UpdateTaskResponse({ alert: alert, task: task ?? undefined }),
    );
  }

  private async deleteTask(context: Context): Promise<Response> {
    console.log("Deleting task...");
    const id = parseInt(context.req.param("id"), 10);
    const hasBeenDeleted = this.taskRepository.delete(id);

    const alert: AlertProps = hasBeenDeleted
      ? {
          alertType: "success",
          title: "Task Deleted",
          message: `Task with ID ${id} has been deleted successfully.`,
        }
      : {
          alertType: "danger",
          title: "Error",
          message: `Failed to delete task with ID ${id}`,
        };

    return context.html(Alert(alert), {
      headers: { "HX-Trigger": "taskDeleted" },
    });
  }

  private async getFormData(context: Context) {
    const formData = await context.req.formData();
    return {
      title: (formData.get("title") as string) || "",
      description: (formData.get("description") as string) || "",
      status: (formData.get("status") as string) || "",
      due_date: (formData.get("dueDate") as string) || "",
    };
  }
}
