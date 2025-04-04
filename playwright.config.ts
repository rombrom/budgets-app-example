import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run app:build && npm run app:preview',
		port: 3000,
		reuseExistingServer: true
	},
	testDir: 'e2e'
});
