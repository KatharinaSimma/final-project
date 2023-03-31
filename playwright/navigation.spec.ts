import { expect, test } from '@playwright/test';
import { sql } from '../database/connect';

test.beforeAll(async () => {
  await sql`
  DELETE FROM
    users
  WHERE
    username = 'testuser'
`;
});

test('register testuser', async ({ page }) => {
  // register new user
  await page.goto('http://localhost:3000/logout');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByPlaceholder('username').click();
  await page.getByPlaceholder('username').fill('testuser');
  await page.getByPlaceholder('password').click();
  await page.getByPlaceholder('password').fill('abcd1234!');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL('http://localhost:3000/profile');

  // go to home
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('http://localhost:3000');
  await expect(page.getByTestId('create-list')).toBeVisible();

  // create a new list
  await page.getByTestId('create-list').click();
  await page.getByTestId('create-list').fill('neue liste');
});

test('login testuser', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await page.getByPlaceholder('username').click();
  await page.getByPlaceholder('username').fill('testuser');
  await page.getByPlaceholder('password').click();
  await page.getByPlaceholder('password').fill('abcd1234!');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('http://localhost:3000');
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await page.getByRole('link', { name: 'Home' }).click();
});
