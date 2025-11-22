# 🚀 SchoolOS - Quick Start Guide

Get SchoolOS up and running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

## 1️⃣ Quick Setup

```bash
# Clone the repository
git clone https://github.com/your-username/schoolos.git
cd schoolos

# Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Setup Database
npm run prisma:generate
npm run prisma:migrate

# Setup Frontend
cd ../frontend
npm install
cp .env.example .env.local
```

## 2️⃣ Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
✅ Backend running at: http://localhost:3001
📚 API Docs at: http://localhost:3001/api/docs

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running at: http://localhost:3000

## 3️⃣ First Login

### Create Super Admin (Using API)

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@schoolos.com",
    "password": "Admin@123",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "SUPER_ADMIN"
  }'
```

### Login

1. Go to http://localhost:3000/login
2. Email: `admin@schoolos.com`
3. Password: `Admin@123`

## 4️⃣ Quick Tour

### For Super Admin:
1. **Create School**: Dashboard → Add School
2. **Add School Admin**: Schools → Select School → Add User
3. **Configure Academic Year**: School Settings → Academic Year

### For School Admin:
1. **Add Classes**: Classes → Add Class
2. **Add Teachers**: Users → Add Teacher
3. **Add Students**: Users → Add Student
4. **Enroll Students**: Classes → Select Class → Enroll Student

### For Teachers:
1. **Create Homework**: Homework → Create New
2. **Mark Attendance**: Attendance → Select Class → Mark
3. **Upload Content**: Courses → Select Course → Add Content

### For Students:
1. **View Homework**: Homework → View Assignments
2. **Submit Work**: Homework → Submit (text/drawing/files)
3. **Check Grades**: Exams → View Results

## 5️⃣ Common Tasks

### Add a New School

```bash
curl -X POST http://localhost:3001/api/v1/schools \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Springfield High School",
    "email": "admin@springfield.edu",
    "phone": "+919876543210",
    "city": "Springfield",
    "state": "State"
  }'
```

### Create Homework

```bash
curl -X POST http://localhost:3001/api/v1/homework \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "classSubjectId": "uuid",
    "title": "Math Assignment 1",
    "description": "Solve problems 1-20",
    "dueDate": "2024-12-31T23:59:59Z",
    "maxMarks": 20
  }'
```

### Mark Attendance

```bash
curl -X POST http://localhost:3001/api/v1/attendance/CLASS_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-01",
    "attendance": [
      {"studentId": "uuid1", "status": "PRESENT"},
      {"studentId": "uuid2", "status": "ABSENT"}
    ]
  }'
```

## 🔧 Configuration Tips

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_attendance_date ON attendance(date);
```

### Email Setup (Gmail)
1. Enable 2FA on Gmail
2. Generate App Password
3. Use in SMTP_PASSWORD

### File Upload (AWS S3)
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=schoolos-files
```

### Razorpay Setup
1. Sign up at https://razorpay.com
2. Get Test API Keys
3. Add to environment variables

## 📱 Mobile Responsive

The frontend is fully responsive and works on:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktops

## 🎨 Customization

### Change Theme Colors

Edit `frontend/tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
        600: '#YOUR_COLOR',
        // ...
      },
    },
  },
}
```

### Add Custom Logo

Replace in `frontend/public/logo.png`

## 🐛 Quick Fixes

### Can't connect to database?
```bash
# Check PostgreSQL status
sudo service postgresql status

# Restart if needed
sudo service postgresql restart
```

### Port 3001 already in use?
```bash
# Find and kill process
lsof -i :3001
kill -9 <PID>
```

### Frontend can't reach backend?
- Check backend is running
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check CORS settings in backend

## 📚 Next Steps

1. ✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
2. ✅ Review [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for data model
3. ✅ Check [API_ENDPOINTS.md](./API_ENDPOINTS.md) for API reference
4. ✅ Explore [README.md](./README.md) for detailed documentation

## 💡 Pro Tips

- Use Prisma Studio for easy database management: `npm run prisma:studio`
- Check Swagger docs for API testing: http://localhost:3001/api/docs
- Use React DevTools for debugging frontend
- Monitor logs in real-time: `tail -f logs/app.log`

## 🎯 Quick Deployment

### Deploy Backend to Render
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

## 📞 Need Help?

- 📧 Email: support@schoolos.com
- 💬 GitHub Issues: [Create Issue](https://github.com/your-username/schoolos/issues)
- 📖 Documentation: [Full Docs](./README.md)

---

**Happy Coding! 🚀**
