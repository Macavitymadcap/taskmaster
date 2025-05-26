interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

type TaskStatus = "pending" | "in-progress" | "completed";

const VALID_STATUSES: TaskStatus[] = ["pending", "in-progress", "completed"];

export { ValidationError, ValidationResult, TaskStatus, VALID_STATUSES };
