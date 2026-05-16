# Orium CRM – Full-Stack Credit Repair Agency Management

A production-ready CRM platform for credit repair agencies. Manage clients, track disputes, generate letters, and monitor credit score improvements in one powerful dashboard.

## Features

- **Client Management**: Track all client details, credit profiles, and repair progress
- **Dispute Tracking**: Monitor bureau disputes and resolution history
- **Letter Generation**: AI-powered dispute letters with templates and mailing tracking
- **Analytics & ROI**: Real-time metrics on credit score improvements and agency revenue
- **Stripe Integration**: Seamless billing and subscription tracking
- **Team Collaboration**: Multi-user support with role-based access for agencies

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS 3
- **Backend**: Next.js API Routes + tRPC for type-safe RPC
- **Database**: PostgreSQL (Vercel Postgres) + Prisma ORM
- **Authentication**: NextAuth.js v5 (email magic links + Google OAuth)
- **State Management**: Zustand + TanStack Query
- **Payments**: Stripe API integration
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Goatkenziee/orium-crm.git
cd orium-crm
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=your_vercel_postgres_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
orium-crm/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── clients/       # Client management
│   │   ├── disputes/      # Dispute tracking
│   │   ├── letters/       # Letter management
│   │   └── analytics/     # Revenue & metrics
│   ├── api/               # API routes & webhooks
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── trpc/          # tRPC endpoints
│   │   └── webhooks/      # Stripe webhooks
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
├── lib/                   # Utilities & configurations
│   ├── db.ts             # Prisma client
│   ├── stripe.ts         # Stripe helpers
│   └── auth.ts           # NextAuth config
├── schemas/              # Zod validation schemas
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## Database Schema (Prisma)

Key models:
- **User**: Agency owner/team members
- **Agency**: Company account
- **Client**: Individual in credit repair program
- **Dispute**: Individual dispute on credit bureau
- **Letter**: Dispute letter record
- **CreditScore**: Historical score tracking
- **Payment**: Stripe transaction log

## API Endpoints

All API endpoints use tRPC for type safety. Key routes:
- `POST /api/auth/signin` – Email magic link auth
- `POST /api/auth/callback` – OAuth callback
- `GET /api/trpc/clients` – Fetch clients
- `POST /api/trpc/disputes` – Create dispute
- `POST /api/webhooks/stripe` – Stripe event handler

## Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Follow the prompts. Vercel will automatically:
1. Connect your GitHub repo
2. Detect Next.js configuration
3. Set up environment variables
4. Deploy on every push to main

### Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add the same variables from `.env.local`

## Roadmap

- [ ] Complete Prisma schema & database migrations
- [ ] Implement NextAuth authentication flow
- [ ] Build client CRUD pages
- [ ] Build dispute tracker with status updates
- [ ] AI-powered letter generation
- [ ] Credit score history & visualization
- [ ] Stripe billing integration
- [ ] Team & role management
- [ ] Advanced analytics dashboard
- [ ] Email notifications & alerts

## Contributing

Contributions welcome. Please open an issue or PR with your improvements.

## License

MIT – See LICENSE for details.

## Support

Questions? Contact support@oriumai.com or open an issue on GitHub.

---

**Built with ❤️ by Alexander & the Orium team**
