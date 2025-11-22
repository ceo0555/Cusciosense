# Deployment Guide - Alfanumrik SchoolOS

Complete deployment guide for production environments.

## Overview

This guide covers deployment to:
- **Backend**: Railway or Render
- **Frontend**: Vercel
- **Database**: Railway PostgreSQL or Neon
- **File Storage**: AWS S3 or Cloudinary

## Prerequisites

- GitHub account
- Domain name (optional but recommended)
- AWS account (for S3)
- Razorpay account
- Email service (SendGrid/Gmail)

---

## Part 1: Database Deployment

### Option A: Railway PostgreSQL

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Note the connection details

3. **Get Connection String**
   ```
   Format: postgresql://user:password@host:port/database
   ```

### Option B: Neon PostgreSQL

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up

2. **Create Database**
   - Create new project
   - Copy connection string

---

## Part 2: Backend Deployment

### Option A: Deploy to Railway

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create Railway Project**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Choose `backend` folder

3. **Configure Environment Variables**
   
   In Railway project settings, add:
   
   ```env
   NODE_ENV=production
   PORT=3001
   API_PREFIX=api/v1
   
   # Database (from Railway PostgreSQL)
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your-db-password
   DB_DATABASE=railway
   
   # JWT
   JWT_SECRET=your-secure-jwt-secret-min-32-chars
   JWT_EXPIRATION=24h
   JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
   JWT_REFRESH_EXPIRATION=7d
   
   # AWS S3
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_S3_BUCKET=your-bucket-name
   
   # Email
   MAIL_HOST=smtp.sendgrid.net
   MAIL_PORT=587
   MAIL_USER=apikey
   MAIL_PASSWORD=your-sendgrid-api-key
   MAIL_FROM=noreply@yourdomain.com
   
   # Razorpay
   RAZORPAY_KEY_ID=your-live-key-id
   RAZORPAY_KEY_SECRET=your-live-key-secret
   RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
   
   # Frontend URL
   FRONTEND_URL=https://your-domain.vercel.app
   ```

4. **Configure Build Settings**
   
   Railway auto-detects Node.js. Ensure in `backend/package.json`:
   ```json
   {
     "scripts": {
       "build": "nest build",
       "start:prod": "node dist/main"
     }
   }
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Note the deployment URL (e.g., `https://your-app.railway.app`)

6. **Run Database Migrations**
   
   Connect via Railway CLI:
   ```bash
   npm i -g @railway/cli
   railway login
   railway link
   railway run npm run migration:run
   ```

### Option B: Deploy to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository
   - Select `backend` directory

3. **Configure Service**
   ```
   Name: schoolos-backend
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   ```

4. **Add Environment Variables**
   (Same as Railway above)

5. **Create PostgreSQL Database**
   - In Render dashboard
   - Click "New +"
   - Select "PostgreSQL"
   - Connect to web service

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment

---

## Part 3: Frontend Deployment (Vercel)

1. **Push Frontend to GitHub**
   ```bash
   # If not already pushed
   git add frontend
   git commit -m "Add frontend"
   git push
   ```

2. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

3. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `frontend` folder as root directory

4. **Configure Build Settings**
   
   Vercel auto-detects Next.js. Confirm:
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

5. **Add Environment Variables**
   
   In Vercel project settings:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your-live-razorpay-key
   ```

6. **Deploy**
   - Click "Deploy"
   - Vercel will deploy and provide URL
   - Note: `https://your-project.vercel.app`

7. **Add Custom Domain (Optional)**
   - In Vercel project settings
   - Go to "Domains"
   - Add your custom domain
   - Update DNS records as instructed

---

## Part 4: AWS S3 Setup (File Storage)

1. **Create S3 Bucket**
   
   ```bash
   # Using AWS Console
   1. Go to S3 service
   2. Click "Create bucket"
   3. Name: schoolos-files-prod
   4. Region: us-east-1
   5. Block all public access: OFF (for file serving)
   6. Create bucket
   ```

2. **Configure CORS**
   
   In bucket permissions, add CORS configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://your-domain.vercel.app"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

3. **Create IAM User**
   
   ```bash
   1. Go to IAM service
   2. Create new user: schoolos-s3-user
   3. Attach policy: AmazonS3FullAccess
   4. Create access key
   5. Note: Access Key ID and Secret Access Key
   ```

4. **Update Environment Variables**
   
   Add to Railway/Render backend:
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=<your-access-key>
   AWS_SECRET_ACCESS_KEY=<your-secret-key>
   AWS_S3_BUCKET=schoolos-files-prod
   ```

---

## Part 5: Email Setup (SendGrid)

1. **Create SendGrid Account**
   - Go to https://sendgrid.com
   - Sign up (free tier available)

2. **Create API Key**
   ```bash
   1. Go to Settings > API Keys
   2. Create API Key
   3. Give full access
   4. Copy API key
   ```

3. **Verify Domain**
   ```bash
   1. Go to Settings > Sender Authentication
   2. Authenticate your domain
   3. Add DNS records to your domain
   4. Verify
   ```

4. **Update Backend Environment**
   ```env
   MAIL_HOST=smtp.sendgrid.net
   MAIL_PORT=587
   MAIL_USER=apikey
   MAIL_PASSWORD=<your-sendgrid-api-key>
   MAIL_FROM=noreply@yourdomain.com
   ```

---

## Part 6: Razorpay Setup (Payments)

1. **Create Razorpay Account**
   - Go to https://razorpay.com
   - Sign up and complete KYC

2. **Get API Keys**
   ```bash
   1. Go to Settings > API Keys
   2. Generate Live API Keys
   3. Note: Key ID and Key Secret
   ```

3. **Setup Webhooks**
   ```bash
   1. Go to Settings > Webhooks
   2. Add webhook URL: https://your-backend.railway.app/api/v1/payments/webhook
   3. Select events:
      - payment.captured
      - payment.failed
      - subscription.activated
      - subscription.cancelled
   4. Note: Webhook Secret
   ```

4. **Update Environment Variables**
   
   Backend:
   ```env
   RAZORPAY_KEY_ID=<live-key-id>
   RAZORPAY_KEY_SECRET=<live-key-secret>
   RAZORPAY_WEBHOOK_SECRET=<webhook-secret>
   ```
   
   Frontend:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=<live-key-id>
   ```

---

## Part 7: Post-Deployment Configuration

### 1. Update Backend CORS

Ensure backend allows frontend domain:
```typescript
// backend/src/main.ts
app.enableCors({
  origin: [
    'https://your-domain.vercel.app',
    'https://www.your-domain.com'
  ],
  credentials: true,
});
```

### 2. Create First Super Admin

```bash
# Connect to database
psql <connection-string>

# Create user
INSERT INTO users (email, password_hash, first_name, last_name, is_active, is_email_verified)
VALUES ('admin@yourdomain.com', '<bcrypt-hash>', 'Admin', 'User', true, true);

# Assign super_admin role
INSERT INTO user_roles (user_id, role, is_primary)
VALUES ('<user-id>', 'super_admin', true);
```

Or use the registration endpoint and manually update the role.

### 3. Test Critical Flows

- [ ] User registration
- [ ] User login
- [ ] File upload
- [ ] Email sending
- [ ] Payment processing (test mode first)
- [ ] Database operations

### 4. Setup Monitoring

- Enable Vercel Analytics
- Setup Sentry for error tracking
- Configure uptime monitoring
- Setup database backups

---

## Part 8: Domain Configuration (Optional)

### Custom Domain for Frontend

1. **In Vercel**
   - Project Settings > Domains
   - Add domain: `schoolos.yourdomain.com`

2. **Update DNS**
   ```
   Type: CNAME
   Name: schoolos
   Value: cname.vercel-dns.com
   ```

### Custom Domain for Backend

1. **In Railway/Render**
   - Project Settings > Custom Domain
   - Add domain: `api.yourdomain.com`

2. **Update DNS**
   ```
   Type: CNAME
   Name: api
   Value: <provided-by-railway/render>
   ```

3. **Update Frontend Environment**
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
   ```

---

## Part 9: SSL/HTTPS

- **Vercel**: Automatic SSL
- **Railway**: Automatic SSL
- **Render**: Automatic SSL
- **Custom Domains**: SSL auto-provisioned

---

## Part 10: Continuous Deployment

### Automatic Deployment

Both Vercel and Railway/Render support automatic deployment:

```bash
# Any push to main branch triggers deployment
git add .
git commit -m "Update feature"
git push origin main
```

### Preview Deployments

- **Vercel**: Automatic preview for each PR
- **Railway**: Create preview environments
- **Render**: Preview environments (paid plan)

---

## Troubleshooting

### Backend Not Starting
- Check environment variables
- Verify database connection
- Check logs in Railway/Render dashboard

### Frontend API Errors
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS configuration
- Verify backend is running

### Database Connection Issues
- Check connection string format
- Verify database is running
- Check firewall rules

### File Upload Failing
- Verify AWS credentials
- Check S3 bucket permissions
- Verify CORS configuration

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database deployed and accessible
- [ ] Backend API deployed and running
- [ ] Frontend deployed and accessible
- [ ] File storage (S3) configured
- [ ] Email service configured
- [ ] Payment gateway configured
- [ ] SSL certificates active
- [ ] Custom domains configured (if applicable)
- [ ] CORS properly configured
- [ ] First admin user created
- [ ] Critical flows tested
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation updated

---

## Maintenance

### Regular Tasks
- Monitor error logs
- Check database performance
- Review uptime metrics
- Update dependencies
- Backup database regularly

### Scaling
- **Backend**: Increase Railway/Render resources
- **Database**: Upgrade plan or optimize queries
- **Frontend**: Vercel scales automatically
- **Storage**: S3 scales automatically

---

## Support

For deployment issues:
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- AWS: https://docs.aws.amazon.com

---

**Deployment Complete!** 🎉

Your SchoolOS platform is now live and ready for production use.
