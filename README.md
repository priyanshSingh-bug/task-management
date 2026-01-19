# Task Management API 🚀

A RESTful **Task Management Backend API** built using **Node.js, Express, MongoDB, and JWT Authentication**.  
It supports **role-based access control**, task assignment, filtering, and admin operations.

---

## 📌 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (`admin`, `user`)
- Protected routes using middleware

---

### 📝 Task Management
- Create tasks
- Assign tasks to users (admin only)
- View tasks based on role:
  - **Admin** → all tasks
  - **User** → own tasks + assigned tasks
- Update tasks:
  - **Admin / Creator** → update all fields
  - **Assignee** → update status only
- Delete tasks (creator or admin)

---

### 📊 Task Statistics
- Total tasks
- Completed tasks
- Pending tasks
- Tasks grouped by priority
- Different stats for **admin vs user**

---

### 👤 Admin Operations
- Get all users
- Update user role (admin only)
- Delete users

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcrypt**
- **dotenv**
- **nodemon**

---

## 📁 Project Structure

