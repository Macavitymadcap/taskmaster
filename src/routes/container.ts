import { TaskRepository, DB_CONFIG } from "../database";

export interface Dependencies {
  taskRepository: TaskRepository;
}

export class Container {
  private static instance: Container;
  private dependencies: Map<string, any> = new Map();

  private constructor() {
    this.registerDependencies();
  }

  /**
   * Get singleton instance of container
   */
  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Register all dependencies
   */
  private registerDependencies(): void {
    // Register repositories
    this.dependencies.set("taskRepository", new TaskRepository(DB_CONFIG.path));
  }

  /**
   * Get a dependency by key
   */
  public get<T>(key: string): T {
    if (!this.dependencies.has(key)) {
      throw new Error(`Dependency '${key}' not found`);
    }
    return this.dependencies.get(key) as T;
  }

  /**
   * Set a dependency (useful for testing)
   */
  public set(key: string, value: any): void {
    this.dependencies.set(key, value);
  }

  /**
   * Get all dependencies as an object
   */
  public getDependencies(): Dependencies {
    return {
      taskRepository: this.get<TaskRepository>("taskRepository"),
    };
  }

  /**
   * Reset container (useful for testing)
   */
  public reset(): void {
    this.dependencies.clear();
    this.registerDependencies();
  }

  /**
   * Create a test container with mock dependencies
   */
  public static createTestContainer(
    mockDependencies: Partial<Dependencies>,
  ): Container {
    const container = new Container();

    // Override with mock dependencies
    Object.entries(mockDependencies).forEach(([key, value]) => {
      container.set(key, value);
    });

    return container;
  }
}
