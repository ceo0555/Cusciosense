# Quick Start Guide - Alfanumrik SchoolOS

Get your School ERP & LMS up and running in minutes!

## 🎯 Prerequisites Check

Before you begin, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ PostgreSQL 15+ installed and running
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

## ⚡ Super Quick Start (5 Minutes)

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url> schoolos
cd schoolos

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in a new terminal)
cd ../frontend
npm install
```

### Step 2: Database Setup (1 minute)

```bash
# Create database
createdb schoolos

# Or using psql
psql -U postgres -c "CREATE DATABASE schoolos;"
```

### Step 3: Configure Environment (1 minute)

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Minimal required configuration in `.env`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=schoolos
JWT_SECRET=your-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
```

**Frontend (.env.local):**
```bash
cd frontend
cp .env.example .env.local
```

Should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Step 4: Run the Application (1 minute)

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

🎉 **You're ready!**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- API Documentation: http://localhost:3001/api/docs

## 🧪 Test Login

Use these demo credentials:

```
Email: admin@schoolos.com
Password: admin123
```

(Note: You'll need to create this user in the database first, or use the register page)

## 📝 Creating Your First Admin User

### Option 1: Using the API

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@schoolos.com",
    "password": "admin123",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "super_admin"
  }'
```

### Option 2: Using the Register Page

1. Go to http://localhost:3000/auth/register
2. Fill in the form:
   - Email: admin@schoolos.com
   - Password: admin123
   - First Name: Super
   - Last Name: Admin
   - Role: Parent (then manually change in DB to super_admin)

### Option 3: Direct Database Insert

```sql
-- Connect to database
psql -U postgres -d schoolos

-- Insert super admin user
INSERT INTO users (id, email, password_hash, first_name, last_name, role_id, is_active, is_verified, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@schoolos.com',
  '$2b$10$YourHashedPasswordHere', -- Use bcrypt to hash 'admin123'
  'Super',
  'Admin',
  1, -- super_admin role
  true,
  true,
  NOW(),
  NOW()
);
```

## 🏫 Creating Your First School

After logging in as super admin:

1. Navigate to **Schools** in the sidebar
2. Click **Add New School**
3. Fill in:
   - Name: ABC International School
   - Slug: abc-school
   - Email: school@abc.com
   - Phone: +91 1234567890
   - Board: CBSE
   - Max Students: 500
   - Max Teachers: 50

## 👨‍🏫 Adding Teachers and Students

### Add a Teacher

1. Go to **Teachers** section
2. Click **Add Teacher**
3. Fill in the form
4. Teacher receives email with login credentials

### Add a Student

1. Go to **Students** section
2. Click **Add Student**
3. Fill in admission details
4. Assign to a class
5. Link to parent account

## 📚 Creating Your First Course

1. Navigate to **Courses**
2. Click **Create Course**
3. Fill in:
   - Title: Introduction to Mathematics
   - Subject: Mathematics
   - Class: Class 10
   - Description: Basic algebra concepts
4. Add course materials (videos, PDFs, etc.)

## 📝 Assigning Homework

1. Go to **Homework** section
2. Click **Create Assignment**
3. Fill in:
   - Title: Chapter 1 Exercise
   - Subject: Mathematics
   - Class: Class 10
   - Due Date: 7 days from now
   - Max Marks: 100
   - Submission Types: Text, PDF, Images

## 🔧 Troubleshooting

### Backend won't start

**Error:** "Cannot find module..."
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error:** "Database connection failed"
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Ensure database exists: `psql -l | grep schoolos`

### Frontend won't start

**Error:** Module not found
```bash
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

**Error:** API connection failed
- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Database Migration Issues

```bash
cd backend
# Reset database (WARNING: deletes all data)
npm run migration:revert
npm run migration:run
```

## 📱 Next Steps

Now that you have the basic setup running:

1. ✅ Explore the dashboard
2. ✅ Create classes and subjects
3. ✅ Add teachers and students
4. ✅ Set up timetable
5. ✅ Configure fee structures
6. ✅ Test homework submission
7. ✅ Create exams and enter grades
8. ✅ Set up payment gateway (Razorpay)
9. ✅ Configure email notifications
10. ✅ Customize school settings

## 🎓 Learning Resources

- **Full Documentation**: See [README.md](./README.md)
- **System Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Database Design**: See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **API Reference**: See [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- **API Playground**: http://localhost:3001/api/docs

## 💡 Pro Tips

1. **Use Swagger UI** for testing API endpoints quickly
2. **Enable DB logging** during development: `DB_LOGGING=true`
3. **Use hot reload** for faster development
4. **Check browser console** for frontend errors
5. **Monitor backend logs** for API errors

## 🆘 Getting Help

- Check the [README.md](./README.md) for detailed documentation
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Look at example code in the modules
- Search existing issues on GitHub
- Join our Discord community
- Email: support@schoolos.com

## 🚀 Ready for Production?

When you're ready to deploy:

1. Read the [Deployment Guide](./README.md#deployment)
2. Set up production environment variables
3. Configure SSL certificates
4. Set up backup systems
5. Enable monitoring and logging
6. Run security audit
7. Load test your application

## 🎉 Success!

You now have a fully functional School Management System! 

Start exploring and customizing it for your needs. Don't forget to:
- ⭐ Star the repository
- 🐛 Report issues
- 💡 Suggest features
- 🤝 Contribute back

Happy coding! 🎓
