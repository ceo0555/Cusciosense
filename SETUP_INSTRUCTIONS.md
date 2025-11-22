# Quick Setup Instructions - Alfanumrik SchoolOS

Follow these steps to get the project running locally.

## 🚀 Quick Start (5 minutes)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd schoolos
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database URL
# Minimum required: DATABASE_URL and JWT_SECRET

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start backend
npm run start:dev
```

Backend runs on: http://localhost:5000

### 3. Setup Frontend

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start frontend
npm run dev
```

Frontend runs on: http://localhost:3000

### 4. Access Application

Open http://localhost:3000 in your browser.

## 📝 Minimum Environment Variables

### Backend (.env)

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://postgres:password@localhost:5432/schoolos?schema=public"

# JWT (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Everything else can use defaults
NODE_ENV=development
PORT=5000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 🗄️ Database Setup Options

### Option 1: Local PostgreSQL (Recommended for Development)

```bash
# Install PostgreSQL on your system
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/

# Create database
createdb schoolos

# Or using psql
psql -U postgres
CREATE DATABASE schoolos;
```

### Option 2: Docker PostgreSQL

```bash
# Create docker-compose.yml in project root
docker-compose up -d

# docker-compose.yml content:
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: schoolos
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 3: Cloud Database (Free Tier)

1. **Supabase**: https://supabase.com (Free tier available)
2. **Neon**: https://neon.tech (Free tier with 0.5GB)
3. **ElephantSQL**: https://elephantsql.com (Free tier 20MB)

Get the connection URL and use it in DATABASE_URL.

## 🧪 Test with Sample Data (Optional)

```bash
cd backend

# Create seed file: prisma/seed.ts
# Run seed
npm run prisma:seed
```

## 📱 Test User Roles

Create users via the registration page or directly in the database:

```sql
-- Super Admin
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
VALUES ('admin@schoolos.com', '$2b$10$...', 'Admin', 'User', 'SUPER_ADMIN', true);

-- You'll need to hash the password using bcrypt
```

Or create via API:

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin@123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "SUPER_ADMIN"
  }'
```

## 🔧 Common Issues

### Issue: Prisma Client Error

```bash
# Solution: Regenerate Prisma Client
cd backend
npm run prisma:generate
```

### Issue: Port Already in Use

```bash
# Solution: Change port in .env
# Backend: PORT=5001
# Or kill the process using the port
lsof -ti:5000 | xargs kill -9
```

### Issue: Database Connection Failed

1. Check if PostgreSQL is running
2. Verify DATABASE_URL is correct
3. Ensure database exists
4. Check username/password

### Issue: CORS Error

1. Verify FRONTEND_URL in backend .env
2. Check NEXT_PUBLIC_API_URL in frontend .env.local
3. Restart both servers

## 📚 Next Steps

1. Explore the API documentation: [API_ENDPOINTS.md](./API_ENDPOINTS.md)
2. Read the architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Understand the database: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
4. Deploy to production: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 Need Help?

- Check documentation files
- Open an issue on GitHub
- Contact: support@alfanumrik.com

---

Happy coding! 🎉
