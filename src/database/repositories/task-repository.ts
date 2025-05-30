import { BaseEntity, BaseRepository } from "./base-repository";

type TaskStatus = "completed" | "overdue" | "in-progress";

interface TaskEntity extends BaseEntity {
  title: string;
  description?: string;
  status: TaskStatus;
  due_date: string;
}

class TaskRepository extends BaseRepository<TaskEntity> {
  constructor(dbPath?: string) {
    super("tasks", dbPath);
  }

  protected initDb(): void {
    this.createTable();
  }

  protected createTable(): void {
    this.dbContext.execute(
      `CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'overdue')),
            due_date TEXT NOT NULL
        );`,
    );
  }

  create(entity: Omit<TaskEntity, "id">): TaskEntity | null {
    return this.dbContext.transaction(() => {
      this.dbContext.queryOne(
        `INSERT INTO tasks (title, description, status, due_date) 
                 VALUES ($title, $description, $status, $due_date);`,
        {
          $title: entity.title,
          $description: entity.description || null,
          $status: entity.status,
          $due_date: entity.due_date,
        },
      );

      const lastId = this.dbContext.getLastInsertedId();
      if (lastId === null) {
        return null;
      }

      return this.read(lastId);
    });
  }

  read(id: number): TaskEntity | null {
    return this.dbContext.queryOne<TaskEntity>(
      `SELECT * FROM tasks WHERE id = $id;`,
      { $id: id },
    );
  }

  readAll(): TaskEntity[] {
    return this.dbContext.query<TaskEntity>(`SELECT * FROM tasks;`);
  }

  update(entity: TaskEntity): TaskEntity | null {
    return this.dbContext.transaction(() => {
      const existing = this.read(entity.id);
      if (!existing) {
        return null;
      }

      this.dbContext.queryOne(
        `UPDATE tasks SET
                    title = $title,
                    description = $description,
                    status = $status,
                    due_date = $due_date
                WHERE id = $id;`,
        {
          $id: entity.id,
          $title: entity.title,
          $description: entity.description || null,
          $status: entity.status,
          $due_date: entity.due_date,
        },
      );

      return this.read(entity.id);
    });
  }

  delete(id: number): boolean {
    return this.dbContext.transaction(() => {
      const existing = this.read(id);
      if (!existing) {
        return false;
      }

      this.dbContext.queryOne(`DELETE FROM tasks WHERE id = $id;`, { $id: id });

      return this.read(id) === null;
    });
  }
}

export { TaskRepository, TaskEntity, TaskStatus };
