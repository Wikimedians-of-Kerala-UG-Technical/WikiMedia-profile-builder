# Deployment Guide

This guide covers how to deploy the Wiki Profile Builder application to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [Docker](#docker)
  - [Self-Hosted](#self-hosted)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. **Firebase Project** set up with Authentication enabled
2. **Google Gemini API Key** (optional, for AI features)
3. **Git repository** pushed to GitHub/GitLab/Bitbucket
4. **Domain name** (optional, for custom domains)

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file (for local development) or configure these in your hosting platform:

```env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Google Gemini AI (Optional)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon → Project Settings
4. Scroll to "Your apps" section
5. Click on the web app (</> icon)
6. Copy the configuration values

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

**Note**: The application works without Gemini API key using template-based profile generation.

## Deployment Options

### Vercel (Recommended)

Vercel is the recommended platform as it's built by the creators of Next.js.

#### Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Visit [Vercel](https://vercel.com/)**
   - Sign up or log in
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure the project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `wiki-profile-builder`
   - Build Command: `pnpm build` (or leave default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add all the variables from your `.env.local` file
   - Make sure to add them for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project directory
cd wiki-profile-builder

# Login to Vercel
vercel login

# Deploy
vercel

# Or deploy directly to production
vercel --prod
```

#### Custom Domain (Vercel)

1. In Vercel dashboard, go to your project
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

---

### Netlify

Netlify is another excellent option for deploying Next.js apps.

#### Deploy via Netlify Dashboard

1. **Push code to GitHub**

2. **Visit [Netlify](https://www.netlify.com/)**
   - Sign up or log in
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git provider

3. **Configure build settings**
   - Base directory: `wiki-profile-builder`
   - Build command: `pnpm build`
   - Publish directory: `.next`

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add all required variables

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://your-site.netlify.app`

#### Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project
cd wiki-profile-builder

# Login
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

---

### Docker

Deploy using Docker for containerized deployments.

#### Create Dockerfile

Create `Dockerfile` in the `wiki-profile-builder` directory:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["pnpm", "start"]
```

#### Create .dockerignore

```
node_modules
.next
.git
.env.local
.env*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
```

#### Build and Run

```bash
# Build the Docker image
docker build -t wiki-profile-builder .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  # ... add all other environment variables
  wiki-profile-builder
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: ./wiki-profile-builder
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
      - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
      - NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

### Self-Hosted

Deploy on your own server (VPS, dedicated server, etc.).

#### Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Node.js 20+ installed
- Nginx or Apache for reverse proxy
- SSL certificate (Let's Encrypt recommended)

#### Setup Steps

1. **Install Node.js and pnpm**
   ```bash
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install pnpm
   npm install -g pnpm
   ```

2. **Clone and setup the project**
   ```bash
   cd /var/www
   git clone https://github.com/MabelMoncy/TharangRepo.git
   cd TharangRepo/wiki-profile-builder
   pnpm install
   ```

3. **Create environment file**
   ```bash
   nano .env.local
   # Add your environment variables
   ```

4. **Build the application**
   ```bash
   pnpm build
   ```

5. **Setup PM2 for process management**
   ```bash
   # Install PM2
   npm install -g pm2

   # Start the app
   pm2 start "pnpm start" --name wiki-profile-builder

   # Save PM2 configuration
   pm2 save

   # Setup PM2 to start on boot
   pm2 startup
   ```

6. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/wiki-profile-builder
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/wiki-profile-builder /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

8. **Configure Firewall**
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw allow 22  # SSH
   sudo ufw enable
   ```

---

## Post-Deployment

### Verify Deployment

1. **Check the Homepage**
   - Visit your deployed URL
   - Verify the page loads correctly

2. **Test Authentication**
   - Try to register a new account
   - Test login and logout

3. **Test Profile Fetching**
   - Try fetching an existing Wikimedia profile
   - Verify the wikitext is retrieved correctly

4. **Test Profile Generation**
   - Fill in the profile creation form
   - Verify profile generation works (AI or template)

5. **Test Editor**
   - Load a profile in the editor
   - Verify the preview updates
   - Test the copy function

### Monitoring

#### Vercel Analytics (for Vercel deployments)

1. Enable Vercel Analytics in your project settings
2. Monitor page views, performance, and errors

#### Custom Monitoring

Consider adding:
- **Sentry**: Error tracking and monitoring
- **Google Analytics**: User analytics
- **LogRocket**: Session replay and debugging

### Performance Optimization

1. **Enable Caching**
   - Configure CDN caching headers
   - Cache static assets aggressively

2. **Optimize Images**
   - Use Next.js Image component
   - Serve images in WebP format

3. **Monitor Performance**
   - Use Lighthouse for audits
   - Check Core Web Vitals

## Troubleshooting

### Build Failures

**Problem**: Build fails with dependency errors
```
Solution:
1. Delete node_modules and pnpm-lock.yaml
2. Run pnpm install
3. Try building again
```

**Problem**: TypeScript errors during build
```
Solution:
1. Check for type errors: pnpm tsc --noEmit
2. Fix type issues in the code
3. Rebuild
```

### Runtime Errors

**Problem**: Firebase authentication not working
```
Solution:
1. Verify all Firebase env variables are set
2. Check Firebase project settings
3. Ensure authentication is enabled in Firebase console
```

**Problem**: API routes returning 500 errors
```
Solution:
1. Check server logs for detailed errors
2. Verify environment variables are set correctly
3. Check API rate limits (Wikimedia, Gemini)
```

**Problem**: Wikitext parsing fails
```
Solution:
1. Verify Wikimedia API is accessible
2. Check for network issues
3. Test with a different wiki domain
```

### Performance Issues

**Problem**: Slow initial load
```
Solutions:
1. Enable compression in your hosting
2. Optimize images
3. Check bundle size: pnpm build --analyze
4. Enable CDN for static assets
```

**Problem**: Slow API responses
```
Solutions:
1. Implement caching for API responses
2. Use server-side rendering for critical pages
3. Optimize database queries (if using a database)
```

### DNS and Domain Issues

**Problem**: Custom domain not working
```
Solutions:
1. Verify DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Check SSL certificate status
4. Clear browser cache
```

## Updating the Deployment

### Vercel/Netlify
- Push changes to your Git repository
- Deployment happens automatically
- Preview deployments for PRs

### Docker
```bash
# Rebuild the image
docker build -t wiki-profile-builder .

# Stop old container
docker stop wiki-profile-builder

# Remove old container
docker rm wiki-profile-builder

# Start new container
docker run -d -p 3000:3000 --name wiki-profile-builder \
  --env-file .env wiki-profile-builder
```

### Self-Hosted
```bash
cd /var/www/TharangRepo/wiki-profile-builder
git pull
pnpm install
pnpm build
pm2 restart wiki-profile-builder
```

## Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] SSL/HTTPS is enabled
- [ ] Firewall is configured
- [ ] Dependencies are up to date
- [ ] Firebase security rules are configured
- [ ] API keys have proper restrictions
- [ ] CORS is properly configured
- [ ] Rate limiting is in place (if needed)

---

For additional help, refer to:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
