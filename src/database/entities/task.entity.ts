import { BaseEntity } from "./base.entity";

export type TaskStatus = "completed" | "in-progress" | "pending";

export interface TaskEntity extends BaseEntity {
  title: string;
  description?: string;
  status: TaskStatus;
  due_date: string;
}