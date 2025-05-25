import { Hono, Context } from "hono";
import { TaskRepository } from "../database";
import { type AlertProps} from "../components";
import { GetUpdateFormResponse } from "../components/GetUpdateFormResponse";
import { GetDeleteTaskFormResponse } from "../components/GetDeleteTaskFormResponse";
import { Container } from "./container";
import { BaseRoute } from "./base-route";

export class FormRoute extends BaseRoute {
  private taskRepository: TaskRepository;
  
  constructor(container: Container = Container.getInstance()) {
    super({ prefix: "/form" });
    this.taskRepository = container.get<TaskRepository>("taskRepository");
  }

  protected initializeRoutes(): void {
    this.app.get("/update/:id", this.getUpdateForm.bind(this));
    this.app.get("/delete/:id", this.getDeleteForm.bind(this));
  }

  private getUpdateForm(context: Context): Response {
    const id = parseInt(context.req.param("id"), 10);
    const task = this.taskRepository.read(id);

    const alert: AlertProps = {
      alertType: "danger",
      title: "Error",
      message: `Failed to load task with ID ${id}`,
    };

    return context.html(
      GetUpdateFormResponse({ alert: task ? undefined : alert, form: task ? task : undefined })
    );
  }

  private getDeleteForm(context: Context): Response {
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
      })
    );
  }
}
