import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	projects: [
		{
			name: 'setup',
			testMatch: /playwright\.setup\.ts/
		},
		{
			dependencies: ['setup'],
			name: 'tests'
		}
	],
	testDir: './e2e',
	webServer: {
		command: 'npm run app:build && npm run app:preview',
		port: 3000,
		reuseExistingServer: true
	}
});
