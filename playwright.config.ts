import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
	projects: [
		{
			name: 'setup',
			testMatch: /playwright\.setup\.ts/
		},
		{
			dependencies: ['setup'],
			name: 'auth',
			testMatch: /auth\.setup\.ts/
		},
		{
			dependencies: ['setup', 'auth'],
			name: 'tests'
		}
	],
	testDir: './e2e',
	use: {
		baseURL: 'http://localhost:3000'
	},
	webServer: [
		{
			command: 'npm run app:build && npm run app:preview',
			port: 3000,
			reuseExistingServer: true
		},
		{
			command: 'npm run db:start',
			port: 54322,
			reuseExistingServer: true
		}
	]
});
