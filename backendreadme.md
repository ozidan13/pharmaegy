# pharmaegy Backend API

This is the backend API for the pharmaegy platform, connecting pharmacists with pharmacy owners in Egypt. The platform facilitates recruitment, CV management, and product listing with a focus on near-expiry cosmetics.

## ✨ Features

### Authentication & Security
- 🔐 JWT-based authentication system
- 🔑 Role-based access control (Pharmacist, Pharmacy Owner & Admin)
- 🔄 Session management with refresh tokens
- 🛡️ CSRF protection and security headers
- 👑 Admin authentication with full platform privileges

### User Management
- 👤 Profile management for pharmacists and pharmacy owners
- 📍 Location-based user discovery
- 🔍 Advanced search with filters
- 📊 Dashboard analytics
- 👑 Admin user management with subscription control
- 💳 Payment request management and confirmation system

### Store Service
- 🏪 Product catalog management
- 📦 Inventory and stock tracking
- ⏳ Near-expiry product alerts
- 📊 Sales and inventory reports

### Job & Recruitment
- 📄 CV management for pharmacists
- 🔍 Job posting and application system
- 📍 Location-based job search
- 💬 Application tracking system

### Admin & Payment System
- 👑 Comprehensive admin dashboard with platform statistics
- 💳 Payment request workflow for subscription upgrades
- 🏦 Wallet configuration management
- ✅ Payment confirmation and rejection system
- 📊 Admin analytics and user management

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with PostGIS extension
- **ORM:** Prisma
- **Authentication:** JWT with refresh tokens
- **Validation:** Zod with Express Validator
- **File Upload:** Multer with S3 integration
- **Search:** Full-text search with PostgreSQL
- **Testing:** Jest and Supertest
- **Documentation:** OpenAPI/Swagger

## 🏗 Project Structure

```
backend/
├── src/
│   ├── api/                  # API routes and controllers
│   │   ├── auth/            # Authentication endpoints (including admin)
│   │   ├── pharmacists/     # Pharmacist-related endpoints
│   │   ├── pharmacies/      # Pharmacy owner endpoints
│   │   ├── store/           # Product store endpoints
│   │   ├── admin/           # Admin management endpoints
│   │   └── subscriptions/   # Subscription and payment endpoints
│   ├── config/              # Configuration files
│   ├── middleware/          # Custom middleware
│   ├── types/               # TypeScript type definitions
│   └── server.ts            # Main application entry point
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── admin-seed.js       # Admin user seeding script
│   └── migrations/         # Database migrations
├── .env.example            # Environment variables example
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL (v12+)
- PostGIS extension

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (copy .env.example to .env and update values)
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API documentation.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build TypeScript files
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
- `prisma:migrate`: Run database migrations
- `prisma:studio`: Open Prisma Studio

## 🧪 Testing

To run tests:
```bash
npm test
```

## 🛡️ Security

- JWT authentication
- Input validation
- Rate limiting
- CORS protection
- Helmet for security headers

## 📦 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start in production:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.