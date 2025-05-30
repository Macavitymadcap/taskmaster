import { Context } from "hono";
import { TaskRepository } from "../../database";
import { type AlertProps } from "../../components";
import { 
  GetUpdateTaskFormResponse, 
  GetDeleteTaskFormResponse,
  GetCreateTaskFormResponse,
  GetSearchTasksFormResponse,

} from "../../components";
import { Container } from "../container/container";
import { BaseRoute } from "../base-route";

export class FormRoute extends BaseRoute {
  private taskRepository: TaskRepository;

  constructor(container: Container = Container.getInstance()) {
    super({ prefix: "/form" });
    this.taskRepository = container.get<TaskRepository>("taskRepository");
  }

  protected initializeRoutes(): void {
    this.app.get("/create", this.getCreateTaskForm.bind(this));
    this.app.get("/search", this.getSearchTasksForm.bind(this));
    this.app.get("/update/:id", this.getUpdateTaskForm.bind(this));
    this.app.get("/delete/:id", this.getDeleteTaskForm.bind(this));
  }

  private getCreateTaskForm(context: Context): Response {

    return context.html(
      GetCreateTaskFormResponse(),
    );
  }

  private getSearchTasksForm(context: Context): Response {

    return context.html(
      GetSearchTasksFormResponse(),
    );
  }

  private getUpdateTaskForm(context: Context): Response {
    const id = parseInt(context.req.param("id"), 10);
    const task = this.taskRepository.read(id);

    const alert: AlertProps = {
      alertType: "danger",
      title: "Error",
      message: `Failed to load task with ID ${id}`,
    };

    return context.html(
      GetUpdateTaskFormResponse({
        alert: task ? undefined : alert,
        form: task ? task : undefined,
      }),
    );
  }

  private getDeleteTaskForm(context: Context): Response {
    const id = parseInt(context.req.param("id"), 10);
    const task = this.taskRepository.read(id);

    const alert: AlertProps = {
      alertType: "danger",
      title: "Error",
      message: `Failed to load task with ID ${id}`,
    };

    return context.html(
      GetDeleteTaskFormResponse({
        alert: task ? undefined : alert,
        form: task ? { taskId: task.id } : undefined,
      }),
    );
  }
}
