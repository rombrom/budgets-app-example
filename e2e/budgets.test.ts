import { expect, Page, test } from '@playwright/test';

const BUDGET_NAME = 'Test Budget';
const TEAM_NAME = 'Test Team';
const MAX_ASSIGNS = 4;

// The idiomatic way here would be to create Playwright test fixtures.
// For the sake of simplicity and speed we'll just create a helper.
async function makePurchase({ amount, page }: { amount: number; page: Page }) {
	await page.goto('/purchases');

	// y flake?
	await expect(async () => {
		await page.getByRole('button', { name: 'New Purchase' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
	}).toPass();

	const dialog = page.getByRole('dialog');
	await dialog.getByLabel('Amount').fill(String(amount));
	await dialog.getByRole('button', { name: 'Budget' }).click();
	await page.getByRole('option', { name: BUDGET_NAME }).first().click();
	await dialog.getByRole('button', { name: 'Member' }).click();
	await page
		.getByRole('option', { name: /example\.com$/ })
		.first()
		.click();
	await dialog.getByRole('button', { name: 'Submit' }).click();
	await page.getByRole('button', { name: 'Close' }).click();
}

test('can create team', async ({ page }) => {
	await page.goto('/teams');

	// y flake?
	await expect(async () => {
		await page.getByRole('button', { name: 'New Team' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
	}).toPass();

	await page.getByLabel('Team Name').fill(TEAM_NAME);
	await page.getByRole('button', { name: 'Create' }).click();
	await expect(page.getByText('Created team "Test Team".')).toBeVisible();
});

test('can assign members', async ({ page }) => {
	// TODO: `networkidle` is hardly the right check here but the test remains
	// flaky otherwise. I bet it has something to do with SvelteKit still parsing
	// scripts? Playwright is very very fast. Bits-UI might've been a mistake.
	await page.goto('/members', { waitUntil: 'networkidle' });
	// Note the `nth()` selector. Usually 0 is the 'admin user'.
	await page.getByRole('button', { name: 'Select a team' }).nth(1).click({ force: true });
	await page.getByRole('option', { name: TEAM_NAME }).first().click();
});

test('can create budget', async ({ page }) => {
	await page.goto('/budgets');

	// y flake?
	await expect(async () => {
		await page.getByRole('button', { name: 'New Budget' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
	}).toPass();

	const dialog = page.getByRole('dialog');
	await dialog.getByLabel('Amount').fill('12345'); // €123.45
	await dialog.getByLabel('Name').fill(BUDGET_NAME);

	// select team
	await dialog.getByRole('button', { name: 'Team' }).click();
	await page.getByRole('option', { name: TEAM_NAME }).first().click();

	await dialog.getByLabel('Valid From').click();
	await page
		.getByRole('application')
		.getByRole('rowgroup')
		.getByRole('button', { disabled: false })
		.first()
		.click();

	await dialog.getByLabel('Valid Until').click();
	await page
		.getByRole('application')
		.getByRole('rowgroup')
		.getByRole('button', { disabled: false })
		.last()
		.click();

	await dialog.getByRole('button', { name: 'Submit' }).click();

	await expect(page.getByText(/^Created budget/)).toBeVisible();
});

test('can make a purchase', async ({ page }) => {
	await makePurchase({ amount: 10045, page });
	await expect(page.getByText('Created purchase for 10045.')).toBeVisible();
	// Navigate to budgets page and verify remaining budget
	await page.getByRole('navigation').getByText('Budgets').click();
	await expect(
		page.getByRole('row').filter({ hasText: BUDGET_NAME }).getByText('23000')
	).toBeVisible();
});

test('cannot make a purchase exceeding budget remaining', async ({ page }) => {
	await makePurchase({ amount: 10045, page });
	await expect(page.getByText('Not enough budget remaining.')).toBeVisible();
});
