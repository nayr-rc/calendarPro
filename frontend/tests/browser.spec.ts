import { test, expect } from '@playwright/test';

test.describe('CalendarPro Functional Tests', () => {
    const baseUrl = 'http://localhost:5174';

    test.beforeEach(async ({ page }) => {
        await page.goto(baseUrl);
    });

    // TR-1: App loads successfully
    test('should load the homepage successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/CalendarPro/);
        await expect(page.getByRole('heading', { name: 'CalendarPro' })).toBeVisible();
        await expect(page.getByRole('button', { name: '📅 Mês' })).toBeVisible();
    });

    // TR-2: Month navigation works
    test('should navigate between months', async ({ page }) => {
        // Get initial month
        const initialHeader = await page.getByRole('heading', { level: 2 }).textContent();

        // Click next month
        await page.getByRole('button', { name: 'Próximo' }).click();

        // Check if header changed
        const nextHeader = await page.getByRole('heading', { level: 2 }).textContent();
        expect(nextHeader).not.toBe(initialHeader);

        // Navigate back
        await page.getByRole('button', { name: 'Anterior' }).click();
        await expect(page.getByRole('heading', { level: 2 })).toHaveText(initialHeader!);
    });

    // TR-3: Week navigation works
    test('should navigate between weeks', async ({ page }) => {
        // Switch to week view
        await page.getByRole('button', { name: '📆 Semana' }).click();

        const initialHeader = await page.getByRole('heading', { level: 2 }).textContent();

        // Click next week
        await page.getByRole('button', { name: 'Próximo' }).click();

        // Check if header changed
        const nextHeader = await page.getByRole('heading', { level: 2 }).textContent();
        expect(nextHeader).not.toBe(initialHeader);
    });

    // TR-4: Modal opens
    test('should open event modal when clicking a day', async ({ page }) => {
        // Find a day cell (non-empty) and click it
        // In month view, cells have days. We can pick the first valid day.
        // The implementation uses buttons for days.
        const dayCell = page.locator('button:has-text("15")').first(); // Pick a day in the middle of the month
        await dayCell.click();

        await expect(page.locator('.modal-open')).toBeVisible();
        await expect(page.getByText('Criar Novo Evento')).toBeVisible();
    });

    // TR-5: Event creation
    test('should create a new event', async ({ page }) => {
        // Ensure we are on today's view or a specific day
        // Let's rely on "Hoje" button to center on current month
        await page.getByRole('button', { name: 'Hoje' }).click();

        const today = new Date();
        const day = today.getDate().toString();

        // Click on today's cell
        await page.locator(`button:has-text("${day}")`).first().click();

        const eventTitle = `Test Event ${Date.now()}`;

        // Fill form
        await page.getByLabel('Título').fill(eventTitle);
        await page.getByLabel('Descrição (opcional)').fill('This is an automated test event');

        // Submit
        await page.getByRole('button', { name: 'Criar Evento' }).click();

        // Check if modal closed
        await expect(page.locator('.modal-open')).not.toBeVisible();

        // Check if event appears on the calendar
        await expect(page.getByTitle(eventTitle)).toBeVisible();
    });

    // TR-6: Backend persistence
    test('should persist events after reload', async ({ page }) => {
        const eventTitle = `Persistent Event ${Date.now()}`;

        // Create an event
        const today = new Date().getDate().toString();
        await page.locator(`button:has-text("${today}")`).first().click();
        await page.getByLabel('Título').fill(eventTitle);
        await page.getByRole('button', { name: 'Criar Evento' }).click();

        // Verify it's there
        await expect(page.getByTitle(eventTitle)).toBeVisible();

        // Reload page
        await page.reload();

        // Verify it's still there
        await expect(page.getByTitle(eventTitle)).toBeVisible();
    });
});
