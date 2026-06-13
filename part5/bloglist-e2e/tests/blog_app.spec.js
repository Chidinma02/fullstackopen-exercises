const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Empty database
    await request.post('http://localhost:3003/api/testing/reset')
    
    // Create first user (blog owner)
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'password123'
      }
    })

    // Create second user (non-owner)
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'otheruser',
        name: 'Other User',
        password: 'password456'
      }
    })

    // Navigate to base
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click()
    await expect(page.locator('#username-input')).toBeVisible()
    await expect(page.locator('#password-input')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'Sign In' }).click()
      await page.fill('#username-input', 'testuser')
      await page.fill('#password-input', 'password123')
      await page.click('button[type="submit"]')

      await expect(page.getByText('Logged in as Test User')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'Sign In' }).click()
      await page.fill('#username-input', 'testuser')
      await page.fill('#password-input', 'wrongpassword')
      await page.click('button[type="submit"]')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Logged in as')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'Sign In' }).click()
      await page.fill('#username-input', 'testuser')
      await page.fill('#password-input', 'password123')
      await page.click('button[type="submit"]')
      await expect(page.getByText('Logged in as Test User')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'Create New' }).click()
      await page.fill('#title-input', 'E2E Testing in Playwright')
      await page.fill('#author-input', 'Playwright Author')
      await page.fill('#url-input', 'http://playwright.dev')
      await page.getByRole('button', { name: 'Create Blog' }).click()

      await expect(page.getByText('a new blog E2E Testing in Playwright by Playwright Author added')).toBeVisible()
      await expect(page.locator('.blogs-grid').getByText('E2E Testing in Playwright')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('link', { name: 'Create New' }).click()
        await page.fill('#title-input', 'Existing Blog for Likes and Deletes')
        await page.fill('#author-input', 'Owner Author')
        await page.fill('#url-input', 'http://existingblog.com')
        await page.getByRole('button', { name: 'Create Blog' }).click()
        await expect(page.locator('.blogs-grid').getByText('Existing Blog for Likes and Deletes')).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        // Navigate to details page
        await page.locator('.blog-card').getByText('Existing Blog for Likes and Deletes').click()
        
        // Confirm likes count is 0 initially
        await expect(page.locator('.blog-likes').getByText('0')).toBeVisible()
        
        // Like it
        await page.getByRole('button', { name: 'Like' }).click()
        await expect(page.locator('.blog-likes').getByText('1')).toBeVisible()
      })

      test('the creator can delete the blog', async ({ page }) => {
        // Navigate to details page
        await page.locator('.blog-card').getByText('Existing Blog for Likes and Deletes').click()
        
        // Expect Remove button to be visible
        await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()

        // Handle confirm dialog
        page.on('dialog', dialog => dialog.accept())

        // Click remove and assert it redirects to home and the blog is gone
        await page.getByRole('button', { name: 'Remove' }).click()
        await expect(page.getByText('Blog Existing Blog for Likes and Deletes removed successfully')).toBeVisible()
        await expect(page.locator('.blogs-grid').getByText('Existing Blog for Likes and Deletes')).not.toBeVisible()
      })

      test('only the user who added the blog sees the delete button', async ({ page }) => {
        // Log out first
        await page.getByRole('button', { name: 'Logout' }).click()

        // Log in as second user
        await page.getByRole('link', { name: 'Sign In' }).click()
        await page.fill('#username-input', 'otheruser')
        await page.fill('#password-input', 'password456')
        await page.click('button[type="submit"]')
        await expect(page.getByText('Logged in as Other User')).toBeVisible()

        // Go to details of the blog created by testuser
        await page.locator('.blog-card').getByText('Existing Blog for Likes and Deletes').click()

        // Verify Like button is shown, but Remove button is NOT shown
        await expect(page.getByRole('button', { name: 'Like' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
      })
    })
  })
})
