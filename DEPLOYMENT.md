# 🚀 Render Deployment Guide

This guide will help you deploy both your frontend (Vue.js) and backend (Python/FastAPI) on Render.

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Backend Code**: Make sure your backend is ready for deployment

## 🔧 Backend Deployment (Deploy First!)

### Step 1: Prepare Backend
Your backend should have these files:
- `requirements.txt` (Python dependencies)
- `main.py` or `app.py` (FastAPI app)
- `Dockerfile` (optional but recommended)

### Step 2: Deploy Backend on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your backend folder
5. Configure:
   - **Name**: `wellness-tracker-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or paid for better performance)

### Step 3: Get Backend URL
After deployment, you'll get a URL like:
`https://wellness-tracker-backend.onrender.com`

## 🎨 Frontend Deployment

### Step 1: Update API URL
Update your frontend's API configuration:

```typescript
// In src/services/api.ts
baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.onrender.com'
```

### Step 2: Deploy Frontend on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Select your frontend folder
5. Configure:
   - **Name**: `wellness-tracker-frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: `https://your-backend-url.onrender.com`
     - `NODE_ENV`: `production`

### Step 3: Alternative - Web Service Deployment
If you prefer a web service (recommended for better control):

1. Click **"New +"** → **"Web Service"**
2. Configure:
   - **Name**: `wellness-tracker-frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run preview`
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: `https://your-backend-url.onrender.com`

## 🔗 Connecting Frontend to Backend

### CORS Configuration
Make sure your backend has CORS enabled:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-url.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variables
Set these in your backend service:
- `DATABASE_URL`: Your database connection string
- `SECRET_KEY`: Your JWT secret key
- `ALLOWED_ORIGINS`: Your frontend URL

## 📝 Step-by-Step Deployment

### 1. Backend Deployment
```bash
# 1. Push backend to GitHub
git add .
git commit -m "Prepare backend for deployment"
git push origin main

# 2. Deploy on Render
# - Go to render.com
# - Create new Web Service
# - Connect GitHub repo
# - Select backend folder
# - Configure settings
# - Deploy!
```

### 2. Frontend Deployment
```bash
# 1. Update API URL in your code
# Replace localhost:8001 with your backend URL

# 2. Push frontend to GitHub
git add .
git commit -m "Prepare frontend for deployment"
git push origin main

# 3. Deploy on Render
# - Create new Static Site or Web Service
# - Connect GitHub repo
# - Select frontend folder
# - Configure build settings
# - Deploy!
```

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Add frontend URL to backend CORS origins
   - Check if backend is running

2. **API Connection Issues**
   - Verify `VITE_API_BASE_URL` is correct
   - Check backend logs in Render dashboard

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

4. **Environment Variables**
   - Make sure all required env vars are set
   - Check variable names match exactly

### Debugging Steps:
1. Check Render service logs
2. Test API endpoints directly
3. Verify environment variables
4. Check CORS configuration

## 🎯 Final URLs

After deployment, you'll have:
- **Frontend**: `https://wellness-tracker-frontend.onrender.com`
- **Backend**: `https://wellness-tracker-backend.onrender.com`

## 💡 Pro Tips

1. **Use Environment Variables**: Never hardcode URLs
2. **Enable Auto-Deploy**: Connect to GitHub for automatic deployments
3. **Monitor Logs**: Check Render dashboard for any issues
4. **Test Thoroughly**: Test all features after deployment
5. **Database**: Consider using Render's PostgreSQL addon for production

## 🔄 Continuous Deployment

Once set up, every push to your main branch will automatically deploy both services!

---

**Need Help?** Check Render's documentation or contact their support team.
