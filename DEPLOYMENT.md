# Deployment Guide - RUCST Document Management System

This guide will help you deploy the Document Management System to production.

## Prerequisites

- GitHub account
- MongoDB Atlas account (already set up)
- Vercel account (free) or Render account (free)

---

## Option 1: Deploy to Render (Recommended - Full Stack on One Platform)

Render offers free hosting for both frontend and backend.

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - RUCST DMS"

# Create a new repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/rucst-dms.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [https://render.com](https://render.com) and sign up
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file
5. Set the following environment variables:

#### Backend (rucst-dms-api):
- `MONGODB_URI`: Your MongoDB Atlas connection string (already in .env)
- `CLIENT_URL`: Will be your frontend URL (add after frontend deployment)

#### Frontend (rucst-dms-client):
- `VITE_API_URL`: Your backend URL (will be: `https://rucst-dms-api.onrender.com/api`)

6. Click "Apply" to deploy both services

### Step 3: Update Environment Variables

After deployment:
1. Copy your backend URL (e.g., `https://rucst-dms-api.onrender.com`)
2. Update frontend `VITE_API_URL` to point to backend
3. Copy your frontend URL (e.g., `https://rucst-dms-client.onrender.com`)
4. Update backend `CLIENT_URL` to point to frontend
5. Redeploy both services

---

## Option 2: Deploy to Vercel (Frontend) + Render (Backend)

### Backend on Render

1. Go to [https://render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: rucst-dms-api
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `PORT=5000`
     - `MONGODB_URI=your_mongodb_atlas_uri`
     - `JWT_SECRET=your_super_secret_key_change_this`
     - `JWT_EXPIRE=7d`
     - `MAX_FILE_SIZE=10485760`
     - `CLIENT_URL=https://YOUR_FRONTEND_URL.vercel.app`

5. Click "Create Web Service"

### Frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Environment Variables**:
     - `VITE_API_URL=https://rucst-dms-api.onrender.com/api`

5. Click "Deploy"

---

## Option 3: Deploy to Railway (Alternative)

Railway is another free option with generous limits.

1. Go to [https://railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add two services:
   - **Backend**: Set root directory to `server`
   - **Frontend**: Set root directory to `client`
5. Configure environment variables similar to Render

---

## Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<your-long-random-production-secret>
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is deployed and loads
- [ ] Frontend can connect to backend API
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs) for cloud deployments
- [ ] Login works with seeded users
- [ ] Document upload works
- [ ] Document download works
- [ ] CORS is properly configured

---

## Update MongoDB Atlas for Production

1. Go to MongoDB Atlas Dashboard
2. Click on your cluster
3. Go to "Network Access"
4. Click "Add IP Address"
5. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed because Render/Vercel use dynamic IPs
6. Click "Confirm"

---

## Seeding Production Database

After deployment, seed your production database:

```bash
# Option 1: Run from local machine
cd server
node seed.js

# Option 2: Use Render Shell
# Go to Render Dashboard → Your Service → Shell
# Then run: node seed.js
```

---

## Custom Domain (Optional)

### On Vercel:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain (e.g., dms.regent.edu)
4. Update DNS records as instructed

### On Render:
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

---

## Monitoring & Logs

### Vercel:
- Dashboard → Your Project → Deployments → View Logs

### Render:
- Dashboard → Your Service → Logs

---

## Support

For issues or questions:
- Email: gabiondavidselorm@gmail.com
- Developer: David Gabion Selorm

---

**Developed by:** David Gabion Selorm  
**Date:** April 1, 2026  
**Version:** 1.0.0
