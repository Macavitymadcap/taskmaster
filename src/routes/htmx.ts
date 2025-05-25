import { Hono, Context } from "hono";
import { taskRepository, TaskStatus } from "../database";
import { type AlertProps, Alert, CreateResponse, ReadTask } from "../components";
import { GetUpdateFormResponse } from "../components/GetUpdateFormResponse";
import { GetTaskByIDResponse } from "../components/GetTaskByIDResponse";
import { UpdateTaskResponse } from "../components/UpdateTaskResponse";
import { GetDeleteTaskFormResponse } from "../components/GetDeleteTaskFormResponse";

export const htmx = new Hono();

// Create a new task
htmx.post("/task", async (context: Context) => {
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
    CreateResponse({ alert: alert, task: task ? task : undefined }),
  );
});

// Read by ID
htmx.get("/task/:id", (context: Context) => {
  const id = parseInt(context.req.param("id"), 10);
  const task = taskRepository.read(id);

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
});

// Read all tasks
htmx.get("/tasks", (context: Context) => {
  const tasks = taskRepository.readAll();

  return context.html(`${tasks.map((task) => ReadTask(task)).join("")}`);
});

// Get form to update a task
htmx.get("/update-form/:id", (context: Context) => {
  const id = parseInt(context.req.param("id"), 10);
  const task = taskRepository.read(id);

  const alert: AlertProps = {
    alertType: "danger",
    title: "Error",
    message: `Failed to load task with ID ${id}`,
  };

  return context.html(
    GetUpdateFormResponse({ alert: task ? undefined : alert, form: task ? task : undefined })
  );
});

// Update a task
htmx.put("/task/:id", async (context: Context) => {
  const id = parseInt(context.req.param("id"), 10);
  const formData = await context.req.formData();

  const title = (formData.get("title") as string) || "";
  const description = (formData.get("description") as string) || "";
  const status = (formData.get("status") as string) || "";
  const due_date = (formData.get("due_date") as string) || "";

  const task = taskRepository.update({
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
    UpdateTaskResponse({ alert: alert, task: task ? task : undefined })
  );
});

// Get form to delete a task
htmx.get("/delete-form/:id", (context: Context) => {
  const id = parseInt(context.req.param("id"), 10);
  const task = taskRepository.read(id);

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
});

// Delete a task
htmx.delete("/task/:id", (context: Context) => {
  const id = parseInt(context.req.param("id"), 10);
  const hasBeenDeleted = taskRepository.delete(id);

  const alert: AlertProps = hasBeenDeleted ?  {
    alertType: "success",
    title: "Task Deleted",
    message: `Task with ID ${id} has been deleted successfully.`,
  } : {
    alertType: "danger",
    title: "Error",
    message: `Failed to delete task with ID ${id}`,
  };

  return context.html(
    Alert(alert),
    { headers: { "HX-Trigger": "taskDeleted" } }
  );
});