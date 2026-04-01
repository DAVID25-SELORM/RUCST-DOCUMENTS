# 🚀 Render Deployment Guide - RUCST DMS

## Step-by-Step Manual Deployment

---

## PART 1: Deploy Backend API (10 minutes)

### Step 1: Create Web Service

1. Go to **[https://render.com](https://render.com)**
2. Sign up/Login (use GitHub for easy connection)
3. Click **"New +"** button (top right)
4. Select **"Web Service"**

### Step 2: Connect Repository

1. Click **"Connect account"** if you haven't connected GitHub
2. Find and select: **`DAVID25-SELORM/RUCST-DOCUMENTS`**
3. Click **"Connect"**

### Step 3: Configure Backend Service

Fill in these details:

**Basic Settings:**
- **Name**: `rucst-dms-api`
- **Region**: `Oregon (US West)` (or closest to you)
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** ($0/month)

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these ONE BY ONE:

```
Key: NODE_ENV
Value: production

Key: PORT
Value: 5000

Key: MONGODB_URI
Value: <your-production-mongodb-uri>

Key: JWT_SECRET
Value: <your-long-random-production-secret>

Key: JWT_EXPIRE
Value: 7d

Key: MAX_FILE_SIZE
Value: 10485760

Key: UPLOAD_PATH
Value: ./uploads

Key: CLIENT_URL
Value: PLACEHOLDER_WILL_UPDATE_AFTER_FRONTEND
```

**Note**: We'll update `CLIENT_URL` after deploying the frontend

### Step 5: Create Web Service

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build to complete
3. You'll see build logs in real-time
4. Look for: **"Your service is live 🎉"**

### Step 6: Copy Backend URL

Once deployed, you'll see your backend URL:
- Example: `https://rucst-dms-api.onrender.com`
- **COPY THIS URL** - you'll need it for frontend!

### Step 7: Test Backend

Click on your backend URL and add `/api/health`:
- Go to: `https://rucst-dms-api.onrender.com/api/health`
- You should see: `{"status":"OK","message":"Server is running",...}`

✅ **Backend Deployed!**

---

## PART 2: Deploy Frontend (5 minutes)

### Step 1: Create Static Site

1. Back in Render Dashboard, click **"New +"**
2. Select **"Static Site"**

### Step 2: Connect Same Repository

1. Select: **`DAVID25-SELORM/RUCST-DOCUMENTS`**
2. Click **"Connect"**

### Step 3: Configure Frontend

**Basic Settings:**
- **Name**: `rucst-dms-client`
- **Branch**: `main`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Step 4: Add Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**

```
Key: VITE_API_URL
Value: https://rucst-dms-api.onrender.com/api
```

**Important**: Replace with YOUR actual backend URL from Part 1, Step 6
Make sure to add `/api` at the end!

### Step 5: Create Static Site

1. Click **"Create Static Site"**
2. Wait 3-5 minutes for build
3. Look for: **"Your site is live 🎉"**

### Step 6: Copy Frontend URL

You'll get a URL like:
- `https://rucst-dms-client.onrender.com`
- **COPY THIS URL**

✅ **Frontend Deployed!**

---

## PART 3: Final Configuration (5 minutes)

### Step 1: Update Backend CORS

1. Go back to your **Backend Service** (`rucst-dms-api`)
2. Click **"Environment"** tab (left sidebar)
3. Find `CLIENT_URL` variable
4. Click **"Edit"** (pencil icon)
5. Update value to your frontend URL:
   ```
   https://rucst-dms-client.onrender.com
   ```
6. Click **"Save Changes"**
7. Service will automatically redeploy (takes 1-2 minutes)

### Step 2: Configure MongoDB Atlas

1. Go to **[https://cloud.mongodb.com](https://cloud.mongodb.com)**
2. Select your cluster: **`document-system`**
3. Click **"Network Access"** (left sidebar)
4. Click **"ADD IP ADDRESS"**
5. Select **"ALLOW ACCESS FROM ANYWHERE"**
   - This adds `0.0.0.0/0` (required for Render's dynamic IPs)
6. Click **"Confirm"**
7. Wait 1-2 minutes for changes to apply

### Step 3: Seed Production Database

1. Go back to Render → Your **Backend Service** (`rucst-dms-api`)
2. Click **"Shell"** tab (left sidebar)
3. Wait for shell to connect (may take 30 seconds)
4. Type this command and press Enter:
   ```bash
   node seed.js
   ```
5. You should see:
   ```
   ✅ Connected to MongoDB
   🗑️  Cleared existing users
   ✅ Created 6 users successfully!
   📋 Login Credentials:
   ...
   ```

✅ **Database Seeded!**

---

## PART 4: Test Your Deployment! 🎉

### Step 1: Open Your App

Go to your frontend URL:
```
https://rucst-dms-client.onrender.com
```

### Step 2: Login

Use these credentials:

**Super Admin:**
- Email: `superadmin@regent.edu`
- Password: `superadmin123`

**Or any department admin:**
- Registry: `registry@regent.edu` / `registry123`
- Accounts: `accounts@regent.edu` / `accounts123`
- QA: `qa@regent.edu` / `qa123`

### Step 3: Test Features

✅ Upload a document
✅ Search documents
✅ Download a document
✅ Check dashboard stats

---

## 🎯 Your Live URLs

**Frontend (Main App):**
```
https://rucst-dms-client.onrender.com
```

**Backend API:**
```
https://rucst-dms-api.onrender.com
```

**API Health Check:**
```
https://rucst-dms-api.onrender.com/api/health
```

---

## 🔧 Troubleshooting

### Backend shows "Service Unavailable"
- Check Environment Variables are set correctly
- Check Logs tab for errors
- Verify MONGODB_URI is correct

### Frontend shows blank page
- Check Browser Console (F12) for errors
- Verify VITE_API_URL points to correct backend
- Check that backend is running

### Can't login
- Make sure you seeded the database (Part 3, Step 3)
- Check MongoDB Atlas allows all IPs (0.0.0.0/0)
- Check backend logs for database connection errors

### Upload not working
- This is expected on Render free tier (no persistent storage)
- Consider upgrading or using external storage (AWS S3, Cloudinary)

---

## 📱 Optional: Custom Domain

If you own `dms.regent.edu`:

1. Go to Frontend service → **Settings** → **Custom Domains**
2. Click **"Add Custom Domain"**
3. Enter: `dms.regent.edu`
4. Follow DNS configuration instructions
5. Update backend `CLIENT_URL` to your custom domain

---

## 🔄 Future Updates

When you make code changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Render will **automatically redeploy** both services! 🎉

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Sleep after 15 min inactivity** (first request may be slow)
- **750 hours/month free** (enough for 1 app running 24/7)
- **No persistent file storage** (uploads won't persist)

### To Keep Services Awake:
- Consider using a service like [UptimeRobot](https://uptimerobot.com) (free)
- Pings your URL every 5 minutes
- Prevents sleep mode

---

## 💰 Upgrade Options (If Needed)

**Render Starter Plan ($7/month per service):**
- Always online (no sleep)
- Better performance
- Persistent disk storage for uploads

---

## 📧 Support

**Developer:** David Gabion Selorm
**Email:** gabiondavidselorm@gmail.com
**Phone:** +233247654381

---

## ✅ Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Render
- [ ] MongoDB Atlas allows all IPs
- [ ] Backend CLIENT_URL updated with frontend URL
- [ ] Database seeded with users
- [ ] Can access frontend URL
- [ ] Can login successfully
- [ ] Dashboard loads with data
- [ ] Document upload works (optional)

---

**🎉 Congratulations! Your RUCST Document Management System is LIVE!**

**Developed by:** David Gabion Selorm
**Date:** April 1, 2026
**Version:** 1.0.0
