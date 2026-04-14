# 🏡 BrickNest Estate App

A full-stack real estate platform built with a production-grade backend architecture and a modern frontend experience.  
It enables users to explore, create, and manage property listings with secure authentication, AI-powered search, and scalable system design.

---

# 🚀 Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (image storage)
- Nodemailer (Gmail OAuth2)

## Frontend

- React.js (Vite)
- Redux Toolkit
- TailwindCSS
- Framer Motion

---

# 🔐 Authentication System

- Email + Password registration
- Google OAuth login
- JWT-based auth (Access + Refresh tokens)
- HTTP-only cookie storage
- Session-based validation (DB-backed)
- Logout (single session + all devices)
- Token rotation (refresh flow)

---

# 🔑 OTP System

- Secure 6-digit OTP generation
- OTP hashing before storage
- Expiry: 5 minutes
- Max 5 attempts
- Rate limiting:
  - 1 per minute
  - 5 per hour
- Use cases:
  - Password reset
  - Account restoration

---

# 👤 User Management

- Get & update profile
- Avatar upload (Cloudinary)
- Change password (with verification)
- Soft delete (deactivation)
- Restore account via OTP
- Invalidate all sessions on password reset
- Favorites system per user

---

# 🏠 Listing Management

- Create, update, delete listings
- Multi-image upload (Cloudinary)
- Ownership validation
- Listing attributes:
  - Price (regular + discount)
  - Bedrooms, bathrooms
  - Furnished, parking
  - Rent / Sell
  - Offer flag

---

# 🤖 AI-Powered Search

- Natural language queries  
  _Example: "cheap 2BHK near city center"_

- AI-driven:
  - Intent extraction
  - Smart filtering
  - Context-aware results

- Hybrid architecture:
  - AI parsing → MongoDB query execution

---

# 🔍 Search & Filtering

- Regex-based name search
- Filters:
  - Type, offer, furnished, parking
- Pagination:
  - Page + limit
- Sorting:
  - Any field (asc/desc)
- Response includes:
  - Total count
  - hasMore flag

---

# ❤️ Favorites System

- Add/remove/toggle favorites
- Stored in user document
- Real-time UI sync

---

# 📊 Activity Logging

Tracks user actions:

- LOGIN, LOGOUT, REGISTER
- PASSWORD UPDATE
- PROFILE UPDATE
- TOKEN REFRESH

Stored data:

- User ID
- IP address
- User agent
- Metadata
- Timestamp

---

# 🔁 Session Management

- Sessions stored in DB
- Hashed refresh tokens
- Device + IP tracking
- Session invalidation:
  - Logout
  - Logout all
- Token rotation supported

---

# 🖼️ File Handling

- Multer for uploads
- Temporary local storage
- Cloudinary integration
- Multiple images per listing
- Auto cleanup on delete

---

# ⚙️ Backend Architecture

- Modular MVC structure
- Centralized error handling
- Custom utilities:
  - ApiError
  - ApiResponse
- Middleware:
  - Auth
  - Error handler
  - File upload
- Logging with Morgan

---

# 📧 Email System

- Nodemailer with Gmail OAuth2
- HTML email templates
- OTP delivery system

---

# 🎨 Frontend Features

## UI/UX

- Grid-based listing layout
- Infinite scrolling
- Skeleton loaders
- Lazy loading

## Filters

- Slide-in filter drawer
- Dynamic filtering + reset

## Authentication

- Login / Register forms
- Google login
- Form validation

## Profile

- Update profile
- Change password modal
- Delete account modal

## Listings

- Create / Update forms
- Property cards
- Detailed view page

## Favorites

- Toggle favorite state
- Synced with backend

## Theme

- Dark / Light mode
- Persistent theme

---

# 🧠 State Management

- Redux Toolkit
- Global user state
- Persisted authentication
- Loading states

---

# 🧭 Routing

- Central route configuration
- Nested routes
- Protected routes

---

# 🔄 System Workflows

## 🔐 Auth Flow

1. Register → Login → Session created
2. Tokens issued → Stored in cookies
3. Protected routes require valid token

## 🔑 OTP Flow

1. Request OTP
2. Store (hashed) + send email
3. Verify → perform action

## 🏠 Listing Flow

1. Create → Upload images → Save
2. Fetch → Paginate → Display
3. Update → Manage images → Save
4. Delete → Remove images + record

## ❤️ Favorites Flow

1. Toggle favorite
2. Update DB
3. Sync UI

## 🔁 Session Flow

1. Login → Create session
2. Validate on each request
3. Logout → Invalidate session

## 🤖 AI Search Flow

1. User enters query
2. AI extracts intent
3. Convert to MongoDB filters
4. Fetch results
5. Return ranked listings

---

# 📁 Project Structure

```
├── backend
│   ├── public
│   ├── src
│   │   ├── config
│   │   │   ├── config.js
│   │   │   └── database.js
│   │   ├── controller
│   │   │   ├── auth.controller.js
│   │   │   ├── favorite.controller.js
│   │   │   ├── listing.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── multer.middleware.js
│   │   ├── models
│   │   │   ├── activity.model.js
│   │   │   ├── listing.model.js
│   │   │   ├── otp.model.js
│   │   │   ├── session.model.js
│   │   │   └── user.model.js
│   │   ├── routes
│   │   │   ├── auth.route.js
│   │   │   ├── favorite.route.js
│   │   │   ├── listing.route.js
│   │   │   └── user.route.js
│   │   ├── services
│   │   │   └── email.service.js
│   │   ├── utils
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── cloudinary.js
│   │   │   ├── logger.js
│   │   │   ├── otp.js
│   │   │   └── session.js
│   │   ├── app.js
│   │   └── constants.js
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── public
│   │   ├── default-user.png
│   │   └── favicon.ico
│   ├── src
│   │   ├── assets
│   │   │   ├── Astra.png
│   │   │   ├── boo.png
│   │   │   ├── login-bg.png
│   │   │   ├── logo-dark.png
│   │   │   ├── logo-light.png
│   │   │   └── register-bg.jpg
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── GlobalLoader.jsx
│   │   │   │   ├── GoogleButton.jsx
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── NotFound.jsx
│   │   │   │   ├── PrivateRoute.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── filters
│   │   │   │   └── FilterDrawer.jsx
│   │   │   ├── home
│   │   │   │   ├── PropertyCard.jsx
│   │   │   │   └── PropertyCardSkeleton.jsx
│   │   │   ├── layout
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── listing
│   │   │   │   ├── CreateListingForm.jsx
│   │   │   │   ├── CreateListingModal.jsx
│   │   │   │   ├── DeleteListingModal.jsx
│   │   │   │   ├── ListingCards.jsx
│   │   │   │   ├── UpdateListingForm.jsx
│   │   │   │   └── UpdateListingModal.jsx
│   │   │   ├── profile
│   │   │   │   ├── DeleteModal.jsx
│   │   │   │   ├── PasswordModal.jsx
│   │   │   │   ├── ProfileActions.jsx
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   ├── ProfileHeader.jsx
│   │   │   │   └── ProfileSkeleton.jsx
│   │   │   └── ui
│   │   │       ├── Carousel.jsx
│   │   │       └── theme-toggle-button.jsx
│   │   ├── containers
│   │   │   ├── auth
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── listing
│   │   │   │   └── ViewMyListing.jsx
│   │   │   ├── user
│   │   │   │   └── Profile.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   └── Search.jsx
│   │   ├── hooks
│   │   │   └── useTheme.js
│   │   ├── lib
│   │   │   └── utils.js
│   │   ├── redux
│   │   │   ├── features
│   │   │   │   └── userSlice.js
│   │   │   ├── persist.js
│   │   │   └── store.js
│   │   ├── routes
│   │   │   └── routesConfig.jsx
│   │   ├── services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── listingService.js
│   │   │   └── userService.js
│   │   ├── styles
│   │   │   └── theme.css
│   │   ├── App.jsx
│   │   ├── firebase.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

---

# 🧪 Key Highlights

- Production-grade authentication system
- Secure session handling with token rotation
- AI-powered semantic search
- Scalable backend architecture
- Real-world feature completeness

---

# ⚡ Getting Started

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🌍 Environment Variables

## Create .env in backend:

```env
PORT=
MONGO_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
```

---

# 📌 Future Improvements

- Redis caching (sessions + OTP)
- Elasticsearch for advanced search
- Notification system
- Admin dashboard
- Payment integration

---

# 🧑‍💻 Author

**_Aakash Kashyap_**
