# Alfanumrik SchoolOS - Frontend

Next.js-based frontend for School ERP + LMS platform.

## Prerequisites

- Node.js 18+ and npm
- Backend API running

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your API URL
```

## Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Dashboard pages
│   │   ├── classes/
│   │   ├── homework/
│   │   ├── attendance/
│   │   ├── students/
│   │   └── reports/
│   ├── admin/             # Admin pages
│   ├── teacher/           # Teacher pages
│   ├── student/           # Student pages
│   └── parent/            # Parent pages
├── components/            # React components
│   ├── ui/               # UI components (Button, Card, Input)
│   ├── layout/           # Layout components (Sidebar, Header)
│   ├── auth/             # Auth components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utilities
│   ├── api-client.ts    # Axios instance
│   └── utils.ts         # Helper functions
├── hooks/               # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── types/              # TypeScript types
│   └── index.ts       # Type definitions
└── styles/            # Global styles
    └── globals.css    # Tailwind CSS
```

## Key Features

- Server-side rendering (SSR)
- Static generation for public pages
- Role-based access control
- Responsive design with Tailwind CSS
- Form validation with React Hook Form + Zod
- State management with Zustand
- API integration with Axios
- Toast notifications
- Dark mode support (optional)

## User Roles & Dashboards

### Super Admin
- Manage all schools
- View system-wide analytics
- Manage subscriptions

### School Admin
- Manage school data
- Manage teachers and staff
- Configure school settings
- View school analytics

### Teacher
- Manage classes and courses
- Create homework and quizzes
- Mark attendance
- Grade submissions
- Generate report cards

### Student
- View courses and content
- Submit homework
- Take quizzes
- View grades and reports
- Check attendance

### Parent
- View child's progress
- View attendance and grades
- Pay fees online
- Receive notifications

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
```

## License

MIT
