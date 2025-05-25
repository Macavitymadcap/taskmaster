import { test, expect } from '@playwright/test';
import { TaskMasterTestHelper } from '../utils/test-helpers';

test.describe('Alert Component', () => {
  let helper: TaskMasterTestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TaskMasterTestHelper(page);
    await page.goto('/');
    await helper.waitForLibraries();
  });

  test('should display different alert types correctly', async ({ page }) => {
    // Create a task to get a success alert
    await helper.createTask({
      title: 'Success Alert Test',
      status: 'pending'
    });

    const successAlert = await helper.waitForAlert('success');
    await expect(successAlert).toHaveClass(/alert-success/);
    await expect(successAlert).toHaveAttribute('role', 'alert');
    await expect(successAlert).toHaveAttribute('aria-live', 'assertive');
  });

  test('should auto-remove alerts after timeout', async ({ page }) => {
    await helper.createTask({
      title: 'Auto Remove Alert Test',
      status: 'pending'
    });

    const alert = await helper.waitForAlert('success');
    
    // Verify Alpine.js auto-removal attributes
    await expect(alert).toHaveAttribute('x-data');
    await expect(alert).toHaveAttribute('x-init');

    // Wait for auto-removal
    await page.waitForTimeout(5500);
    await expect(alert).not.toBeVisible();
  });
});
