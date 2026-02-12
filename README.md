# Crime Report Portal

A full-stack web application for secure crime reporting, case tracking, and role-based case management. The system supports citizens filing complaints, investigators managing assignments, and admins overseeing the workflow.

## Overview

This repository contains two apps:
- `frontend/`: React (Create React App) client
- `backend/`: Node.js + Express API with MongoDB (Mongoose)

## Features

### Citizen (User)
- Register with OTP verification
- Set password and login
- File complaints with optional evidence uploads
- Track complaint status and timeline
- View complaint history
- Manage profile

### Investigator
- OTP-based login
- View assigned cases
- Open and resolve cases
- Add investigation notes and evidence
- Manage investigator profile

### Admin
- View system dashboard and KPIs
- Manage complaints and assignment workflow
- Manage investigators (add, enable/disable)
- View case files and timelines

## Tech Stack

**Frontend**
- React 19
- React Router
- Axios
- Bootstrap / React-Bootstrap

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing

## Project Structure

```
Crime-Report/
  backend/
  frontend/
```

## Getting Started

### 1. Clone the repository

```
git clone <your-repo-url>
cd Crime-Report
```

### 2. Backend setup

```
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=your_super_admin_password
SUPER_ADMIN_JWT_SECRET=your_super_admin_jwt_secret
CORS_ORIGIN=http://localhost:3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=no-reply@crimereport.com
SMTP_SECURE=false
PORT=7000
```

Run the backend:

```
npm run dev
```

### 3. Frontend setup

```
cd ../frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000` and proxies API requests to `http://localhost:7000`.

## Environment Variables

Backend (`backend/.env`):
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `SUPER_ADMIN_EMAIL` - super admin login email (source of truth)
- `SUPER_ADMIN_PASSWORD` - super admin login password (source of truth)
- `SUPER_ADMIN_JWT_SECRET` - JWT signing secret for super admin tokens
- `CORS_ORIGIN` - allowed frontend origins (comma-separated)
- `SMTP_HOST` - SMTP host for OTP email
- `SMTP_PORT` - SMTP port (587 or 465)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - From address for OTP emails
- `SMTP_SECURE` - true/false for SMTPS
- `PORT` - API port (default 7000)

## File Uploads

Evidence files are stored locally in `backend/uploads/`. Accepted formats:
- JPEG
- PNG
- PDF

## API Notes

- Base API path: `/api`
- Auth is handled via JWT tokens stored in `localStorage`

## Scripts

### Backend
- `npm run dev` – start with nodemon
- `npm start` – start with node

### Frontend
- `npm start` – run dev server
- `npm run build` – build for production

## Roadmap Ideas

- Add centralized API configuration in frontend
- Add server-side validation (Joi/Zod)
- Add tests for controllers and UI flows
- Improve accessibility and keyboard navigation
- Add notifications and email integration

## License

This project is currently not licensed. Add a license if you plan to open-source it.
