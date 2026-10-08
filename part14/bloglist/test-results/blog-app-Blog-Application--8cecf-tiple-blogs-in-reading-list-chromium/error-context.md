# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog-app.spec.ts >> Blog Application >> Me Page >> shows multiple blogs in reading list
- Location: tests/blog-app.spec.ts:394:9

# Error details

```
Error: Failed to reset database: 500 Internal Server Error - 
```

```
Error: Failed to create user: 500 Internal Server Error - {"error":"Failed query: insert into \"users\" (\"id\", \"username\", \"name\", \"passwordHash\", \"token\") values (default, $1, $2, $3, default) returning \"id\", \"username\", \"name\", \"passwordHash\", \"token\"\nparams: testuser,Test User,$2b$10$LuxEI0V3KilZtYLrLF9e8uuhIinGAUv3hmn9blgdyS0YjzNAZ4gmO"}
```

# Test source

```ts
  1  | import { Page } from "@playwright/test"
  2  | 
  3  | const baseUrl = "http://localhost:3000"
  4  | 
  5  | export const resetDatabase = async () => {
  6  |   const response = await fetch(`${baseUrl}/api/testing/reset`, {
  7  |     method: "DELETE",
  8  |   })
  9  |   if (!response.ok) {
  10 |     const errorText = await response.text()
  11 |     throw new Error(
  12 |       `Failed to reset database: ${response.status} ${response.statusText} - ${errorText}`,
  13 |     )
  14 |   }
  15 | }
  16 | 
  17 | export const createUser = async (
  18 |   username: string,
  19 |   name: string,
  20 |   password: string,
  21 | ) => {
  22 |   const response = await fetch(`${baseUrl}/api/testing/users`, {
  23 |     method: "POST",
  24 |     headers: {
  25 |       "Content-Type": "application/json",
  26 |     },
  27 |     body: JSON.stringify({ username, name, password }),
  28 |   })
  29 |   if (!response.ok) {
  30 |     const errorText = await response.text()
> 31 |     throw new Error(
     |           ^ Error: Failed to create user: 500 Internal Server Error - {"error":"Failed query: insert into \"users\" (\"id\", \"username\", \"name\", \"passwordHash\", \"token\") values (default, $1, $2, $3, default) returning \"id\", \"username\", \"name\", \"passwordHash\", \"token\"\nparams: testuser,Test User,$2b$10$LuxEI0V3KilZtYLrLF9e8uuhIinGAUv3hmn9blgdyS0YjzNAZ4gmO"}
  32 |       `Failed to create user: ${response.status} ${response.statusText} - ${errorText}`,
  33 |     )
  34 |   }
  35 |   return response.json()
  36 | }
  37 | 
  38 | export const loginUser = async (
  39 |   page: Page,
  40 |   username: string,
  41 |   password: string,
  42 | ) => {
  43 |   await page.goto("/")
  44 |   const logoutButton = page.getByRole("button", { name: /logout/i })
  45 |   if (await logoutButton.isVisible()) {
  46 |     await logoutButton.click()
  47 |     await page.waitForURL("/")
  48 |   }
  49 | 
  50 |   await page.goto("/login")
  51 |   await page.getByLabel("Username", { exact: true }).fill(username)
  52 |   await page.getByLabel("Password", { exact: true }).fill(password)
  53 |   await Promise.all([
  54 |     page.waitForURL("/"),
  55 |     page.getByRole("button", { name: "Login" }).click(),
  56 |   ])
  57 | }
  58 | 
  59 | export const createBlog = async (
  60 |   page: Page,
  61 |   title: string,
  62 |   author: string,
  63 |   url: string,
  64 | ) => {
  65 |   await page.goto("/blogs/new")
  66 |   await page.getByLabel("Title", { exact: true }).fill(title)
  67 |   await page.getByLabel("Author", { exact: true }).fill(author)
  68 |   await page.getByLabel("URL", { exact: true }).fill(url)
  69 |   await page.getByRole("button", { name: "Create" }).click()
  70 |   // Wait for navigation to blogs page
  71 |   await page.waitForURL("/blogs")
  72 | }
  73 | 
```