import { test, expect } from '@playwright/test';
import { TaskMasterTestHelper } from './utils/test-helpers';

test.describe('Task Management E2E Tests', () => {
  let helper: TaskMasterTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TaskMasterTestHelper(page);
    
    // Navigate to the app
    await page.goto('/');
    
    // Wait for libraries to load
    await helper.waitForLibraries();
    
    // Wait for initial page load and htmx to process
    await page.waitForLoadState('networkidle');
  });

  test('should load the application with htmx and Alpine.js', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Task Master/);
    
    // Verify main heading
    await expect(page.locator('h1')).toContainText('Task Master');
    
    // Verify htmx is loaded
    const htmxLoaded = await page.evaluate(() => typeof (window as any).htmx !== 'undefined');
    expect(htmxLoaded).toBe(true);
    
    // Verify Alpine.js is loaded
    const alpineLoaded = await page.evaluate(() => typeof (window as any).Alpine !== 'undefined');
    expect(alpineLoaded).toBe(true);
    
    // Verify essential elements are present
    await expect(page.locator('#create-task-dialog')).toBeAttached();
    await expect(page.locator('#update-task-dialog')).toBeAttached();
    await expect(page.locator('#delete-task-dialog')).toBeAttached();
    await expect(page.locator('#alerts')).toBeAttached();
  });

  test('should create a new task using htmx', async ({ page }) => {
    const taskData = {
      title: 'E2E Test Task',
      description: 'Created via Playwright test',
      status: 'pending' as const,
      dueDate: '2025-12-31T10:30'
    };

    // Create task
    await helper.createTask(taskData);

    // Verify task appears in the list
    const taskElement = helper.getTask(1); // Assuming this is the first task
    await expect(taskElement).toBeVisible();
    await expect(taskElement.locator('h2')).toContainText(taskData.title);
    await expect(taskElement).toContainText(taskData.description);
    await expect(taskElement).toContainText('PENDING');

    // Verify success alert
    const alert = await helper.waitForAlert('success');
    await expect(alert).toContainText('Task Created');
    await expect(alert).toContainText(taskData.title);

    // Verify htmx attributes on task buttons
    const updateButton = taskElement.locator('button[title="Update Task"]');
    const deleteButton = taskElement.locator('button[title="Delete Task"]');
    
    await expect(updateButton).toHaveAttribute('hx-get', '/htmx/update-form/1');
    await expect(deleteButton).toHaveAttribute('hx-get', '/htmx/delete-form/1');
  });

  test('should update a task using htmx', async ({ page }) => {
    // First create a task
    await helper.createTask({
      title: 'Original Task',
      description: 'Original description',
      status: 'pending'
    });

    // Update the task
    await helper.updateTask(1, {
      title: 'Updated Task',
      status: 'completed'
    });

    // Verify updates
    const taskElement = helper.getTask(1);
    await expect(taskElement.locator('h2')).toContainText('Updated Task');
    await expect(taskElement).toContainText('COMPLETED');
    await expect(taskElement.locator('.badge-success')).toBeVisible();

    // Verify success alert
    const alert = await helper.waitForAlert('success');
    await expect(alert).toContainText('Task Updated');
  });

  test('should delete a task using htmx', async ({ page }) => {
    // First create a task
    await helper.createTask({
      title: 'Task to Delete',
      status: 'pending'
    });

    // Verify task exists
    await expect(helper.getTask(1)).toBeVisible();

    // Delete the task
    await helper.deleteTask(1);

    // Verify task is removed
    await expect(helper.getTask(1)).not.toBeVisible();

    // Verify success alert
    const alert = await helper.waitForAlert('success');
    await expect(alert).toContainText('Task Deleted');
  });

  test('should toggle theme using Alpine.js', async ({ page }) => {
    // Check initial theme
    let currentTheme = await helper.getCurrentTheme();
    expect(['light', 'dark']).toContain(currentTheme);

    // Toggle theme
    await helper.toggleTheme();
    
    // Verify theme changed
    const newTheme = await helper.getCurrentTheme();
    expect(newTheme).not.toBe(currentTheme);

    // Toggle back
    await helper.toggleTheme();
    
    // Verify theme returned to original
    const finalTheme = await helper.getCurrentTheme();
    expect(finalTheme).toBe(currentTheme);

    // Verify localStorage was updated (Alpine.js functionality)
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe(finalTheme);
  });

  test('should handle htmx form validation errors', async ({ page }) => {
    // Try to create task without required title
    await page.click('button[title="Add new task"]');
    await page.waitForSelector('#create-task-dialog[open]');
    
    // Leave title empty and submit
    await page.click('button[type="submit"]');
    
    // Form should not submit due to HTML5 validation
    await expect(page.locator('#create-task-dialog')).toHaveAttribute('open');
    
    // Check for validation message
    const titleInput = page.locator('#title');
    const validationMessage = await titleInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should handle multiple rapid clicks (htmx debouncing)', async ({ page }) => {
    await helper.createTask({
      title: 'Rapid Click Test',
      status: 'pending'
    });

    const updateButton = helper.getTask(1).locator('button[title="Update Task"]');
    
    // Click multiple times rapidly
    await updateButton.click();
    await updateButton.click();
    await updateButton.click();
    
    // Should only open one dialog
    const dialogs = page.locator('#update-task-dialog[open]');
    await expect(dialogs).toHaveCount(1);
  });

  test('should auto-remove alerts using Alpine.js', async ({ page }) => {
    // Create a task to trigger an alert
    await helper.createTask({
      title: 'Auto Remove Test',
      status: 'pending'
    });

    // Verify alert appears
    const alert = await helper.waitForAlert('success');
    await expect(alert).toBeVisible();

    // Wait for auto-removal (your alert has 5 second timeout)
    await page.waitForTimeout(5500);
    
    // Verify alert is removed
    await expect(alert).not.toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Create a task first
    await helper.createTask({
      title: 'Network Error Test',
      status: 'pending'
    });

    // Simulate network failure
    await page.route('**/htmx/task/*', route => route.abort());

    // Try to delete the task
    const deleteButton = helper.getTask(1).locator('button[title="Delete Task"]');
    await deleteButton.click();
    await page.waitForSelector('#delete-task-dialog[open]');
    
    // Click delete - this should fail due to network abort
    await page.click('#delete-task-dialog button[title="Delete Task"]');
    
    // Task should still exist since request failed
    await expect(helper.getTask(1)).toBeVisible();

    // Clear the route to restore normal behavior
    await page.unroute('**/htmx/task/*');
  });
});