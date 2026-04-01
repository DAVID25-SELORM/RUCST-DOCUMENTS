# 📋 Pre-Deployment Checklist

Before deploying to production, ensure you've completed these steps:

## ✅ Security

- [ ] Changed JWT_SECRET from default value
- [ ] Updated all default passwords in seed.js for production
- [ ] Reviewed and updated CORS settings
- [ ] MongoDB Atlas has proper authentication enabled
- [ ] Environment variables are not committed to Git (.env in .gitignore)
- [ ] Sensitive data is not exposed in client-side code

## ✅ Database

- [ ] MongoDB Atlas cluster is running
- [ ] Network Access allows deployment platform IPs (0.0.0.0/0 for cloud deployments)
- [ ] Database user has proper permissions
- [ ] Connection string is correct and tested
- [ ] Database is ready to be seeded with initial users

## ✅ Backend

- [ ] All dependencies are listed in package.json
- [ ] Environment variables are documented
- [ ] API endpoints are tested locally
- [ ] Error handling is implemented
- [ ] Health check endpoint exists (/api/health)
- [ ] File upload size limits are configured
- [ ] CORS is properly configured for production domain

## ✅ Frontend

- [ ] Build command works (`npm run build`)
- [ ] API URL is configurable via environment variable
- [ ] All routes have proper error handling
- [ ] 404 page exists
- [ ] Loading states are implemented
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Assets (logo, images) are accessible

## ✅ Testing

- [ ] Login functionality works
- [ ] Document upload works
- [ ] Document download works
- [ ] Search and filters work
- [ ] User roles and permissions work
- [ ] Forms validate input properly
- [ ] Error messages display correctly

## ✅ Documentation

- [ ] README.md is complete
- [ ] DEPLOYMENT.md contains deployment steps
- [ ] HOSTING.md has quick start guide
- [ ] API documentation is available
- [ ] Environment variables are documented

## ✅ Code Quality

- [ ] Code is formatted consistently
- [ ] Console.logs are removed or disabled in production
- [ ] No hardcoded credentials
- [ ] Comments explain complex logic
- [ ] Dead code is removed

## ✅ Performance

- [ ] Images are optimized
- [ ] Build output is minified
- [ ] Unnecessary dependencies removed
- [ ] API requests are optimized
- [ ] Database queries are indexed

## ✅ Deployment Platform

- [ ] GitHub repository is created and code is pushed
- [ ] Deployment platform account created (Render/Vercel)
- [ ] Environment variables configured on platform
- [ ] Build and deploy settings configured
- [ ] Custom domain configured (if applicable)

## ✅ Post-Deployment

- [ ] Frontend URL is accessible
- [ ] Backend URL is accessible
- [ ] Health check endpoint returns OK
- [ ] Database is seeded with initial users
- [ ] Login works with test credentials
- [ ] All features tested in production
- [ ] SSL certificate is active (HTTPS)
- [ ] Monitoring/logging is set up

## 🔐 Production Passwords

**Important**: Before deploying, update these passwords in `server/seed.js`:

```javascript
// CHANGE THESE FOR PRODUCTION!
const users = [
  {
    // ...
    password: 'CHANGE_THIS_PASSWORD',  // ⚠️ Don't use simple passwords
  }
];
```

## 🚀 Ready to Deploy?

Once all items are checked:

1. Commit all changes: `git add . && git commit -m "Production ready"`
2. Push to GitHub: `git push`
3. Follow [HOSTING.md](HOSTING.md) for deployment steps

---

**Developer**: David Gabion Selorm  
**Date**: April 1, 2026
