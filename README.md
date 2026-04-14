# Task 2: Client Lead Management System (Mini CRM)

This project is part of the **Future Interns Full Stack Web Development** internship.
**Track Code**: FS
**Task Number**: 02

## 🚀 Overview
A high-end, professional Client Lead Management System (Mini CRM) designed for businesses to track and convert leads coming from website contact forms.

## ✨ Features
- **Premium Admin Dashboard**: Real-time stats and lead distribution visualization.
- **Lead Tracking**: View, filter, and search through incoming leads.
- **Status Management**: Update lead pipeline stages (New → Contacted → In Progress → Converted).
- **Secure Access**: JWT-based authentication for the admin panel.
- **Responsive Design**: Elegant UI with glassmorphism and smooth animations.

## 🎨 Theme Colors
- Primary: `#81A6C6`
- Secondary: `#AACDDC`
- Background: `#F3E3D0`
- Accent: `#D2C4B4`

## 🛠️ Tech Stack
- **Frontend**: React (Vite), CSS3, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed.
- MySQL Server running.

### 1. Database Setup
1. Open your MySQL client.
2. Run the commands in `server/database.sql` to create the database and tables.

### 2. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```text
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YourPassword
   DB_NAME=crm_db
   JWT_SECRET=your_jwt_secret
   ```
4. (Optional) Seed the database with dummy data:
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   node index.js
   ```

### 3. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 👤 Admin Access
- **Default Username**: `admin`
- **Default Password**: `admin123` (if seeded)
