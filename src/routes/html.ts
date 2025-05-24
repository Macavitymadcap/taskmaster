import { Hono, Context } from "hono";
import { taskRepository, TaskStatus } from "../database";
import { Alert, CreateSuccess, ReadTask } from "../components";

export const html = new Hono();

html.get("/tasks", (context: Context) => {
    const tasks = taskRepository.readAll();

    return context.html(`${tasks.map(task => ReadTask(task)).join("")}`);
});


// Create a new task
html.post("/task", async (context: Context) => {
  const formData = await context.req.formData();
  
  const title = (formData.get("title") as string) || "";
  const description = (formData.get("description") as string) || "";
  const status = (formData.get("status") as string) || "";
  const due_date = (formData.get("due_date") as string) || "";

  const task = taskRepository.create({
    title,
    description,
    status: status as TaskStatus,
    due_date,
  });

  if (!task) {
    return context.html(
        Alert(
            { type: "danger", title: "Error", message: "Failed to create task", outOfBounds: true, manuallyDismissible: true, autoDismiss: false }
        ),
        500
    );
  }

  return context.html(
    CreateSuccess({
        task,
        alert: {
            type: "success",
            title: "Task Created",
            message: `Task "${task.title}" created successfully!`,
            outOfBounds: true,
            id: 'create-task-alert',
            manuallyDismissible: true,
            autoDismiss: true,

        },
    })
  );
});
