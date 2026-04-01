# Quick Start Guide

## For Developers - Get Started in 5 Minutes

### 1. Prerequisites Check
```powershell
node --version   # Should be 18.x or higher
npm --version    # Should be 9.x or higher
mongo --version  # Verify MongoDB is installed
```

### 2. Install Dependencies
```powershell
cd "C:\Users\RealTimeIT\Desktop\Document Management System"
npm run install:all
```

### 3. Setup Environment
```powershell
# Backend
cd server
Copy-Item .env.example .env
notepad .env  # Edit if needed

# Frontend
cd ../client
Copy-Item .env.example .env
cd ..
```

### 4. Seed Sample Users (Optional)
```powershell
cd server
node seed.js
cd ..
```

This creates test accounts:
- superadmin@regent.edu / superadmin123
- registry@regent.edu / registry123
- accounts@regent.edu / accounts123
- qa@regent.edu / qa123
- president@regent.edu / president123
- vpacademics@regent.edu / vpacademics123

### 5. Start Application
```powershell
npm run dev
```

### 6. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Auth**: JWT with bcrypt password hashing

### Key Features Implemented
✅ User authentication & authorization  
✅ Department-based access control  
✅ Document upload (PDF, Word, Excel, Images)  
✅ Advanced search & filtering  
✅ Version control for documents  
✅ Audit trail logging  
✅ Beautiful responsive UI  
✅ File download functionality  
✅ Admin dashboard  

### Folder Structure
```
Document Management System/
├── client/          # React frontend
├── server/          # Express backend
├── README.md        # Full documentation
└── INSTALLATION.md  # Detailed installation guide
```

### Common Commands
```powershell
# Development
npm run dev          # Start both frontend & backend

# Individual services
npm run client       # Start frontend only
npm run server       # Start backend only

# Production build
cd client
npm run build
```

### Troubleshooting

**MongoDB not running?**
```powershell
Start-Service MongoDB
```

**Port already in use?**
Edit `.env` files to change ports

**Module not found?**
```powershell
npm run install:all
```

## Next Steps

1. **Login** with a seeded account
2. **Upload** your first document
3. **Search** and filter documents
4. **Review** the full README.md for API docs
5. **Customize** for your department needs

## Support
- 📖 Full docs: See README.md
- 🔧 Installation help: See INSTALLATION.md
- 💬 Issues: Create a GitHub issue

**Made with ❤️ by David Selorm Gabion**
