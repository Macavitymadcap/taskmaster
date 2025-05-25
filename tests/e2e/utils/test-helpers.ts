import { Page, Locator, expect } from '@playwright/test';

/**
 * Helper class for testing htmx and Alpine.js functionality
 */
export class TaskMasterTestHelper {
  constructor(private page: Page) {}

  /**
   * Wait for htmx to be loaded and ready
   */
  async waitForHtmx(): Promise<void> {
    await this.page.waitForFunction(() => {
      return typeof (window as any).htmx !== 'undefined';
    });
  }

  /**
   * Wait for Alpine.js to be loaded and ready
   */
  async waitForAlpine(): Promise<void> {
    await this.page.waitForFunction(() => {
      return typeof (window as any).Alpine !== 'undefined';
    });
  }

  /**
   * Wait for both htmx and Alpine.js to be ready
   */
  async waitForLibraries(): Promise<void> {
    await Promise.all([
      this.waitForHtmx(),
      this.waitForAlpine()
    ]);
  }

  /**
   * Wait for htmx request to complete
   */
  async waitForHtmxRequest(): Promise<void> {
    // Wait for htmx request indicator to appear and disappear
    await this.page.waitForFunction(() => {
      const indicators = document.querySelectorAll('.htmx-request, [hx-indicator]');
      return indicators.length === 0 || 
             Array.from(indicators).every(el => 
               !el.classList.contains('htmx-request')
             );
    });
  }

  /**
   * Create a new task using the form
   */
  async createTask(task: {
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
  }): Promise<void> {
    // Open create dialog
    await this.page.click('button[title="Add new task"]');
    await this.page.waitForSelector('#create-task-dialog[open]');

    // Fill form
    await this.page.fill('#title', task.title);
    
    if (task.description) {
      await this.page.fill('#description', task.description);
    }
    
    if (task.status) {
      await this.page.selectOption('#status', task.status);
    }
    
    if (task.dueDate) {
      await this.page.fill('#due-date', task.dueDate);
    }

    // Submit and wait for htmx response
    await Promise.all([
      this.page.click('button[type="submit"]'),
      this.waitForHtmxRequest()
    ]);
  }

  /**
   * Get task element by ID
   */
  getTask(id: number): Locator {
    return this.page.locator(`#task-${id}`);
  }

  /**
   * Get all task elements
   */
  getAllTasks(): Locator {
    return this.page.locator('[id^="task-"]');
  }

  /**
   * Update a task
   */
  async updateTask(id: number, updates: {
    title?: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
  }): Promise<void> {
    const task = this.getTask(id);
    
    // Click update button
    await task.locator('button[title="Update Task"]').click();
    await this.page.waitForSelector('#update-task-dialog[open]');

    // Update fields
    if (updates.title !== undefined) {
      await this.page.fill(`#title-${id}`, updates.title);
    }
    
    if (updates.description !== undefined) {
      await this.page.fill(`#description-${id}`, updates.description);
    }
    
    if (updates.status) {
      await this.page.selectOption(`#status-${id}`, updates.status);
    }
    
    if (updates.dueDate) {
      await this.page.fill(`#due_date-${id}`, updates.dueDate);
    }

    // Submit and wait for htmx response
    await Promise.all([
      this.page.click('button[title="Update Task"]'),
      this.waitForHtmxRequest()
    ]);
  }

  /**
   * Delete a task
   */
  async deleteTask(id: number): Promise<void> {
    const task = this.getTask(id);
    
    // Click delete button
    await task.locator('button[title="Delete Task"]').click();
    await this.page.waitForSelector('#delete-task-dialog[open]');

    // Confirm deletion and wait for htmx response
    await Promise.all([
      this.page.click('#delete-task-dialog button[title="Delete Task"]'),
      this.waitForHtmxRequest()
    ]);
  }

  /**
   * Toggle theme using Alpine.js
   */
  async toggleTheme(): Promise<void> {
    await this.page.click('#theme-switch');
    // Wait a moment for Alpine.js to process the change
    await this.page.waitForTimeout(100);
  }

  /**
   * Get current theme
   */
  async getCurrentTheme(): Promise<string> {
    return await this.page.getAttribute('html', 'data-theme') || 'light';
  }

  /**
   * Wait for alert to appear
   */
  async waitForAlert(type?: 'success' | 'danger' | 'warning' | 'info'): Promise<Locator> {
    const selector = type ? `.alert.alert-${type}` : '.alert';
    await this.page.waitForSelector(selector);
    return this.page.locator(selector).last(); // Get the most recent alert
  }

  /**
   * Get all visible alerts
   */
  getAlerts(): Locator {
    return this.page.locator('.alert');
  }

  /**
   * Search/filter tasks
   */
  async searchTasks(query: string, searchBy: 'title' | 'due_date' | 'status' = 'title'): Promise<void> {
    await this.page.fill('#search-input', query);
    await this.page.selectOption('#search-by', searchBy);
    // Wait for any filtering to occur (if implemented)
    await this.page.waitForTimeout(300);
  }

  /**
   * Check if element has htmx attributes
   */
  async hasHtmxAttributes(locator: Locator, attributes: Record<string, string>): Promise<boolean> {
    for (const [attr, expectedValue] of Object.entries(attributes)) {
      const actualValue = await locator.getAttribute(attr);
      if (actualValue !== expectedValue) {
        return false;
      }
    }
    return true;
  }

  /**
   * Trigger htmx event manually (for testing edge cases)
   */
  async triggerHtmxEvent(selector: string, eventName: string, detail?: any): Promise<void> {
    await this.page.evaluate(
      ({ selector, eventName, detail }) => {
        const element = document.querySelector(selector);
        if (element && (window as any).htmx) {
          (window as any).htmx.trigger(element, eventName, detail);
        }
      },
      { selector, eventName, detail }
    );
  }

  /**
   * Get Alpine.js data from an element
   */
  async getAlpineData(selector: string): Promise<any> {
    return await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element ? (element as any).__x?.$data : null;
    }, selector);
  }

  /**
   * Set Alpine.js data on an element
   */
  async setAlpineData(selector: string, data: Record<string, any>): Promise<void> {
    await this.page.evaluate(
      ({ selector, data }) => {
        const element = document.querySelector(selector);
        if (element && (element as any).__x) {
          Object.assign((element as any).__x.$data, data);
        }
      },
      { selector, data }
    );
  }
}