import { BaseRepository } from "./base.repository";
import { TaskEntity } from "../entities/task.entity";

export class TaskRepository extends BaseRepository<TaskEntity> {
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
            status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'pending')),
            due_date TEXT NOT NULL
        );`
        );
    }
    
    create(entity: Omit<TaskEntity, 'id'>): TaskEntity | null {
        return this.dbContext.transaction(() => {
            // Insert the new task
            this.dbContext.queryOne(
                `INSERT INTO tasks (title, description, status, due_date) 
                 VALUES ($title, $description, $status, $due_date);`,
                {
                    $title: entity.title,
                    $description: entity.description || null,
                    $status: entity.status,
                    $due_date: entity.due_date
                }
            );

            // Get the last inserted row ID and fetch the created task
            const lastId = this.dbContext.queryOne<{ last_insert_rowid: number }>(
                'SELECT last_insert_rowid() as last_insert_rowid;'
            );

            if (!lastId) {
                return null;
            }

            return this.read(lastId.last_insert_rowid);
        });
    }
    
    read(id: number): TaskEntity | null {
        return this.dbContext.queryOne<TaskEntity>(
            `SELECT * FROM tasks WHERE id = $id;`,
           { $id: id } 
        );
    }
    
    readAll(): TaskEntity[] {
        return this.dbContext.query<TaskEntity>(
            `SELECT * FROM tasks;`
        );
    }
    
    update(entity: TaskEntity): TaskEntity | null {
        return this.dbContext.transaction(() => {
            // First check if the entity exists
            const existing = this.read(entity.id);
            if (!existing) {
                return null;
            }

            // Perform the update
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
                    $due_date: entity.due_date
                }
            );
            
            // Return the updated entity
            return this.read(entity.id);
        });
    }

    delete(id: number): boolean {
        return this.dbContext.transaction(() => {
            // First check if the entity exists
            const existing = this.read(id);
            if (!existing) {
                return false;
            }

            // Perform the delete
            this.dbContext.queryOne(
                `DELETE FROM tasks WHERE id = $id;`,
                { $id: id }
            );
            
            // Verify deletion
            return this.read(id) === null;
        });
    }
}