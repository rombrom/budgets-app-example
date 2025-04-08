import { expect, test } from '@playwright/test';

const MEMBER_AMOUNT = 10;

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

test('cannot sign up with weak password', async ({ page }) => {
	const email = `${Math.floor(Math.random() * Date.now()).toString(36)}@example.com`;
	const password = `test`;

	await page.goto('/auth');
	await page.getByLabel('Email').fill(email);
	await page.getByLabel('Password').fill(password);
	await page.getByText('Sign up').click();

	await expect(page.getByText('Password should be at least 6 characters.')).toBeVisible();
});

test('can sign up', async ({ page }) => {
	for (let i = 0; i < MEMBER_AMOUNT; i++) {
		const randomStr = Math.floor(Math.random() * Date.now()).toString(36);

		const email = `${randomStr}@example.com`;
		const password = `${randomStr}`;

		await page.goto('/auth');
		await page.getByLabel('Email').fill(email);
		await page.getByLabel('Password').fill(password);
		await page.getByText('Sign up').click();

		await expect(page.getByText(`Hi, ${email}!`)).toBeVisible();

		await expect(async () => {
			await page.getByRole('button', { name: 'Logout' }).click();
			await expect(page.getByText(`Hi, ${email}!`)).not.toBeVisible();
		}).toPass();
	}
});
