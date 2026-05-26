# DeskFlow – Support Ticket Triage Board

A production-ready MERN stack application for managing support tickets with drag-and-drop workflow automation, SLA tracking, and real-time status updates.

## 🎯 Features

- **Ticket Management**: Create, read, update, and delete support tickets
- **Kanban Board**: Drag-and-drop tickets between status columns (Open → In Progress → Resolved → Closed)
- **SLA Tracking**: Automatic SLA breach detection based on priority levels
- **Priority Levels**: Urgent (1h), High (4h), Medium (24h), Low (72h)
- **Filtering**: Filter by status, priority, and SLA breach status
- **Real-time Stats**: Dashboard with ticket counts and SLA metrics
- **Responsive Design**: Mobile-friendly UI
- **Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error messages and graceful fallbacks

## 📋 Project Structure

```
deskflow/
├── backend/                 # Express.js backend
│   ├── models/
│   │   └── Ticket.js       # MongoDB ticket schema
│   ├── routes/
│   │   └── tickets.js      # API routes
│   ├── utils/
│   │   └── slaCalculator.js # SLA logic
│   ├── server.js           # Express server
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/
│   │   │   └── ticketAPI.js # Axios API client
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── README.md
└── .gitignore
```

## 🔧 Tech Stack

- **Frontend**: React 18, Vite, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Styling**: Pure CSS (responsive)
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/deskflow
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start development server:
```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```
VITE_API_URL=http://localhost:5000/api
```

Start development server:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## 🚀 API Endpoints

### Tickets

**Create Ticket**
```
POST /api/tickets
{
  "subject": "Login page broken",
  "description": "Users cannot login",
  "customerEmail": "user@example.com",
  "priority": "high"
}
```

**Get All Tickets**
```
GET /api/tickets
GET /api/tickets?status=open
GET /api/tickets?priority=urgent
GET /api/tickets?breached=true
GET /api/tickets?status=open&priority=urgent&breached=true
```

**Get Single Ticket**
```
GET /api/tickets/:id
```

**Update Ticket Status**
```
PATCH /api/tickets/:id
{
  "status": "in_progress"
}
```

**Delete Ticket**
```
DELETE /api/tickets/:id
```

**Get Statistics**
```
GET /api/tickets/stats/overview
{
  "statusCounts": { "open": 5, "in_progress": 2, "resolved": 10, "closed": 25 },
  "priorityCounts": { "low": 8, "medium": 12, "high": 15, "urgent": 7 },
  "breachedOpen": 3,
  "totalTickets": 42
}
```

## 📊 Ticket Schema

```javascript
{
  _id: ObjectId,
  subject: String,              // Required
  description: String,          // Required
  customerEmail: String,        // Required, valid email
  priority: "low|medium|high|urgent",  // Required
  status: "open|in_progress|resolved|closed",  // Default: open
  createdAt: Date,              // Auto-generated
  resolvedAt: Date,             // Set when moving to resolved
  ageMinutes: Number,           // Calculated server-side
  slaBreached: Boolean          // Calculated server-side
}
```

## ✅ Business Rules

### Status Transitions
- `open` → `in_progress`
- `in_progress` → `resolved` or `open`
- `resolved` → `closed` or `in_progress`
- `closed` → no transitions

Invalid transitions return HTTP 400 error.

### SLA Targets
- **Urgent**: 1 hour
- **High**: 4 hours
- **Medium**: 24 hours
- **Low**: 72 hours

### SLA Breach
Occurs when:
- Unresolved ticket exceeds its SLA target
- Resolved ticket was resolved after its SLA target

## 🎨 Frontend Components

- **Header**: Application title and "New Ticket" button
- **StatsStrip**: Dashboard showing ticket counts and SLA metrics
- **FilterBar**: Status, priority, and SLA filters
- **Board**: Kanban board with 4 columns
- **TicketColumn**: Drag-and-drop column for tickets
- **TicketCard**: Individual ticket display with drag handle
- **CreateTicketModal**: Form to create new tickets

## 🚢 Deployment

### Backend (Render)

1. Push code to GitHub
2. Connect GitHub repository to Render
3. Set environment variables:
   - `MONGODB_URI`
   - `PORT`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-vercel-frontend.vercel.app`
4. Deploy from `backend` directory
5. Set start command: `npm start`

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables:
   - `VITE_API_URL=https://your-render-backend.onrender.com/api`
6. Deploy

## 🧪 Testing

### Local Testing

Backend health check:
```bash
curl http://localhost:5000/api/health
```

Create test ticket:
```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test",
    "description": "Test description",
    "customerEmail": "test@example.com",
    "priority": "high"
  }'
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure credentials are URL-encoded

### CORS Error
- Update `FRONTEND_URL` in backend `.env`
- Restart backend after changing `FRONTEND_URL`

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/deskflow
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

DeskFlow Team

---

**Deployed URLs** (will be updated after deployment)
- Frontend: `https://deskflow.vercel.app`
- Backend: `https://deskflow-api.onrender.com`
- GitHub: `https://github.com/yourusername/deskflow`
