import { Hono, Context } from "hono";
import { TaskRepository, TaskStatus } from "../database";
import {
  type AlertProps,
  Alert,
  CreateTaskResponse,
  ReadTask,
} from "../components";
import { GetTaskByIDResponse } from "../components/GetTaskByIDResponse";
import { UpdateTaskResponse } from "../components/UpdateTaskResponse";
import { Container } from "./container";
import { BaseRoute } from "./base-route";

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
    this.app.put("/:id", this.updateTask.bind(this));
    this.app.delete("/:id", this.deleteTask.bind(this));
  }

  private async createTask(context: Context): Promise<Response> {
    const { title, description, status, due_date } =
      await this.getFormData(context);

    const task = this.taskRepository.create({
      title,
      description,
      status: status as TaskStatus,
      due_date,
    });

    const alert: AlertProps = task
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
      CreateTaskResponse({ alert: alert, task: task ? task : undefined }),
    );
  }

  private async getTaskById(context: Context): Promise<Response> {
    const id = parseInt(context.req.param("id"), 10);
    const task = this.taskRepository.read(id);

    const alert: AlertProps = {
      alertType: "danger",
      title: "Error",
      message: `Failed to load task with ID ${id}`,
    };

    return context.html(
      GetTaskByIDResponse({
        alert: task ? undefined : alert,
        task: task ? task : undefined,
      }),
    );
  }

  private async getAllTasks(context: Context): Promise<Response> {
    const tasks = this.taskRepository.readAll();

    return context.html(`${tasks.map((task) => ReadTask(task)).join("")}`);
  }

  private async updateTask(context: Context): Promise<Response> {
    const id = parseInt(context.req.param("id"), 10);
    const { title, description, status, due_date } =
      await this.getFormData(context);

    const task = this.taskRepository.update({
      id,
      title,
      description,
      status: status as TaskStatus,
      due_date,
    });

    const alert: AlertProps = task
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
      UpdateTaskResponse({ alert: alert, task: task ? task : undefined }),
    );
  }

  private async deleteTask(context: Context): Promise<Response> {
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
      due_date: (formData.get("due_date") as string) || "",
    };
  }
}
