To run dev server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Environment Setup

Before running the development server, create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=

# NextAuth
AUTH_SECRET=

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Vercel
BLOB_READ_WRITE_TOKEN=
VERCEL_OIDC_TOKEN=
```

See `.env.example` for the template.