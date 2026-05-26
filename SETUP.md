# DeskFlow - Quick Start Guide

Complete setup and deployment instructions for DeskFlow application.

## 🚀 Quick Local Setup (5 minutes)

### 1. Backend Setup

```bash
cd backend
npm install
# Create .env file with test MongoDB URI
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/deskflow" > .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env
echo "FRONTEND_URL=http://localhost:5173" >> .env

# Start backend server
npm run dev
```

Backend runs at: `http://localhost:5000`
Health check: `curl http://localhost:5000/api/health`

### 2. Frontend Setup (in new terminal)

```bash
cd frontend
npm install
# Create .env.local file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Test Locally

1. Open browser to `http://localhost:5173`
2. Click "+ New Ticket"
3. Fill form and submit
4. Ticket should appear on the board
5. Drag ticket between columns

## 📋 What You Get

### Backend ✅
- Express.js API server
- MongoDB integration via Mongoose
- Ticket CRUD operations
- SLA calculation (server-side)
- Status transition validation
- Filters: status, priority, SLA breach
- Statistics endpoint
- CORS enabled for frontend
- Error handling and validation

### Frontend ✅
- React 18 with Hooks (no Redux/Context)
- Responsive CSS (mobile-friendly)
- Kanban board with drag-drop
- 7 reusable components
- Form validation (client & server)
- Axios API client
- Loading states
- Error boundaries
- Real-time stats display

## 📦 Project Structure

```
deskflow/
├── backend/
│   ├── models/Ticket.js          # MongoDB schema + validation
│   ├── routes/tickets.js         # 6 API endpoints
│   ├── utils/slaCalculator.js    # SLA logic
│   ├── server.js                 # Express app
│   ├── package.json
│   ├── .env.example
│   └── Procfile (for Render)
├── frontend/
│   ├── src/
│   │   ├── components/           # 7 React components
│   │   ├── api/ticketAPI.js      # Axios wrapper
│   │   ├── App.jsx               # State management
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── vercel.json               # For Vercel deployment
│   └── .env.example
├── README.md                      # Documentation
├── DEPLOYMENT.md                  # Deployment guide
└── .gitignore
```

## 🔗 API Reference

### POST /api/tickets
Create new ticket

```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Login broken",
    "description": "Users cannot login on Chrome",
    "customerEmail": "user@example.com",
    "priority": "urgent"
  }'
```

### GET /api/tickets
Get all tickets with optional filters

```bash
# All tickets
curl http://localhost:5000/api/tickets

# Filter by status
curl http://localhost:5000/api/tickets?status=open

# Filter by priority
curl http://localhost:5000/api/tickets?priority=urgent

# SLA breached only
curl http://localhost:5000/api/tickets?breached=true

# Combined filters
curl http://localhost:5000/api/tickets?status=open&priority=urgent&breached=true
```

### PATCH /api/tickets/:id
Update ticket status

```bash
curl -X PATCH http://localhost:5000/api/tickets/TICKET_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

Valid transitions:
- `open` → `in_progress`
- `in_progress` → `resolved` or `open`
- `resolved` → `closed` or `in_progress`

### DELETE /api/tickets/:id
Delete ticket

```bash
curl -X DELETE http://localhost:5000/api/tickets/TICKET_ID
```

### GET /api/tickets/stats/overview
Get dashboard statistics

```bash
curl http://localhost:5000/api/tickets/stats/overview
```

Response:
```json
{
  "statusCounts": {
    "open": 5,
    "in_progress": 2,
    "resolved": 10,
    "closed": 25
  },
  "priorityCounts": {
    "low": 8,
    "medium": 12,
    "high": 15,
    "urgent": 7
  },
  "breachedOpen": 3,
  "totalTickets": 42
}
```

## 🌍 Production Deployment (30 minutes)

### Prerequisites
- GitHub account
- MongoDB Atlas (free tier)
- Render account (free tier)
- Vercel account (free tier)

### Step 1: MongoDB Atlas

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier)
3. Create database user
4. Whitelist IP (0.0.0.0/0)
5. Get connection string and save it

### Step 2: GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/deskflow.git
git push -u origin main
```

### Step 3: Deploy Backend (Render)

1. Go to https://render.com
2. Click "New Web Service"
3. Connect GitHub repo
4. Configure:
   - Name: `deskflow-api`
   - Build: `cd backend && npm install`
   - Start: `npm start`
5. Add env vars:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://deskflow.vercel.app` (update after frontend)

Backend URL: `https://deskflow-api.onrender.com`

### Step 4: Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Import GitHub repo
3. Configure:
   - Root: `frontend`
   - Build: `npm run build`
   - Output: `dist`
4. Add env var:
   - `VITE_API_URL`: `https://deskflow-api.onrender.com/api`

Frontend URL: `https://deskflow.vercel.app`

### Step 5: Update Backend CORS

1. Go to Render dashboard
2. Update `FRONTEND_URL` to your Vercel URL
3. Redeploy

## ✅ Verification Checklist

### Local
- [ ] Backend starts: `npm run dev` in `backend/`
- [ ] Frontend starts: `npm run dev` in `frontend/`
- [ ] Health check: `curl http://localhost:5000/api/health` returns OK
- [ ] Can create ticket in UI
- [ ] Can drag ticket between columns
- [ ] Stats update automatically
- [ ] Filters work (status, priority, SLA)

### Production
- [ ] MongoDB Atlas cluster created
- [ ] GitHub repository pushed
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Can access frontend at Vercel URL
- [ ] Can create ticket from frontend
- [ ] Network tab shows requests to Render API

## 🐛 Common Issues

### Backend won't start
```
Error: MONGODB_URI is undefined
→ Check .env file exists and has MONGODB_URI
```

```
Error: Port 5000 already in use
→ Change PORT in .env or kill process on port 5000
```

### Frontend shows blank page
```
Error: API not responding
→ Check VITE_API_URL is correct in .env.local
→ Verify backend is running and healthy
```

### CORS errors in console
```
Access-Control-Allow-Origin not set
→ Check FRONTEND_URL in backend .env matches your frontend domain
→ Backend must be redeployed after changing FRONTEND_URL
```

### MongoDB connection failed
```
MongoError: authentication failed
→ Check username and password in MONGODB_URI
→ Ensure password is URL-encoded
→ Check IP whitelist includes 0.0.0.0/0
```

## 📚 File Reference

### Backend Files
- `server.js` - Express app, routes, middleware
- `models/Ticket.js` - MongoDB schema, validation
- `routes/tickets.js` - 6 API endpoints, business logic
- `utils/slaCalculator.js` - SLA calculations (age, breach)

### Frontend Files
- `App.jsx` - State management, main component
- `components/Header.jsx` - Title and new ticket button
- `components/StatsStrip.jsx` - Dashboard stats
- `components/FilterBar.jsx` - Status/priority filters
- `components/Board.jsx` - Kanban board container
- `components/TicketColumn.jsx` - Drag-drop zone
- `components/TicketCard.jsx` - Individual ticket
- `components/CreateTicketModal.jsx` - New ticket form
- `api/ticketAPI.js` - Axios API client

## 🎯 Features Implemented

✅ Complete MERN stack
✅ Drag-and-drop with validation
✅ SLA tracking and breach detection
✅ MongoDB schema with validation
✅ Status transition rules
✅ Responsive CSS (mobile-friendly)
✅ Error handling and loading states
✅ Real-time stats dashboard
✅ Multi-filter support
✅ Form validation (client + server)
✅ CORS configuration
✅ Deployment ready

## 🚀 Bonus: Advanced Features

### Drag-and-drop with validation
- Respects status transition rules
- Visual feedback during drag
- Invalid drops snap back with error

### SLA Calculation
- Automatic age calculation in minutes
- SLA targets: Urgent 1h, High 4h, Medium 24h, Low 72h
- Breach detection for open and resolved tickets

### Statistics
- Total tickets count
- Per-status breakdown
- Per-priority breakdown
- Breached tickets count

## 📞 Support

### Deployment Issues
1. Check Render logs: Dashboard → Service → Logs
2. Check Vercel logs: Dashboard → Deployments → View Logs
3. Check browser console: F12 → Console tab

### API Issues
Use curl to test endpoints:
```bash
curl -v http://localhost:5000/api/tickets
```

### Database Issues
- Test connection in MongoDB Atlas
- Check IP whitelist
- Verify credentials

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [React Hooks](https://react.dev/reference/react)
- [Vite](https://vitejs.dev)

## 📝 Next Steps

1. ✅ Setup complete
2. ✅ Code committed to Git
3. → Create GitHub repository
4. → Deploy backend to Render
5. → Deploy frontend to Vercel
6. → Test live application
7. → Share your app!

---

**Questions?** Check README.md and DEPLOYMENT.md for detailed docs.
