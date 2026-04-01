# Regent University College of Science and Technology - Document Management System

A comprehensive, secure Document Management System (DMS) designed for Regent University College of Science and Technology (RUCST). Built with modern web technologies for efficient document storage, retrieval, and management across all university departments.

![Project Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**Prepared by:** David Selorm Gabion  
**Date:** March 12, 2026

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Departments](#departments)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The Regent University DMS is a full-stack web application that replaces physical document storage with a secure, digital solution. It provides:

- **Secure Storage**: Documents are encrypted and stored safely
- **Quick Retrieval**: Advanced search and filtering capabilities
- **Access Control**: Department-based permissions and role management
- **Audit Trail**: Complete logging of all document activities
- **Version Control**: Track document changes and maintain history

---

## ✨ Features

### Core Features
- ✅ **Secure Authentication & Authorization** - JWT-based authentication with role-based access control
- ✅ **Document Upload & Management** - Support for PDF, Word, Excel, images, and text files
- ✅ **Advanced Search** - Full-text search with filters by category, year, and tags
- ✅ **Version Control** - Automatic versioning for document updates
- ✅ **Audit Logging** - Complete activity tracking for compliance
- ✅ **Department Isolation** - Each department has its own secure space
- ✅ **Responsive Design** - Beautiful UI with Lovable/shadcn design system
- ✅ **File Download** - Secure document download with access logs

### Department-Specific Features

#### Registry
- Student admission records management
- Academic transcripts storage
- Graduation documentation
- Meeting minutes (RUTA, Academic Board, Management)

#### Accounts
- Financial records and reports
- Payment statements
- Budget documents
- Audit documentation

#### Quality Assurance
- Accreditation documents
- Program review reports
- Compliance records
- Quality assurance documentation

#### Presidency
- Strategic plans
- Governing council reports
- Institutional policies
- High-level memoranda

#### VP Academics
- Curriculum approvals
- Faculty reports
- Academic policy documentation
- Department submissions

---

## 🏛️ Departments

The system supports 5 main departments:

1. **Registry** - Academic and student records
2. **Accounts** - Financial documentation
3. **Quality Assurance** - Academic standards and accreditation
4. **Presidency** - High-level institutional documents
5. **VP Academics** - Academic leadership documentation

Each department has:
- Dedicated dashboard
- Isolated document storage
- Department-specific access control
- Custom categorization

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: Helmet, bcryptjs, CORS

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Handling**: React Dropzone

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**: ESLint, TypeScript
- **Development Server**: Nodemon, Vite HMR

---

## 📁 Project Structure

```
Document Management System/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── layouts/            # Layout components
│   │   ├── lib/                # Utilities and API client
│   │   ├── pages/              # Page components
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # TypeScript type definitions
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # App entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Static assets
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.ts          # Vite configuration
│
├── server/                      # Backend Node.js application
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   └── database.js     # MongoDB connection
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── documentController.js
│   │   │   └── adminController.js
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.js         # Authentication middleware
│   │   │   ├── upload.js       # File upload middleware
│   │   │   └── error.js        # Error handling
│   │   ├── models/             # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Document.js
│   │   │   └── AuditLog.js
│   │   ├── routes/             # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── documentRoutes.js
│   │   │   └── adminRoutes.js
│   │   └── server.js           # Server entry point
│   ├── uploads/                # Document storage (created automatically)
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Environment variables template
│
├── package.json                # Root package.json
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **MongoDB** 6.x or higher (local or cloud)
- **Git** (for version control)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "Document Management System"
```

### Step 2: Install Dependencies

Install all dependencies for both frontend and backend:

```bash
npm run install:all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 3: Set Up Environment Variables

#### Backend (.env)

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/regent_dms

# JWT Secret (Change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# CORS
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)

Create a `.env` file in the `client` directory:

```bash
cd ../client
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

Ensure MongoDB is running on your system:

```bash
# For Windows (if installed as service)
net start MongoDB

# For macOS/Linux
mongod --dbpath /path/to/your/data/directory
```

### Step 5: Start the Application

From the root directory:

```bash
# Start both frontend and backend concurrently
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## ⚙️ Configuration

### Database Configuration

The default MongoDB connection string is `mongodb://localhost:27017/regent_dms`. To use MongoDB Atlas or another cloud provider:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/regent_dms?retryWrites=true&w=majority
```

### File Upload Configuration

Default file upload settings:
- **Max File Size**: 10MB (configurable via `MAX_FILE_SIZE`)
- **Allowed Types**: PDF, Word, Excel, Images, Text files
- **Storage Path**: `./uploads` (configurable via `UPLOAD_PATH`)

To change the maximum file size:

```env
MAX_FILE_SIZE=20971520  # 20MB in bytes
```

### Security Configuration

**Important**: Change the JWT secret in production:

```env
JWT_SECRET=generate-a-secure-random-string-here
```

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📖 Usage

### Creating Your First User

1. Start the application
2. Navigate to http://localhost:5173
3. Use the register endpoint via API or create a user directly in MongoDB:

**Using API (Postman/cURL)**:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "admin@regent.edu",
    "password": "password123",
    "department": "registry",
    "role": "admin"
  }'
```

### Logging In

1. Visit http://localhost:5173/login
2. Enter your email and password
3. Click "Sign In"

### Uploading Documents

1. Navigate to **Dashboard > Upload**
2. Drag and drop or click to browse for a file
3. Fill in document details:
   - Title (required)
   - Description
   - Category (required)
   - Document Type (required)
   - Year
   - Access Level
   - Tags
4. Click "Upload Document"

### Searching Documents

1. Navigate to **Dashboard > Documents**
2. Use the search bar to search by title, description, or tags
3. Apply filters:
   - Category filter
   - Year filter
4. Click on a document to view details
5. Download documents as needed

### Managing Users (Admin Only)

Admin and Super Admin users can:
- View all users
- Create new users
- Update user information
- Deactivate users
- View audit logs

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Document Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/documents` | Get all documents | Yes |
| POST | `/api/documents` | Upload document | Yes |
| GET | `/api/documents/:id` | Get document by ID | Yes |
| PUT | `/api/documents/:id` | Update document | Yes |
| DELETE | `/api/documents/:id` | Delete document | Yes |
| GET | `/api/documents/:id/download` | Download document | Yes |
| GET | `/api/documents/stats` | Get statistics | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/users/:id` | Get user by ID | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/audit-logs` | Get audit logs | Admin |

### Request Examples

**Upload Document**:

```bash
curl -X POST http://localhost:5000/api/documents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "title=Student Transcript" \
  -F "description=Academic transcript for student" \
  -F "department=registry" \
  -F "category=Student Records" \
  -F "documentType=Transcript" \
  -F "tags=transcript,academic,2026"
```

**Search Documents**:

```bash
curl -X GET "http://localhost:5000/api/documents?search=transcript&category=Student Records&year=2026" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔒 Security

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: user, admin, super_admin roles
- **Department Isolation**: Users can only access their department's documents

### Data Protection

- **CORS**: Configured to allow only specified origins
- **Helmet**: Security headers for Express
- **Input Validation**: Server-side validation for all inputs
- **File Type Validation**: Only allowed file types can be uploaded
- **File Size Limits**: Maximum file size enforced

### Audit Trail

All actions are logged including:
- User login/logout
- Document upload
- Document view
- Document download
- Document edit
- Document delete

### Best Practices

1. **Change default JWT secret** in production
2. **Use HTTPS** in production
3. **Regular backups** of MongoDB database
4. **Keep dependencies updated** for security patches
5. **Use strong passwords** for user accounts
6. **Enable MongoDB authentication** in production

---

## 🧪 Testing

### Manual Testing

1. **Authentication**:
   - Register a new user
   - Login with credentials
   - Access protected routes

2. **Document Management**:
   - Upload various file types
   - Search and filter documents
   - Download documents
   - Update document metadata

3. **Access Control**:
   - Verify department isolation
   - Test role-based permissions
   - Check admin-only features

### Production Deployment

Before deploying to production:

1. **Update environment variables**:
   ```env
   NODE_ENV=production
   JWT_SECRET=<secure-random-string>
   MONGODB_URI=<production-mongodb-uri>
   CLIENT_URL=<production-frontend-url>
   ```

2. **Build frontend**:
   ```bash
   cd client
   npm run build
   ```

3. **Configure reverse proxy** (Nginx/Apache)
4. **Set up SSL certificates** (Let's Encrypt)
5. **Configure MongoDB backups**
6. **Set up monitoring** and logging

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**David Selorm Gabion**  
Prepared for: Regent University of Science and Technology  
Date: March 12, 2026

---

## 🙏 Acknowledgments

- Regent University of Science and Technology
- All departments participating in the DMS initiative
- Open source community for the amazing tools and libraries

---

## 📞 Support

For issues, questions, or feature requests, please contact:
- Email: support@regent.edu
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

## 🔄 Version History

- **v1.0.0** (March 2026) - Initial release
  - Core document management features
  - 5 department modules
  - Authentication & authorization
  - Audit trail logging
  - Modern UI with shadcn/ui

---

**Made with ❤️ for Regent University of Science and Technology**
