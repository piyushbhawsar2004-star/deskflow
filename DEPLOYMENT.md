# DeskFlow - Deployment Guide

This guide provides step-by-step instructions to deploy DeskFlow to production.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier available)
- Render account (for backend) or Railway account
- Vercel account (for frontend)

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new project named "DeskFlow"
4. Build a cluster:
   - Choose "Free" tier
   - Select your region (closest to your users)
   - Create cluster (takes 1-3 minutes)
5. Set up database user:
   - Click "Database Access"
   - Add New Database User
   - Username: `deskflow-user`
   - Password: Generate a secure password (copy it)
   - Add User
6. Configure Network Access:
   - Click "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - Confirm
7. Get connection string:
   - In Cluster, click "Connect"
   - Choose "Connect your application"
   - Select Node.js driver
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with `deskflow`

Your `MONGODB_URI` will look like:
```
mongodb+srv://deskflow-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/deskflow?retryWrites=true&w=majority
```

## Step 2: GitHub Repository

### Initialize Git (if not already done)

```bash
cd deskflow
git init
git add .
git commit -m "Initial commit: DeskFlow application"
```

### Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `deskflow`
3. Description: "Support Ticket Triage Board - MERN Stack"
4. Choose "Public" or "Private"
5. Click "Create repository"
6. Follow the instructions to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/deskflow.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend to Render

### Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub (recommended for easier integration)

### Deploy

1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Select the `deskflow` repository
5. Configure:
   - **Name**: `deskflow-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or paid for better uptime)
6. Add Environment Variables:
   - Click "Environment"
   - Add variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: `https://deskflow.vercel.app` (update after frontend deployment)
     - `PORT`: `10000` (Render provides this)
7. Click "Create Web Service"

Wait for deployment to complete (3-5 minutes).

Your backend URL will be: `https://deskflow-api.onrender.com`

### Note: Update after frontend deployment

Once you get your Vercel frontend URL, update:
- Render environment variable `FRONTEND_URL` to your Vercel URL
- This enables CORS for your frontend

## Step 4: Deploy Frontend to Vercel

### Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### Deploy

1. In Vercel dashboard, click "Add New..."
2. Select "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: `https://deskflow-api.onrender.com/api` (replace with your Render URL)
6. Click "Deploy"

Wait for deployment (2-3 minutes).

Your frontend URL will be: `https://deskflow.vercel.app`

### Update Backend CORS

1. Go to Render dashboard
2. Select your `deskflow-api` service
3. Go to Environment
4. Update `FRONTEND_URL` to your Vercel URL: `https://deskflow.vercel.app`
5. Redeploy (service redeploys automatically)

## Step 5: Verify Deployment

### Test Backend

```bash
curl https://deskflow-api.onrender.com/api/health
```

Should return: `{"status":"Backend is running"}`

### Test Frontend

Visit `https://deskflow.vercel.app` in your browser

### Test API Integration

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "+ New Ticket" in the app
4. Create a test ticket
5. Check that network requests show successful responses from Render

## Troubleshooting

### Backend not connecting to MongoDB
- Verify MONGODB_URI is correct
- Check MongoDB Atlas Network Access includes 0.0.0.0/0
- Check credentials are URL-encoded

### CORS errors in frontend
- Verify FRONTEND_URL is correctly set in backend environment variables
- Check that it matches your Vercel deployment URL
- Backend must be redeployed after changing FRONTEND_URL

### Frontend can't reach backend API
- Verify VITE_API_URL is correct in Vercel environment variables
- Should be: `https://deskflow-api.onrender.com/api`
- Rebuild/redeploy frontend after changing this

### Render service goes to sleep
- Render free tier services sleep after 15 minutes of inactivity
- Upgrade to paid tier for continuous running
- Or set up cron job to ping the service every 14 minutes

### Vercel build fails
- Check Build Logs in Vercel dashboard
- Ensure `vite.config.js` is properly configured
- Check that all imports are correct
- Verify `.env` variables are set

## Continuous Deployment

Both Render and Vercel automatically redeploy when you push to GitHub:

1. Make code changes
2. Commit and push to GitHub
3. Render/Vercel automatically detects the push
4. Services redeploy automatically

## Monitoring

### Render Dashboard
- View logs in real-time
- Monitor metrics
- See deployment history

### Vercel Analytics
- View deployment history
- Monitor build times
- Check function performance

## Scaling (Future)

### For High Traffic
1. Upgrade MongoDB Atlas to paid tier
2. Enable auto-scaling in Render (paid tier)
3. Enable Vercel Pro for better performance
4. Consider moving to dedicated servers

### Cost Optimization
- Keep free tier services if traffic is low
- Use MongoDB Atlas free tier for development
- Monitor usage to avoid unexpected charges

## Security Notes

- Never commit `.env` files
- Always use environment variables for secrets
- Enable IP whitelist in MongoDB Atlas for production
- Use strong passwords for database users
- Keep dependencies updated: `npm update`

## Support

For issues:
1. Check Render logs: Render dashboard → Service → Logs
2. Check Vercel logs: Vercel dashboard → Deployments → Logs
3. Check browser console: Browser DevTools → Console
4. Check network requests: Browser DevTools → Network

---

**Next Steps**:
1. Set up MongoDB Atlas
2. Create GitHub repository
3. Deploy backend to Render
4. Deploy frontend to Vercel
5. Test the live application
