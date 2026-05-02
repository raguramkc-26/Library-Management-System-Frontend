Library Management System (MERN Stack)

A full-stack Library Management System built using the MERN stack that enables users to browse, borrow, reserve, and review books, while providing admins with full control over system operations, moderation, and analytics.

---

Live Demo
- **Frontend:** https://librarymanagemsystem.netlify.app/login  
- **Backend API:** https://library-management-system-backend-jkpg.onrender.com  

---

Demo Credentials
User
- Email: poona@gmail.com  
- Password: poona123  

Admin
- Email: chitra@gmail.com  
- Password: poona123  

---

## Key Highlights
- JWT-based authentication with protected routes  
- Role-based access control (User / Admin)  
- RESTful API architecture  
- Borrow / Return workflow with reservation queue  
- Review system with admin moderation  
- Cloudinary integration for image uploads  
- Razorpay integration for fine payments  
- Email notifications (Nodemailer / Resend)  
- Admin dashboard with analytics  

---

## Revenue Model
The system generates revenue through a **fine-based penalty system** for overdue book returns.

### How it works:
- Each borrowed book has a due date (e.g., 7 days)
- If returned late:
  - A fine is calculated (₹10 per day)
- The user must pay the fine using Razorpay
- After successful payment:
  - Fine is marked as paid
  - Transaction is recorded
  - Revenue is reflected in the admin dashboard

This simulates a real-world library monetization model based on penalties.

---

## User Features
- Secure registration & login (JWT)  
- Browse and search books  
- Borrow available books  
- Reserve unavailable books (queue system)  
- Submit reviews (requires admin approval)  
- View borrowing history  
- Receive notifications  

---

## Admin Features
- Add, edit, delete books  
- Manage users (update roles / delete users)  
- Approve or reject reviews  
- Monitor borrowing activity  
- View system analytics  
- Track revenue from fine payments  

---

Tech Stack
### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### Integrations
- Cloudinary – Image storage  
- Razorpay – Payment processing  
- Nodemailer / Resend – Email service  
- Render – Backend hosting  
- Netlify – Frontend hosting  

---

🏗 Architecture Overview
- Modular backend structure:
  Controller → Route → Middleware → Model  
- Centralized API service layer (frontend)  
- Role-based route protection  
- Clear separation of concerns  

---

📁 Project Structure

### Backend
```
/backend
  /controllers
  /models
  /routes
  /middlewares
  /utils
```

### Frontend
```
/frontend
  /components
  /pages
  /context
  /services
```

---

System Flow
1. User logs in → receives JWT  
2. JWT attached to all API requests  
3. Borrow / Reserve updates database state  
4. Admin moderates reviews before publishing  
5. Notifications & emails triggered  
6. Late returns generate fines  
7. Fine payments processed via Razorpay  
8. Revenue reflected in admin dashboard  

---

Known Limitations
- Review system requires manual admin approval  
- Reservation queue has no expiry logic  
- Email retry mechanism not implemented  
- Limited pagination and filtering  

---

Future Improvements
- Real-time notifications (Socket.io)  
- Advanced analytics dashboard  
- Automated fine reminders  
- Reservation expiry system  
- Mobile-first UI improvements  
- Redis-based queue for scalability  

---
Environment Variables
Create a `.env` file in `/backend`:

```
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
RESEND_API_KEY=
CLOUDINARY_URL=
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
```

---

API Documentation
https://documenter.getpostman.com/view/11270312/2sBXqDuPWg  

---

Author
**Raguram KC**

---

Final Note

This project demonstrates full-stack development skills including authentication, role-based access control, API design, and third-party integrations. It goes beyond basic CRUD by implementing real-world workflows such as borrowing systems, moderation pipelines, and revenue generation through fine payments.
