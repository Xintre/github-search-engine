![CI](https://github.com/xintre/github-search-engine/actions/workflows/ci.yml/badge.svg)

This is a [Next.js](https://nextjs.org) Github Search Engine SPA (Single-Page App) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) which is responsible for:
- displaying a list of users
  - possibility to filter them by type (organisation, user, all)
  - possibility to search for a specific user based on their
    - username
    - email
    - name
  - linking to their GH profiles
  - linking to a dedicated in-app page with user details with a list of repositories
- displaying user details with a list of repositories
  - displaying a list of repositories
  - displaying the details of a user
    - their name
    - their username
    - (if present) their bio
    - (if present) a link to their website / blog
    - number of: repositories, followers, following
    - date of creation of account

The app navigation displays a lock icon button that allows you to clear the cookie saving the GH access token and log you out. It also has a 'go back' button.

All screens use pagination and server-side filtering (if filtering is applicable).

## Getting Started

Install dependencies with: 
```bash
yarn
```

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Pass a GitHub token. It will be save automatically in a cookie 🍪.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Routes

The app offers the following routes:

1. When logged in

-   `/` - home screen, searchable users UI
-   `/users/<username>` - list of user's repositories

2. When not logged in

-   `any route` - screen to log in (paste your GH API token)

## Tech stack

### Languages & frameworks

-   [Next.js](https://nextjs.org) - React framework
-   [React](https://reactjs.org) - JavaScript library for building user interfaces
-   [TypeScript](https://www.typescriptlang.org) - JavaScript superset


### Libraries

- [TanStack/react-query](https://react-query.tanstack.com) - data fetching and caching library; underlying connectivity with REST endpoints implemented using `fetch` in [`utils/apiClient.ts`](utils/apiClient.ts)
- `@mui/material` - Material-UI components
- `@mui/icons-material` - Material-UI icons
- `@mui/x-data-grid` - Material-UI data grid component
- `@mui/material-next-js` - Material-UI integration with Next.js
- `lodash` - utility library
- `moment` - for parsing & formatting dates
- `react-cookie` - for handling cookies

### Tooling

- GH Actions for CI
- `eslint` & `prettier` for code linting and formatting
- `lefthook` for pre-commit & pre-push hooks
- `jest` and `react-testing-library` with `@testing-library/user-event` for testing

## Tests

Tests include only one component and one unused component to demonstrate my skills in testing.

The tests are run automatically on pre-push event & by the CI workflow.
