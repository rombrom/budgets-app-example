# Team Budgets

Create budgets for your team! Allow team members to register purchases.

Built in SvelteKit, with Drizzle ORM, Supabase.

**Required system software:**

- Node v22
- NPM v10
- Docker version 24.0.0

1. Copy `.env.example` to `.env`
2. `npm run dev`
3. `npm run db:migrate`

## Assessment Requirements

The following is an excerpt of the exercise requirements.

> - A team member should be able to view the available budgets and the remaining balance.
> - A team member can execute a transaction by specifying the amount. The system should automatically apply the transaction to the ‘optimal’ available budget.
> - Include documentation and tests.
>   ...
>   Some constraints which may help you get started:
> - A team-member can only be part of a single team.
> - A purchase can only be made if a single budget has enough funds to cover the whole
>   purchase.
>
> Or if you want an additional challenge:
>
> - An admin can see the history of budgets over time.

I haven't completed some fully for the sake of running into excessive overtime.
I had to iterate on this project over a couple of days, doing small snippets
because I couldn't afford a long stretch due to other obligations. In total of
code-time I would estimate this took about 5-6, debug time maybe one hour, 1.5
extra. Don't judge me. I love building for the web, I've enjoyed the exercise thoroughly.

### Unmet & Omitted

- Full user session and permission integration:

  Something which would complicate dev and testing. Implementation open to discussion
  w/r business requirements.

- "The system should automatically apply the transaction to the ‘optimal’ available budget."

  What exactly is the `optimal` available budget? There are businesses which
  require budgets to be tightly checked. In this case I assumed the user as a
  part of the "system" which would certainly, using common sense and logic, to
  be able to select the appropriate and `optimal` budget for their purchase.

- At its current state I find the UI severely lacking. It'd be something I might
  still do just for fun. For a better insight into what this stack can build, check out [rombrom.com/projects/coin-fun](https://www.rombrom.com/projects/coin-fun/).

## Architecture

The initial setup is built towards the idea: _how can I create a budgets application
which would leave me with plenty of flexibility to build features upon._

I've enjoyed working with SvelteKit and Svelte a lot. It's fast to scaffold with and
capable to scale towards a great UX. Tailwind and ShadCN-Svelte allow you to get a
decent UI fast. Leveraging Supabase as a great prototyping companion
offers a way to carry business logic close to the database (PostgreSQL). Drizzle as an
ORM to easily setup queries.

Superforms was a mistake. Should've opted for native and own implementation.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Testing

Playwright is the E2E test runner. Most bang for your buck w/r testing full-circle.
Once components start to crystallize you could expand with Storybook for UI/A11y, same for core business logic
where I'd chose Vitest.

1. `npm run test`
2. Get UI up and running: `npx run test --ui`

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
