import { TaskStatus, VALID_STATUSES } from "./model";
import { BaseValidator } from "./base-validator";

interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate: string;
  status: TaskStatus;
}

class CreateTaskValidator extends BaseValidator<CreateTaskRequest> {
  constructor(
    public title: string,
    public description: string | undefined,
    public dueDate: string,
    public status: TaskStatus,
  ) {
    super();
    this.validate();
  }

  validate() {
    this.validateTitle();
    this.validateDescription();
    this.validateDueDate();
    this.validateStatus();
  }

  private validateTitle() {
    if (!this.title.trim()) {
      this.errors.push({ field: "title", message: "Title is required" });
    } else if (this.title.trim().length > 255) {
      this.errors.push({
        field: "title",
        message: "Title must be less than 255 characters",
      });
    } else if (this.title.trim().length < 3) {
      this.errors.push({
        field: "title",
        message: "Title must be at least 3 characters",
      });
    } else {
      this.errors = this.errors.filter((error) => error.field !== "title");
    }
  }

  private validateDescription() {
    if (this.description && this.description.length > 1000) {
      this.errors.push({
        field: "description",
        message: "Description must be less than 1000 characters",
      });
    } else {
      this.errors = this.errors.filter(
        (error) => error.field !== "description",
      );
    }
  }

  private validateDueDate() {
    if (!this.dueDate) {
      this.errors.push({ field: "dueDate", message: "Due date is required" });
    } else if (isNaN(Date.parse(this.dueDate))) {
      this.errors.push({ field: "dueDate", message: "Invalid date format" });
    } else if (new Date(this.dueDate) < new Date()) {
      this.errors.push({
        field: "dueDate",
        message: "Due date cannot be in the past",
      });
    } else {
      this.errors = this.errors.filter((error) => error.field !== "dueDate");
    }
  }

  private validateStatus() {
    if (!VALID_STATUSES.includes(this.status)) {
      this.errors.push({ field: "status", message: "Invalid task status" });
    } else {
      this.errors = this.errors.filter((error) => error.field !== "status");
    }
  }

  static create(
    title: string,
    description: string | undefined,
    dueDate: string,
    status: TaskStatus,
  ): CreateTaskValidator {
    return new CreateTaskValidator(title, description, dueDate, status);
  }
}

export { CreateTaskValidator, CreateTaskRequest };
