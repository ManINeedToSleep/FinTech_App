# FinTech App

A modern financial management application built with Next.js, TypeScript, and Prisma. Features include transaction management, financial calculators, and analytics.

## Features

- 🔒 Secure user authentication
- 💰 Transaction management (deposits, withdrawals, expenses)
- 📊 Financial analytics and visualizations
- 🧮 Financial calculators
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fintech-app.git
cd fintech-app
```

2. Install dependencies:
```bash
npm install
``` 

3. Set up your environment variables by creating a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/fintech_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
``` 

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following Prisma schema:

```prisma
model User {
  id           Int           @id @default(autoincrement())
  email        String        @unique
  username     String
  passwordHash String
  balance      Float         @default(0)
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Transaction {
  id          Int      @id @default(autoincrement())
  type        String   // 'deposit' | 'withdrawal' | 'expense'
  amount      Float
  description String
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}
```

## API Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/user` - Get user details
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions/deposit` - Create deposit
- `POST /api/transactions/withdraw` - Create withdrawal
- `POST /api/transactions/expense` - Create expense

## Project Structure

```
fintech-app/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── calculator/    # Financial calculators
│   │   └── analytics/     # Analytics page
│   ├── components/        # Reusable components
│   ├── lib/              # Utility functions
│   └── styles/           # Global styles
├── prisma/
│   └── schema.prisma     # Database schema
├── public/              # Static files
└── package.json
```

## Technologies Used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [JWT](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS team for the utility-first CSS framework
``` 