# Installation Guide

## Quick Start (Windows)

### 1. Install Prerequisites

#### Node.js and npm
1. Download Node.js from https://nodejs.org/ (LTS version recommended)
2. Run the installer
3. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### MongoDB
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. Install MongoDB as a Windows Service
4. Verify installation:
   ```powershell
   mongo --version
   ```

### 2. Setup Project

1. Open PowerShell and navigate to the project folder:
   ```powershell
   cd "C:\Users\RealTimeIT\Desktop\Document Management System"
   ```

2. Install all dependencies:
   ```powershell
   npm run install:all
   ```

3. Setup environment files:

   **Server .env file**:
   ```powershell
   cd server
   Copy-Item .env.example .env
   ```
   
   Edit `server/.env` with your text editor and update the MongoDB URI if needed.

   **Client .env file**:
   ```powershell
   cd ../client
   Copy-Item .env.example .env
   ```

4. Return to root directory:
   ```powershell
   cd ..
   ```

### 3. Start the Application

```powershell
npm run dev
```

This will start both the backend server (port 5000) and frontend (port 5173).

### 4. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### 5. Create First Admin User

Use PowerShell to create an admin user via API:

```powershell
$body = @{
    firstName = "Admin"
    lastName = "User"
    email = "admin@regent.edu"
    password = "admin123"
    department = "admin"
    role = "super_admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

Now login with:
- Email: admin@regent.edu
- Password: admin123

## Troubleshooting

### MongoDB Connection Error

If you see "MongoServerError: connect ECONNREFUSED":
1. Check if MongoDB service is running:
   ```powershell
   Get-Service MongoDB
   ```
2. Start MongoDB if it's not running:
   ```powershell
   Start-Service MongoDB
   ```

### Port Already in Use

If port 5000 or 5173 is in use:
1. Find the process:
   ```powershell
   Get-NetTCPConnection -LocalPort 5000
   ```
2. Kill the process or change the port in `.env` files

### Module Not Found Errors

If you see module errors:
```powershell
cd server
Remove-Item -Recurse -Force node_modules
npm install

cd ../client
Remove-Item -Recurse -Force node_modules
npm install
```

## Production Deployment

For production deployment, see the detailed guide in the main README.md file.
