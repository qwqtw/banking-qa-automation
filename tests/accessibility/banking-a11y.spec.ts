import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('banking dashboard has no serious accessibility violations @a11y', async ({ page }) => {
  await page.goto('http://localhost:5173?accountId=1');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const seriousViolations = results.violations.filter(
    violation =>
      violation.impact === 'serious' ||
      violation.impact === 'critical'
  );

  expect(seriousViolations).toEqual([]);
});