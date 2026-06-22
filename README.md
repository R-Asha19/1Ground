# 🏠 Nestora — Full Stack Real Estate Platform

## Project Structure

```
nestora-backend/
├── server.js                  ← Express entry point
├── package.json
├── .env.example               ← Copy to .env and fill in values
│
├── config/
│   ├── db.js                  ← MongoDB connection
│   ├── cloudinary.js          ← Image upload setup
│   └── seedAdmin.js           ← Creates default admin account
│
├── models/
│   ├── User.js                ← Admin / Owner / Customer schema
│   └── Property.js            ← Property listing schema
│
├── controllers/
│   ├── authController.js      ← register, login, me
│   ├── propertyController.js  ← CRUD for properties
│   └── adminController.js     ← Admin-only operations
│
├── middleware/
│   └── auth.js                ← JWT protect + role authorize
│
├── routes/
│   ├── authRoutes.js
│   ├── propertyRoutes.js
│   └── adminRoutes.js
│
└── frontend/
    ├── index.html             ← Main Nestora site (existing)
    ├── style.css              ← Existing styles
    ├── script.js              ← Existing JS + WhatsApp button
    ├── api.js                 ← Shared API helpers
    ├── login.html             ← Customer + Owner login/register
    ├── admin-login.html       ← Admin-only login
    ├── owner-dashboard.html   ← Owner manages their listings
    └── admin-dashboard.html   ← Full admin control panel
```

---

## ⚡ Setup in 5 Steps

### Step 1 — Install dependencies
```bash
cd nestora-backend
npm install
```

### Step 2 — Create your .env file
```bash
cp .env.example .env
```
Then open `.env` and fill in:
- `MONGO_URI` — from MongoDB Atlas (free at cloud.mongodb.com)
- `JWT_SECRET` — any long random string
- `CLOUDINARY_*` — from cloudinary.com (free account)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your admin credentials

### Step 3 — Start the server
```bash
npm run dev
```
You'll see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Admin account created: admin@nestora.com
🚀 Server running on http://localhost:5000
```

### Step 4 — Open the frontend
Open `frontend/index.html` in a browser (or serve with Live Server in VS Code)

### Step 5 — Test login
- Admin:    Go to `admin-login.html` → use your .env credentials
- Owner:    Go to `login.html` → Register as Owner
- Customer: Go to `login.html` → Register as Customer

---

## 🔗 API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Register owner or customer |
| POST | /api/auth/login | Public | Login (all roles) |
| GET | /api/auth/me | 🔒 All | Get my profile |
| GET | /api/properties | Public | Browse all properties |
| GET | /api/properties/:id | Public | Single property |
| POST | /api/properties | 🔒 Owner/Admin | Post new property |
| PUT | /api/properties/:id | 🔒 Owner/Admin | Update property |
| DELETE | /api/properties/:id | 🔒 Owner/Admin | Delete property |
| GET | /api/properties/owner/my | 🔒 Owner | My listings |
| GET | /api/admin/dashboard | 🔒 Admin | Stats |
| GET | /api/admin/owners | 🔒 Admin | All owners + posts |
| GET | /api/admin/customers | 🔒 Admin | All customers |
| GET | /api/admin/properties | 🔒 Admin | All properties |
| PATCH | /api/admin/users/:id/block | 🔒 Admin | Block/unblock user |
| DELETE | /api/admin/users/:id | 🔒 Admin | Delete user |

---

## 📱 WhatsApp Flow

When a customer clicks "Chat on WhatsApp" on any property:
```
Opens: https://wa.me/<ownerPhone>?text=Hi! I found your property...
```
No backend needed — direct WhatsApp link using the owner's phone number.

---

## 👥 Roles & What They Can Do

| Feature | Customer | Owner | Admin |
|---------|----------|-------|-------|
| Browse properties | ✅ | ✅ | ✅ |
| Contact via WhatsApp | ✅ | ✅ | ✅ |
| Post property | ❌ | ✅ | ✅ |
| Edit own property | ❌ | ✅ | ✅ |
| Delete own property | ❌ | ✅ | ✅ |
| Edit ANY property | ❌ | ❌ | ✅ |
| Delete ANY property | ❌ | ❌ | ✅ |
| View all owners | ❌ | ❌ | ✅ |
| View all customers | ❌ | ❌ | ✅ |
| Block users | ❌ | ❌ | ✅ |

---

## 🚀 Deployment

**Backend:** Deploy to Render.com (free)
1. Push to GitHub
2. New Web Service on Render → connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all .env variables in Render dashboard

**Frontend:** Deploy to Netlify (free)
1. Drag `frontend/` folder to netlify.com/drop
2. Update `API_BASE` in `api.js` to your Render URL

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
- **Auth:** JWT + bcryptjs
- **Images:** Cloudinary + Multer
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **WhatsApp:** wa.me direct links (no API needed)
