# Deployment Guide - Alfanumrik SchoolOS

Complete deployment guide for production environment.

## 📋 Prerequisites

- Domain name (e.g., schoolos.com)
- GitHub account
- Vercel account (for frontend)
- Railway/Render account (for backend)
- PostgreSQL database (managed service)
- AWS S3 account (for file storage)
- SendGrid account (for emails)
- Razorpay account (for payments)

## 🗄️ Database Setup

### Option 1: Railway PostgreSQL

1. Go to Railway.app
2. Create new project
3. Click "New" → "Database" → "PostgreSQL"
4. Note down the connection details:
   - Host
   - Port
   - Username
   - Password
   - Database name

### Option 2: Render PostgreSQL

1. Go to Render.com
2. Create new PostgreSQL database
3. Copy the Internal Database URL

### Option 3: Other Managed Services

- **Supabase**: https://supabase.com
- **Neon**: https://neon.tech
- **AWS RDS**: https://aws.amazon.com/rds/
- **DigitalOcean**: https://www.digitalocean.com/products/managed-databases

## 🔧 Backend Deployment

### Deploy to Railway

1. **Create New Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   cd backend
   railway init
   ```

2. **Add Environment Variables**
   
   Go to Railway dashboard → Your project → Variables
   
   Add all environment variables from `.env.example`:
   
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-postgres-connection-string>
   JWT_SECRET=<generate-random-secure-string>
   JWT_REFRESH_SECRET=<generate-random-secure-string>
   JWT_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   AWS_ACCESS_KEY_ID=<your-aws-key>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret>
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=<your-bucket-name>
   RAZORPAY_KEY_ID=<your-razorpay-key>
   RAZORPAY_KEY_SECRET=<your-razorpay-secret>
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=<your-sendgrid-key>
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Run Migrations**
   ```bash
   railway run npm run prisma:migrate deploy
   ```

5. **Get Your Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Note this URL for frontend configuration

### Deploy to Render

1. **Create New Web Service**
   - Go to Render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` directory (if monorepo) or root

2. **Configure Build Settings**
   - **Build Command**: 
     ```bash
     npm install && npm run build && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**: 
     ```bash
     npm run start:prod
     ```

3. **Add Environment Variables**
   
   Same as Railway (see above)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## 🎨 Frontend Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub** (Recommended)
   
   a. Push your code to GitHub
   
   b. Go to Vercel.com → "New Project"
   
   c. Import your GitHub repository
   
   d. Configure project:
      - **Framework Preset**: Next.js
      - **Root Directory**: `frontend` (if monorepo)
      - **Build Command**: `npm run build` (auto-detected)
      - **Output Directory**: `.next` (auto-detected)
   
   e. Add Environment Variables:
      ```
      NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api/v1
      NEXT_PUBLIC_APP_NAME=Alfanumrik SchoolOS
      ```
   
   f. Click "Deploy"

3. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., app.schoolos.com)
   - Follow DNS configuration instructions

4. **Configure CORS on Backend**
   
   Update backend environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

## 🔐 Security Configuration

### 1. Generate Secure JWT Secrets

```bash
# Generate random strings
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Configure CORS

In backend `main.ts`:
```typescript
app.enableCors({
  origin: [
    process.env.FRONTEND_URL,
    'https://your-app.vercel.app',
    'https://schoolos.com'
  ],
  credentials: true,
});
```

### 3. Enable HTTPS

- Vercel: Automatic SSL/TLS
- Railway: Automatic SSL/TLS
- Render: Automatic SSL/TLS

### 4. Database SSL

Update DATABASE_URL to include SSL:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

## 📧 Email Configuration (SendGrid)

1. **Create SendGrid Account**
   - Go to https://sendgrid.com
   - Sign up for free tier (100 emails/day)

2. **Create API Key**
   - Settings → API Keys → Create API Key
   - Select "Full Access"
   - Copy the API key

3. **Verify Sender**
   - Settings → Sender Authentication
   - Verify your email domain or single sender

4. **Add to Environment Variables**
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=<your-api-key>
   EMAIL_FROM=noreply@yourdomain.com
   ```

## 💳 Payment Gateway (Razorpay)

1. **Create Razorpay Account**
   - Go to https://razorpay.com
   - Sign up and complete KYC

2. **Get API Keys**
   - Dashboard → Settings → API Keys
   - Generate keys for live mode
   - Copy Key ID and Key Secret

3. **Add to Environment Variables**
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```

4. **Configure Webhooks** (Optional)
   - Dashboard → Webhooks
   - Add webhook URL: `https://your-backend.railway.app/api/v1/webhooks/razorpay`
   - Select events to track

## 📁 File Storage (AWS S3)

1. **Create S3 Bucket**
   - Go to AWS Console → S3
   - Create new bucket
   - Name: `schoolos-files` (or your choice)
   - Region: Select nearest region
   - Block public access: OFF (for public files)

2. **Configure CORS**
   
   Add CORS configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

3. **Create IAM User**
   - Go to IAM → Users → Add User
   - Enable "Programmatic access"
   - Attach policy: `AmazonS3FullAccess`
   - Copy Access Key ID and Secret Access Key

4. **Add to Environment Variables**
   ```
   AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxx
   AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxx
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=schoolos-files
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📊 Monitoring & Logging

### 1. Application Monitoring

- **Sentry** (Error Tracking)
  ```bash
  npm install @sentry/node @sentry/nextjs
  ```
  
  Configure in `main.ts` and `_app.tsx`

- **LogRocket** (Session Replay)
- **New Relic** (APM)

### 2. Database Monitoring

- Enable slow query logging in PostgreSQL
- Use PgAdmin or TablePlus for management

### 3. Uptime Monitoring

- **UptimeRobot**: https://uptimerobot.com
- **Pingdom**: https://pingdom.com
- **Better Uptime**: https://betteruptime.com

## 🧪 Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend loads correctly
- [ ] Login/Registration works
- [ ] Database migrations applied
- [ ] File upload works
- [ ] Email sending works
- [ ] Payment gateway works
- [ ] All environment variables set
- [ ] SSL/HTTPS enabled
- [ ] CORS configured correctly
- [ ] Error tracking setup
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Domain configured (if applicable)
- [ ] Documentation updated

## 🔄 Database Backup

### Automated Backups (Railway)

- Railway automatically backs up PostgreSQL daily
- Access: Dashboard → Database → Backups

### Manual Backup

```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import database
psql $DATABASE_URL < backup.sql
```

### Scheduled Backups (cron job)

```bash
# Add to crontab
0 2 * * * pg_dump $DATABASE_URL > /backups/schoolos_$(date +\%Y\%m\%d).sql
```

## 🚨 Rollback Procedure

### Backend Rollback (Railway)

1. Go to Railway Dashboard
2. Select your service
3. Click "Deployments"
4. Find previous working deployment
5. Click "Redeploy"

### Frontend Rollback (Vercel)

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Find previous working deployment
5. Click "..." → "Promote to Production"

## 📈 Scaling

### Backend Scaling

**Railway:**
- Go to Settings → Resources
- Increase memory/CPU
- Add more instances (requires paid plan)

**Render:**
- Settings → Scaling
- Increase instance size
- Add autoscaling rules

### Database Scaling

- Upgrade to larger instance
- Enable read replicas
- Implement connection pooling
- Use Redis for caching

### Frontend Scaling

- Vercel automatically scales
- Optimize images with Next.js Image component
- Implement CDN for static assets

## 🆘 Troubleshooting

### Backend Not Starting

1. Check logs: `railway logs` or Render dashboard
2. Verify DATABASE_URL is correct
3. Ensure all environment variables are set
4. Check if migrations ran successfully

### Frontend Not Loading

1. Check NEXT_PUBLIC_API_URL is correct
2. Verify CORS is configured on backend
3. Check browser console for errors
4. Ensure SSL/HTTPS is working

### Database Connection Errors

1. Verify DATABASE_URL format
2. Check if database accepts connections from your host
3. Enable SSL: `?sslmode=require`
4. Check connection limits

## 📞 Support

For deployment issues:
- Railway: https://railway.app/help
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

---

**Last Updated**: November 2024
