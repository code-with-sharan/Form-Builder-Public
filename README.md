# Form Builder

A full-stack web application that allows users to create, manage, and share customizable forms. Built with React, Node.js, Express, and MongoDB.

Live Demo: [Form Builder](https://form-builder-eta-seven.vercel.app/)

## Features

### Authentication & Security
- User registration with email verification (OTP)
- Secure login system
- Password reset functionality
- JWT-based authentication
- Encrypted password storage using bcrypt

### Form Creation & Management
- Create custom forms with multiple question types:
  - Short answer
  - Paragraph
  - Multiple choice
  - Checkboxes
  - Linear scale (1-5)
  - Date
- Edit existing forms
- Delete forms
- Save form drafts
- Customize form titles and descriptions

### Form Sharing & Responses
- Share forms via unique links
- Track form submissions
- View individual responses
- Prevent duplicate submissions from same email
- Timestamp tracking for submissions

### User Interface
- Clean, modern design
- Mobile-responsive layout
- Real-time form preview
- Easy navigation between questions and responses
- Toast notifications for user feedback

## Tech Stack

### Frontend
- React.js
- React Router DOM
- React Bootstrap
- React Toastify
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- Nodemailer for email services
- Bcrypt for password hashing
- UUID for unique identifiers
