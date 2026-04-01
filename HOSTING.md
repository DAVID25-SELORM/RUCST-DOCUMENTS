# 🚀 Quick Start - Deploy RUCST DMS

## Fastest Way to Host (5 minutes)

### Prerequisites
✅ You already have MongoDB Atlas running  
✅ Your code is ready to deploy

---

## 🎯 Recommended: Deploy to Render (Free & Easy)

**Render offers 750 hours/month free** - Perfect for your DMS!

### Step-by-Step:

#### 1️⃣ Push to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/rucst-dms.git
git push -u origin main
```

#### 2️⃣ Deploy Backend (5 minutes)

1. Go to **[render.com](https://render.com)** → Sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `rucst-dms-api`
   - **Region**: Oregon (US West)
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://adminregent_db_user:hrY4CBREqnmTcmvn@document-system.bl9ho3l.mongodb.net/regent_dms?retryWrites=true&w=majority&appName=document-system
   JWT_SECRET=regent-university-super-secret-key-2026-production
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=10485760
   CLIENT_URL=https://rucst-dms.onrender.com
   ```

6. Click **"Create Web Service"**
7. **Copy your backend URL** (e.g., `https://rucst-dms-api.onrender.com`)

#### 3️⃣ Deploy Frontend (3 minutes)

1. In Render, click **"New +"** → **"Static Site"**
2. Connect same repository
3. Configure:
   - **Name**: `rucst-dms`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://rucst-dms-api.onrender.com/api
   ```
   (Replace with your actual backend URL from step 2)

5. Click **"Create Static Site"**
6. **Copy your frontend URL** (e.g., `https://rucst-dms.onrender.com`)

#### 4️⃣ Update Backend CORS (1 minute)

1. Go back to your backend service in Render
2. Click **"Environment"** tab
3. Update `CLIENT_URL` with your frontend URL from step 3
4. Click **"Save Changes"** (will auto-redeploy)

#### 5️⃣ Allow Render IPs in MongoDB Atlas (2 minutes)

1. Go to **[MongoDB Atlas](https://cloud.mongodb.com)**
2. Click your cluster → **"Network Access"**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

#### 6️⃣ Seed Production Database (1 minute)

1. In Render, go to your backend service
2. Click **"Shell"** tab
3. Run:
   ```bash
   node seed.js
   ```

### ✅ Done! Your app is live!

**Frontend**: https://rucst-dms.onrender.com  
**Backend**: https://rucst-dms-api.onrender.com

**Test Login**:
- Email: `superadmin@regent.edu`
- Password: `superadmin123`

---

## 🔄 Alternative: Vercel (Frontend) + Render (Backend)

### Frontend on Vercel (Recommended for better performance)

1. Go to **[vercel.com](https://vercel.com)** → Sign up
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable**:
     ```
     VITE_API_URL=https://rucst-dms-api.onrender.com/api
     ```
5. Click **"Deploy"**

**Your Vercel URL**: https://rucst-dms.vercel.app

Don't forget to update backend `CLIENT_URL` to your Vercel URL!

---

## 📱 Custom Domain (Optional)

### Add dms.regent.edu (if you have access to DNS)

**On Vercel**:
1. Project Settings → Domains
2. Add `dms.regent.edu`
3. Add these DNS records at your domain provider:
   ```
   A Record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
   ```

**On Render**:
1. Service Settings → Custom Domains
2. Add domain and follow DNS instructions

---

## 🔍 Troubleshooting

### Backend not connecting to MongoDB?
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify MONGODB_URI in environment variables

### Frontend can't reach backend?
- Check VITE_API_URL includes `/api` at the end
- Verify CORS CLIENT_URL matches frontend URL

### Files not uploading?
- Render free tier has limited disk space
- Consider upgrading or using cloud storage (AWS S3, Cloudinary)

---

## 💰 Cost Breakdown

**Monthly Cost: $0** (Using free tiers)

- **Render Free Tier**: 750 hours/month (enough for 1 app)
- **Vercel Free Tier**: Unlimited for personal projects
- **MongoDB Atlas Free Tier**: 512MB storage

### When to Upgrade?

- **Render**: When you need >750 hours/month ($7/month for always-on)
- **Vercel**: When you exceed 100GB bandwidth/month
- **MongoDB**: When you exceed 512MB storage ($9/month for 2GB)

---

## 📧 Need Help?

**Developer**: David Gabion Selorm  
**Email**: gabiondavidselorm@gmail.com  
**Phone**: +233247654381

---

**🎉 Congratulations! Your Document Management System is now live!**
