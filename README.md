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
# Database
DATABASE_URL=your_neon_database_url_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your_auth_secret_here

# Google OAuth
AUTH_GOOGLE_ID=your_google_client_id_here
AUTH_GOOGLE_SECRET=your_google_client_secret_here
```

See `.env.example` for the template. Ask your team lead for the actual credentials.