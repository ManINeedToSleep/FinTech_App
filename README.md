# Fintech Financial Bank

A modern financial management application with Nordic-inspired design, built with Next.js 14, TypeScript, and Prisma. Features a cosmic aurora theme, real-time financial tracking, and comprehensive financial tools.

## ✨ Features

### Core Features
- 🔐 Secure JWT authentication
- 💳 Transaction management (deposits, withdrawals, transfers)
- 📊 Interactive financial analytics with Recharts
- 🧮 Comprehensive financial calculators
- 🌌 Nordic-inspired cosmic design system

### Financial Tools
- 💰 Savings calculator
- 🏦 Loan calculator
- 📈 Investment planner
- 💵 Tax calculator
- 🏠 Mortgage calculator
- 🎯 Retirement planner

### Design System
- 🌠 Aurora borealis animations
- ⭐ Twinkling star effects
- 🎨 Nordic color palette
- 🌊 Glass-morphism UI elements
- 📱 Fully responsive design

## 🎨 Theme Colors
```css
:root {
  --aurora-green: #7CFCD0;
  --nordic-blue: #1E3D59;
  --frost-blue: #E2E8F0;
  --northern-pink: #FF61A6;
  --snow-white: #F7F9FC;
}
```

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Authentication**: JWT + bcrypt
- **Charts**: Recharts
- **Animations**: CSS + React
- **Icons**: FontAwesome
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fintech-bank.git
cd fintech-bank
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
# Database (Neon)
DATABASE_URL="postgresql://user:password@endpoint/database"
DIRECT_URL="postgresql://user:password@endpoint/database"

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

4. Initialize database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run development server:
```bash
npm run dev
```

## 📊 Database Schema

```prisma
model User {
  id           Int           @id @default(autoincrement())
  email        String        @unique
  username     String
  passwordHash String
  firstName    String?
  lastName     String?
  accounts     Account[]
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Account {
  id          Int           @id @default(autoincrement())
  accountType AccountType
  accountName String
  balance     Float         @default(0)
  userId      Int
  user        User          @relation(fields: [userId], references: [id])
  transactions Transaction[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Transaction {
  id          Int      @id @default(autoincrement())
  type        TransactionType
  amount      Float
  description String
  accountId   Int
  account     Account  @relation(fields: [accountId], references: [id])
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
}

model Category {
  id           Int           @id @default(autoincrement())
  name         String
  type         TransactionType
  icon         String
  transactions Transaction[]

  @@unique([name, type])
}

enum AccountType {
  CHECKING
  SAVINGS
  INVESTMENT
}

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  TRANSFER
}
```

## 🔒 API Routes

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/user` - Get user profile

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions/deposit` - Make deposit
- `POST /api/transactions/withdraw` - Make withdrawal
- `POST /api/transactions/transfer` - Make transfer
- `POST /api/transactions/expense` - Record expense

## 🌟 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.
``` 