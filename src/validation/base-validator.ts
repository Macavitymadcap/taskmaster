import { ValidationError, ValidationResult } from "./model";

export abstract class BaseValidator<T> implements ValidationResult {
  public errors: ValidationError[];

  constructor() {
    this.errors = [];
  }

  get isValid(): boolean {
    return this.errors.length === 0;
  }

  public abstract validate(): void;
}
