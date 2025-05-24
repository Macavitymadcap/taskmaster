import {
  type TaskEntity,
  TaskRepository,
  type TaskStatus,
} from "./repositories/task-repository";

const taskRepository = new TaskRepository();

export { TaskEntity, TaskStatus, taskRepository };
