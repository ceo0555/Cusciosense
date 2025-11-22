# Deployment Checklist - Alfanumrik SchoolOS

Use this checklist to ensure a smooth deployment to production.

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console.log statements in production code
- [ ] TypeScript compilation successful
- [ ] ESLint warnings resolved
- [ ] Code reviewed and approved
- [ ] Git branch merged to main/production

### Environment Configuration
- [ ] Production environment variables set
- [ ] API URLs updated to production
- [ ] Database credentials secured
- [ ] JWT secrets are strong and unique
- [ ] CORS origins configured correctly
- [ ] Email SMTP settings configured
- [ ] Payment gateway keys (Razorpay) set
- [ ] AWS S3 credentials configured (if using)

### Database
- [ ] Database backup taken
- [ ] Migration scripts tested
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Database monitoring set up

### Security
- [ ] HTTPS/SSL certificates configured
- [ ] Security headers added
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] Password policies enforced
- [ ] Session management secure
- [ ] API keys rotated
- [ ] Secrets stored securely (not in code)

### Performance
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] Static assets optimized
- [ ] Image optimization enabled
- [ ] CDN configured
- [ ] Compression enabled
- [ ] Load testing completed

## 🚀 Frontend Deployment (Vercel)

### Pre-Deployment
- [ ] Run production build locally
  ```bash
  cd frontend
  npm run build
  npm run start
  ```
- [ ] Test production build thoroughly
- [ ] Check for any build warnings

### Vercel Setup
1. **Connect Repository**
   - [ ] Link GitHub repository to Vercel
   - [ ] Select `frontend` as root directory
   - [ ] Configure build settings

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
   NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
   NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxx
   ```
   - [ ] Add all required variables
   - [ ] Verify values are correct
   - [ ] Test with preview deployment

3. **Domain Configuration**
   - [ ] Add custom domain
   - [ ] Configure DNS records
   - [ ] Verify SSL certificate
   - [ ] Test domain access

4. **Deployment**
   - [ ] Deploy to preview
   - [ ] Test preview deployment
   - [ ] Promote to production
   - [ ] Verify production deployment

### Post-Deployment
- [ ] Test authentication flow
- [ ] Verify API connections
- [ ] Check all pages load correctly
- [ ] Test responsive design
- [ ] Verify images load
- [ ] Check console for errors
- [ ] Test user flows

## 🔧 Backend Deployment (Render/Railway)

### Pre-Deployment
- [ ] Run production build locally
  ```bash
  cd backend
  npm run build
  npm run start:prod
  ```
- [ ] Test all API endpoints
- [ ] Verify database connections

### Render/Railway Setup

1. **Create Web Service**
   - [ ] Connect GitHub repository
   - [ ] Set root directory to `backend`
   - [ ] Configure build command: `npm install && npm run build`
   - [ ] Set start command: `npm run start:prod`

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3001
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_USERNAME=your-db-user
   DB_PASSWORD=your-db-password
   DB_DATABASE=schoolos_prod
   JWT_SECRET=your-strong-secret
   JWT_REFRESH_SECRET=your-strong-refresh-secret
   CORS_ORIGIN=https://yourdomain.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email
   SMTP_PASSWORD=your-password
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=your-secret
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   ```
   - [ ] Add all environment variables
   - [ ] Double-check sensitive values
   - [ ] Verify CORS origin

3. **Database Setup**
   - [ ] Create PostgreSQL instance
   - [ ] Note connection details
   - [ ] Create production database
   - [ ] Run migrations
   - [ ] Verify data integrity

4. **Deployment**
   - [ ] Deploy to production
   - [ ] Monitor deployment logs
   - [ ] Check for errors
   - [ ] Verify service is running

### Post-Deployment
- [ ] Test API health endpoint
- [ ] Verify Swagger docs accessible
- [ ] Test authentication endpoints
- [ ] Verify database connections
- [ ] Test file uploads
- [ ] Check email sending
- [ ] Test payment processing
- [ ] Monitor error logs

## 🗄️ Database Deployment

### PostgreSQL Setup
- [ ] Create production database
- [ ] Set up connection pooling
- [ ] Configure backup schedule
- [ ] Set up monitoring
- [ ] Create read replicas (if needed)

### Migrations
```bash
# Run migrations in production
npm run migration:run

# Verify migrations
psql -U user -d dbname -c "\dt"
```
- [ ] Backup database before migration
- [ ] Run migrations
- [ ] Verify schema changes
- [ ] Test application after migration

### Data Seeding (if needed)
- [ ] Create initial super admin user
- [ ] Seed roles and permissions
- [ ] Add default configurations

## 📧 Email Configuration

### SMTP Setup
- [ ] Configure SMTP provider (Gmail, SendGrid, etc.)
- [ ] Test email sending
- [ ] Verify email templates
- [ ] Check spam folder handling
- [ ] Set up email monitoring

### Email Templates
- [ ] Welcome email
- [ ] Password reset
- [ ] Verification email
- [ ] Notification emails
- [ ] Invoice/receipt emails

## 💳 Payment Gateway Configuration

### Razorpay Setup
- [ ] Create live account
- [ ] Get live API keys
- [ ] Configure webhooks
- [ ] Test payment flow
- [ ] Set up payment notifications
- [ ] Configure refund policies

### Testing
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test webhook handling
- [ ] Verify receipt generation

## 🔐 Security Hardening

### Application Security
- [ ] Enable HTTPS only
- [ ] Configure CSP headers
- [ ] Enable HSTS
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable SQL injection protection
- [ ] Implement XSS protection

### Infrastructure Security
- [ ] Firewall configured
- [ ] DDoS protection enabled
- [ ] Intrusion detection set up
- [ ] Log monitoring enabled
- [ ] Regular security updates scheduled

## 📊 Monitoring & Logging

### Application Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Create alerting rules
- [ ] Dashboard created

### Logging
- [ ] Centralized logging configured
- [ ] Log retention policy set
- [ ] Critical alerts configured
- [ ] Log analysis tools set up

## 🔄 CI/CD Pipeline

### Automated Testing
- [ ] Unit tests run on commit
- [ ] Integration tests run on PR
- [ ] E2E tests run before deploy
- [ ] Security scans enabled

### Deployment Pipeline
- [ ] Auto-deploy on main branch
- [ ] Preview deployments for PRs
- [ ] Rollback procedure documented
- [ ] Blue-green deployment (if applicable)

## 📱 Performance Optimization

### Frontend
- [ ] Code splitting enabled
- [ ] Lazy loading implemented
- [ ] Image optimization active
- [ ] CDN configured
- [ ] Caching headers set
- [ ] Bundle size optimized

### Backend
- [ ] Database queries optimized
- [ ] Connection pooling active
- [ ] Caching implemented
- [ ] Response compression enabled
- [ ] API rate limiting set

## 🧪 Post-Deployment Testing

### Functional Testing
- [ ] User registration works
- [ ] Login/logout works
- [ ] All CRUD operations work
- [ ] File uploads work
- [ ] Payments process correctly
- [ ] Emails send successfully
- [ ] Reports generate correctly

### Performance Testing
- [ ] Page load times acceptable
- [ ] API response times good
- [ ] Database queries fast
- [ ] No memory leaks
- [ ] Handles expected load

### Security Testing
- [ ] SQL injection tests pass
- [ ] XSS protection works
- [ ] CSRF protection active
- [ ] Authentication secure
- [ ] Authorization working

## 📝 Documentation

- [ ] API documentation updated
- [ ] Deployment guide current
- [ ] User manual available
- [ ] Admin guide provided
- [ ] Troubleshooting guide ready

## 🎉 Go-Live Checklist

### Final Checks
- [ ] All systems green
- [ ] Monitoring active
- [ ] Backups configured
- [ ] Support team ready
- [ ] Rollback plan ready
- [ ] Communication plan ready

### Launch
- [ ] Announce maintenance window
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Smoke test all features
- [ ] Monitor for issues
- [ ] Announce go-live

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Check error logs
- [ ] Verify user activity
- [ ] Collect feedback
- [ ] Address critical issues

## 🆘 Emergency Procedures

### Rollback Plan
1. Identify issue
2. Notify team
3. Revert to previous version
4. Verify rollback successful
5. Investigate issue
6. Plan fix

### Contact Information
- [ ] On-call engineer: _____________
- [ ] DevOps lead: _____________
- [ ] Product manager: _____________
- [ ] CEO/CTO: _____________

## ✅ Sign-off

- [ ] Technical lead approval: _________________ Date: _______
- [ ] Security approval: _________________ Date: _______
- [ ] Product manager approval: _________________ Date: _______
- [ ] Final go-ahead: _________________ Date: _______

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Version:** _______________  
**Status:** ⬜ Successful ⬜ Issues Found ⬜ Rolled Back

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
