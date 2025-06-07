# Database Connection Configuration Guide

This guide explains the updated database connection configuration for the PharmaEgy project using Supabase.

## Overview

The project now supports two connection methods:
1. **Prisma ORM** - Primary database connection for server-side operations
2. **Supabase Client** - Optional client for additional features and frontend usage

## Environment Variables

Ensure the following environment variables are set in both your `.env` file and Vercel deployment:

```env
# Database Connection (Prisma)
DATABASE_URL="postgresql://postgres:LCS7X%23m%25QJ%3FSf%269@db.cxjbsnmcygmeqyctzlmk.supabase.co:6543/postgres?schema=public&sslmode=require&pgbouncer=true"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://cxjbsnmcygmeqyctzlmk.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4amJzbm1jeWdtZXF5Y3R6bG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzQ2NjksImV4cCI6MjA2Mzg1MDY2OX0.gaoMZSct_4dRFmWKviLUeCV3OAWuyNX9VhST9V09kZ8"

# JWT Configuration
JWT_SECRET="pharmalink-dev-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="production"
PORT="3000"
NEXT_TELEMETRY_DISABLED="1"
```

## Connection Methods

### 1. Prisma Connection (Primary)

The main database connection uses Prisma ORM with the Supabase Connection Pooler:

- **Port 6543**: Transaction mode pooler (recommended for Vercel/serverless)
- **pgbouncer=true**: Enables connection pooling optimization
- **sslmode=require**: Ensures secure connections

**Usage:**
```typescript
import { prisma } from '@/lib/prisma';

// Example usage
const users = await prisma.user.findMany();
```

### 2. Supabase Client (Optional)

For additional features like real-time subscriptions, auth, or storage:

**Usage:**
```typescript
import { supabase } from '@/lib/supabase';

// Example usage
const { data, error } = await supabase
  .from('users')
  .select('*');
```

## Deployment Instructions

### Vercel Deployment

1. **Add Environment Variables in Vercel Dashboard:**
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add all the variables listed above

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   - Copy the `.env` file with the updated configuration

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. **Try Direct Connection:**
   - Uncomment the alternative DATABASE_URL in `.env`
   - Use port 5432 instead of 6543

2. **Check Supabase Database Status:**
   - Ensure your Supabase project is not paused
   - Verify the database is running in the Supabase dashboard

3. **Verify Environment Variables:**
   - Ensure all variables are correctly set in Vercel
   - Check for any URL encoding issues

### Common Error Messages

- **"Can't reach database server"**: Database connection issue
- **"PrismaClientInitializationError"**: Prisma client configuration problem
- **"Invalid credentials"**: Authentication issue (expected for wrong login)

## Connection String Formats

### Transaction Mode (Recommended for Vercel)
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres?schema=public&sslmode=require&pgbouncer=true
```

### Direct Connection (Alternative)
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public&sslmode=require
```

### Session Mode (For persistent connections)
```
postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

## Security Notes

- Never commit sensitive environment variables to version control
- Use strong, unique passwords for production
- Regularly rotate JWT secrets and database passwords
- Enable Row Level Security (RLS) in Supabase for additional protection

## Support

If you continue to experience issues:
1. Check Supabase status page
2. Verify network connectivity
3. Review Vercel deployment logs
4. Contact Supabase support if database-specific issues persist