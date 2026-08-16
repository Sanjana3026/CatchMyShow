# 🎬 CatchMyShow

A full-stack movie ticket booking application where users can browse movies, select showtimes and seats, securely make payments, and receive booking confirmations.

## 🔗 Live Demo

🚀 **[View CatchMyShow Live](https://catch-my-show-server.vercel.app/)**

## 🚀 Features

### 👤 User Features
- Browse currently playing movies using the TMDB API
- View movie details, showtimes, and available seats
- Select and reserve seats
- Secure authentication and user management with Clerk
- Make payments using Stripe Checkout
- View booking history
- Add movies to favorites

### 🎟️ Booking System
- Real-time seat selection
- Temporary seat locking to prevent double booking
- Automatic release of reserved seats if payment is not completed within 10 minutes
- Booking status updates after successful payment

### ⚡ Background Workflows
Powered by Inngest:

- Automatically release seats for unpaid bookings
- Send booking confirmation emails
- Notify users when new shows are added
- Scheduled movie show reminders

### 💳 Payments
- Stripe Checkout integration
- Secure payment processing
- Stripe webhooks for asynchronous payment confirmation
- Automatic booking status updates after successful payments

### 📧 Email Notifications
- Booking confirmation emails
- New show notifications
- Automated showtime reminders
- Powered by Nodemailer

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Services & APIs
- Clerk Authentication
- Stripe Payments
- Inngest Background Jobs
- Nodemailer
- TMDB API

### Deployment
- Vercel
- MongoDB Atlas

---

## 🏗️ Architecture

```text
React + Vite Frontend
        │
        ▼
Express.js Backend
        │
 ┌──────┼─────────┐
 ▼      ▼         ▼
MongoDB Stripe    Clerk
        │
        ▼
     Inngest
        │
        ▼
 Email & Background Jobs

 ---
**Developed with ❤️ by [Sanjana](https://github.com)**
