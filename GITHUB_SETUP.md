# GitHub Repository Setup Instructions

## 1. Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `sales-kpi-dashboard`
5. Description: `Sales KPI Analytics Dashboard - Real-time analytics frontend with React/TypeScript`
6. Visibility: Public (or Private if you prefer)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## 2. Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands in this directory:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sales-kpi-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 3. Repository Structure

This repository contains:
- **Frontend**: React/TypeScript dashboard with Vite
- **API Integration**: Complete backend connectivity
- **Components**: Reusable UI components with Radix UI
- **Pages**: Overview, Metrics, Insights, Alerts, Analysis
- **Deployment**: Ready for Vercel deployment

## 4. Next Steps

1. Push to GitHub using the commands above
2. Connect to Vercel for automatic deployment
3. Deploy backend on Supabase
4. Update environment variables with backend URL

## 5. Environment Variables

The frontend uses these environment variables:
- `VITE_API_URL` - Backend API URL (localhost:8000 for development, Supabase URL for production)

Create `.env.local` for development:
```env
VITE_API_URL=http://localhost:8000
```

For production on Vercel, set the environment variable in the Vercel dashboard.
