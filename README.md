# Welcome to English at Large

Hello and welcome! We're going to have a great time developing this project over the next year. Follow the instructions below.

## Getting Started

First, after cloning the repository, run `npm i` to install all packages. This sets up the infrastructure and everything you need for the site to work and stores it on a folder called `node_modules`.

You'll also want some packages on VSCode:

- Live Share
- Simple React Snippets
- ESLint
- Prettier - Code Formatter
- Prettier ESLint

Run `npx prisma generate` to generate your Prisma Client. You'll need to run this if the schema gets updated, but Clarence will let you know when that happens.

## Development

To actually run the site, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Practices and Techniques:

These are some of the practices and style guidelines to maintain for consistency in this codebase.

### Components

To add a new component, create a new file in components that is the name of the component. Then define the types for the component at the top of the component, then use it to type the component's `props`. To use each field of the props within the component, destructure the `props` field.

```typescript
interface ComponentProps {
  prop1: prop1Type;
  prop2: prop2Type;
}

/**
 * Use JSDoc styling right above the header if this component is important.
 * 
 * Also, the name of the component should capitalized, and the file should be the same. 
 * */
const Component = (props: ComponentProps) => {
  const { prop1, prop2 } = props;
}
```

### Conditional Rendering 

Use it when you can, rather than multiple `return` statements that can be hard to track. If there are many conditions, then either use a switch statement or bite the bullet and use a bunch of ternary operators. Track each state or condition with an enum. If you want to render nothing, then use `null` as the falsy value.
```typescript

// use null instead of an empty div, etc.
{ condition ? <div>"render if true"</div> : null}

```
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!