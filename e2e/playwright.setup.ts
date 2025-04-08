import { expect, test as setup } from '@playwright/test';
import { execSync } from 'node:child_process';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './config';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

setup('initialize db', async ({ page }) => {
	setup.setTimeout(120_000);

	if (process.env.NODE_ENV !== 'development') {
		execSync(`npx supabase db reset`);
		execSync(`npx drizzle-kit migrate`);
	}

	const admin = await db.query.member.findFirst({
		where: ({ email }, { eq }) => eq(email, ADMIN_EMAIL)
	});

	if (!admin) {
		await page.goto('/auth');
		await page.getByLabel('Email').fill(ADMIN_EMAIL);
		await page.getByLabel('Password').fill(ADMIN_PASSWORD);
		await page.getByText('Sign up').click();
		await expect(page.getByText(`Hi, ${ADMIN_EMAIL}!`)).toBeVisible();
	}
});
