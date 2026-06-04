# Assignment 2 - Blog - Client App

The goal of this assignment is to implement all the client side functionality.
Example implementation is in the image below.

## Success Criteria

- ✅ All of the tests must be passing
- ✅ You must be able to explain any code in the codebase

## 👾 Requirements - Assignment 2.1 - Client

> 💡Idea! Create a new issue in your repository, where you can track the completion of these items. Just copy paste them into the issue and mark them as complete as you go. Make sure you copy the source from README.md not the preview text.

### HOME SCREEN

- [ ] User must see only the "active" posts
- [ ] User must see the list of blog post categories, where each category points to UI showing only posts of that category
- [ ] User must see the list of blog post tags, where each tag points to UI showing only posts of that category
- [ ] User must see the history of blog posts, showing month and year, where each moth, year tuple points to UI showing only posts of that category
- [ ] Tags and history items shown are only considered from active posts
- [ ] The list shows the following items:
  - blog title, pointing to detail page
  - short description
  - date
  - image
  - tags
  - likes
  - views
- [ ] User must be able to switch between dark and light theme with a button
      The dark theme setting is stored in the "data-theme" attribute on html element
- [ ] There is a search functionality that filters blogs based on string found in title or description, redirecting to search page

### DETAIL SCREEN

- [ ] Detail page shows the same items as list item, but the short description is replaced by formatted long description
- [ ] Detail text is stored as Markdown, which needs to be converted to HTML

### CATEGORY SCREEN

- [ ] Displays posts from the category from url (e.g. /category/react)
- [ ] Displays "0 Posts" when search does no posts have that category

### HISTORY SCREEN

- [ ] Displays posts from year and month specified in the url (e.g. /history/2024/12)
- [ ] Displays "0 Posts" when no posts are from that given month and year

### TAG SCREEN

- [ ] Displays posts with the tag url (e.g. /tags/dev-tools)
- [ ] Displays "0 Posts" when search does no posts have that tag

### SEARCH SCREEN

- [ ] Displays results based on search string stored in the query string (e.g. /search?q=Fat)
- [ ] Displays "0 Posts" when search does not find anything

## 👾 Requirements - Assignment 2.2 - Admin

> 💡Idea! Create a new issue in your repository, where you can track the completion of these items. Just copy paste them into the issue and mark them as complete as you go. Make sure you copy the source from README.md not the preview text.

### ADMIN HOME SCREEN

- [ ] Shows Login screen if not logged
- [ ] Shows List screen if logged
- [ ] There must be a logout button
- [ ] Clicking the logout button logs the user out
- [ ] Authenticate the current client using a hard-coded password
- [ ] Use a httpOnly cookie and name it "auth_token" to remember the signed-in state.

### ADMIN LIST SCREEN

- [ ] Shows both active and inactive posts
- [ ] Article list is only accessible to logged-in users.
- [ ] There is a filter screen that allows filtering posts by:
  - [ ] Title or content
  - [ ] Tags
  - [ ] Date
  - [ ] Visibility
- [ ] You can combine multiple filters
- [ ] Users can sort posts by name or creation date, both ascending and descending
- [ ] The post list displays a list of filtered items with the following information:
  - [ ] The list post item displays the image, title of the post
  - [ ] The list post items display metadata such as category, tags, and "active" status.
  - [ ] The active status is a button that, on click, just displays a message
- [ ] Clicking on the title takes the user to the MODIFY SCREEN, allowing the user to modify the current post
- [ ] There is a button to create new posts
- [ ] Clicking on the "Create Post" button takes the user to the CREATE SCREEN

### ADMIN CREATE and UPDATE screen

Both create and update screens display the same UI, but the update screen preloads the data into fields.

- [ ] Page is only accessible to logged in user
- [ ] There must be the following fields which must be validated for errors:
  - [ ] Title (`input, string`)
  - [ ] Description (textarea, string, max 200 characters)
  - [ ] Content (`textarea, markdown string`)
  - [ ] Tag List (`input, string`) shows a comma-separated list of tags.
  - [ ] Image URL (`input, URL`)
- [ ] Under the Description is a "Preview" button that replaces the text area with a rendered markdown string and changes the title to "Close Preview".
- [ ] When the preview is closed, the cursor must be in the same position as before opening the preview.
- [ ] Under the image input is an image preview.
- [ ] User can click on the "Save" button that displays an error ui if one of the fields is not specified or valid.

## 👾 Requirements: Assignment 2.3

### BACKEND / CLIENT

- [ ] Data is loaded from the database backend
- [ ] Data filtering is done server side and only filtered data is sent to client
- [ ] Each visit of the page increases the post "views" count by one
- [ ] User can "like" the post on the detail screen, NOT on the list screen (hint, create the `/api/likes/route.ts` route and implement the needed handlers)
- [ ] Liking the post increases the like count by one
- [ ] User can like the post only once (use IP)
- [ ] User can unlike the post, decreasing the like post by one

### BACKEND / ADMIN / AUTHORISATION

> For these two requirements we do not have End 2 End tests and will be checked manually.

- [ ] The password is checked on server in the `/api/auth` route
- [ ] The POST method is used for login
- [ ] The DELETE method is used for logout
- [ ] The admin home page checks for the presence of JWT token and verifies it, if the token does not exist or is invalid, displays the login control.

### BACKEND / ADMIN / LIST SCREEN

- [ ] Logged in user can activate / deactivate a post clicking on the activate button, automatically saving changes

### BACKEND / ADMIN / UPDATE SCREEN

- [ ] Logged in user can save changes to database, if the form is validated

### BACKEND / ADMIN / CREATE SCREEN

- [ ] Logged in user can create a new post to the database, if the form is validated

## Prerequisites

Before installing the project, make sure you have:

- Node.js 18 or newer
- pnpm
- Turborepo CLI
- Access to a PostgreSQL database

```
pnpm add -g turbo
```

## Installing the project

Install dependencies from the root of the project:

```
pnpm i
```

To run end to end tests, install the Playwright browsers:

```
pnpm --filter @repo/playwright exec playwright install
```

As part of the initial setup, generate the Prisma client, run migrations, build the database package, and seed the database:

```
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:migrate:dev
pnpm --filter @repo/db build
node -e "import('./packages/db/dist/seed.js').then((m) => m.seed())"
```

## Environment

Copy the example environment files and fill in the values:

```
cp apps/admin/.env.example apps/admin/.env
cp packages/db/.env.example packages/db/.env
```

Required environment variables:

- `DATABASE_URL` - database connection string used by the app
- `POSTGRES_PRISMA_URL` - PostgreSQL connection string used by Prisma migrations
- `POSTGRES_URL_NON_POOLING` - direct PostgreSQL connection string used by Prisma
- `PASSWORD` - admin login password
- `JWT_SECRET` - secret used to sign and verify admin auth tokens

For local development, these values can point to a local or hosted PostgreSQL database. Do not commit real secrets to the repository.

## Running the project

Run both applications from the root of the project:

```
turbo dev
```

This will run:

- Client application at [http://localhost:3001](http://localhost:3001)
- Admin application at [http://localhost:3002](http://localhost:3002)

## Live deployment

This project contains two Next.js applications:

- Client app: `apps/web`
- Admin app: `apps/admin`

When deploying, create a separate deployment for each app and set the root directory to the matching app folder. Both apps also depend on the shared workspace packages in `packages/*`, so the deployment platform must install from the monorepo root using pnpm.

Recommended deployment settings:

- Install command: `pnpm install`
- Build command for client: `pnpm --filter @repo/web build`
- Build command for admin: `pnpm --filter @repo/admin build`
- Output: Next.js default output
- Node.js version: 18 or newer

Before the first live deployment, create a production PostgreSQL database and add the production environment variables to the deployment platform:

- `DATABASE_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `PASSWORD`
- `JWT_SECRET`

Run database migrations against the production database before using the live site:

```
pnpm --filter @repo/db db:migrate:deploy
```

If the live database needs starter content, build and run the seed script once:

```
pnpm --filter @repo/db build
node -e "import('./packages/db/dist/seed.js').then((m) => m.seed())"
```

Live URLs:

- Client: https://blog-post-liam-22113796-web.vercel.app/
- Admin: https://blog-post-liam-22113796-admin-wine.vercel.app/
## Running tests

To run the tests please run, you have two options.

Tests that run through the GitHub Actions workflow in `.github/workflows/grading.yml` use a separate test database from the production database. This keeps production data maintained and prevents grading/test runs from modifying live production records.

### Running Tests in Console

If you only wish to visualise the test results in console, please run the following command in the root of your project for the first part of the second assignment (i.e. Assignment 2.1):

```
turbo test-1
```

This launches the turbo console UI similar to below, where you can swap between different projects:

![Turbo UI](https://skillpies.s3.ap-southeast-2.amazonaws.com/courses/full-stack-development/sections/assignment-2-1-blog-client-in-advanced-react/Screenshot%202025-02-05%20at%2014.30.45.png)

> ⚠️⚠️ Make sure that ALL tests pass!

If you want to run the tests for second part (i.e. Assignment 2.2), third part (i.e. Assignment 2.3), or custom feature tests separately, run these commands:

```
turbo test-2 // or
turbo test-3 // or
turbo test-4
```

If you want to run all tests, please run

```
turbo all:test
```

### Running Tests in UIs

The packaged tests framework also have the possibility of visually represent your tests for nicer view of test results. To see the UIs, run this command instead of `turbo test-1`:

```
turbo dev:test-1
```

This will launch the End to End testing framework Playwright's test UI similar to below, please use the Play buttons to run individual tests:

![Playwright UI](https://skillpies.s3.ap-southeast-2.amazonaws.com/courses/full-stack-development/sections/assignment-2-1-blog-client-in-advanced-react/Screenshot%202025-02-05%20at%2014.40.35.png)

It also launches the unit and integration test framework Vitest's UI, similar to below. Here, you can also use the play buttons to execute individual tests!

![Vitest UI](https://skillpies.s3.ap-southeast-2.amazonaws.com/courses/full-stack-development/sections/assignment-2-1-blog-client-in-advanced-react/Screenshot%202025-02-05%20at%2014.46.31.png)

## Project structure

The project is a pnpm/Turborepo monorepo split into applications, shared packages, tests, and GitHub workflow configuration.

**Applications**

Contains the following web applications:

- **apps/admin** - Admin website for creating, editing, activating, and deactivating blog posts.
- **apps/web** - Client website for browsing, searching, viewing, liking, and filtering blog posts.

**Packages**

Contains the following packages with shared code and configurations:

- **packages/db** - Prisma schema, database client, migrations, and seed utilities.
- **packages/env** - Shared environment variable validation for the web and admin apps.
- **packages/ui** - Shared UI components used by the admin and client apps.
- **packages/utils** - Shared utility functions used across the workspace.
- **packages/eslint-config** - Shared ESLint configuration.
- **packages/tailwind-config** - Shared Tailwind CSS configuration.
- **packages/typescript-config** - Shared TypeScript configuration.

**Tests**

Contains the following test applications:

- **tests/playwright** - Playwright end-to-end tests for the client, admin, backend, and custom feature requirements.
- **tests/storybook** - Storybook instance for developing and testing React components in isolation.

**GitHub Actions**

Contains the automated grading workflow:

- **.github/workflows/grading.yml** - Runs the autograding test suite in GitHub Actions using the test database, separate from the production database.

## Application Structure

The client application comes with a predefined router and component/utility structure.
The admin application is intentionally more bare and contains more functionality and structure for you to complete.
