import { expect, test } from '@playwright/test';

const BUDGET_NAME = 'Test Budget';
const TEAM_NAME = 'Test Team';
const MAX_ASSIGNS = 4;

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
	await page.goto('/members');

	let i = 1;

	for (const select of await page.getByRole('button', { name: 'Select a team' }).all()) {
		if (i === MAX_ASSIGNS) break;
		await select.click();
		await page.getByRole('option', { name: TEAM_NAME }).first().click();
		// TODO: toast
		i++;
	}
});

// test('can create budget', async ({ page }) => {
// 	await page.goto('/budgets');
//
// 	// y flake?
// 	await expect(async () => {
// 		await page.getByRole('button', { name: 'New Budget' }).click();
// 		await expect(page.getByRole('dialog')).toBeVisible();
// 	}).toPass();
//
// 	await page.getByLabel('Amount').fill('12345'); // €123.45
// 	await page.getByLabel('Name').fill(BUDGET_NAME);
//
// 	// select team
// 	await page.getByRole('button', { name: 'Select a team' }).click();
// 	await page.getByRole('option', { name: TEAM_NAME }).first().click();
//
// 	// TODO date pickers
// });
