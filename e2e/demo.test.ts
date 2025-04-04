import { expect, test } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './config';

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
	const email = `${Math.floor(Math.random() * Date.now()).toString(36)}@example.com`;
	const password = `${Math.floor(Math.random() * Date.now()).toString(36)}`;

	await page.goto('/auth');
	await page.getByLabel('Email').fill(email);
	await page.getByLabel('Password').fill(password);
	await page.getByText('Sign up').click();

	await expect(page.getByText(`Hi, ${email}!`)).toBeVisible();
});

test('can log in and out', async ({ page }) => {
	const email = ADMIN_EMAIL;
	const password = ADMIN_PASSWORD;

	await page.goto('/auth');
	await page.getByLabel('Email').fill(email);
	await page.getByLabel('Password').fill(password);
	await page.getByText('Login').click();

	await expect(page.getByText(`Hi, ${email}!`)).toBeVisible();

	await page.getByRole('button', { name: 'Logout' }).click();

	await expect(page.getByText(`Hi, ${email}!`)).not.toBeVisible();
});
