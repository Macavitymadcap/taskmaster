import {
  type TaskEntity,
  TaskRepository,
  type TaskStatus,
} from "./repositories";

const taskRepository = new TaskRepository();

export { TaskEntity, TaskStatus, taskRepository };
