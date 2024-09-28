# Real-time Chat Application

## Project Overview

This is a responsive real-time chat application built using the **MERN stack** (MongoDB, Express, React, Node.js) along with **Socket.io** for real-time communication and **Tailwind CSS** for styling. The application allows users to send messages and share files in real time.
## Features

## [Demo](https://drive.google.com/file/d/1680-N_k4s5hiJ1VXzuRcAKxrAIRghsPK/view?usp=drive_link)

### User Features
- **User Authentication**: Users can register, log in, and log out. Authentication is handled with **JWT tokens**, ensuring secure access.
- **Profile Management**: Users can upload profile pictures or choose profile colors, and manage their profile details.
- **Real-time Messaging**: Instant messaging with real-time updates using **Socket.io**.
- **File Sharing**: Users can send and receive documents and images within the chat interface.

## Tech Stack

### Frontend
- **React**: For building interactive user interfaces.
- **Vite**: A fast build tool used for the development of the React frontend.
- **Tailwind CSS**: Utility-first CSS framework for styling and responsive design.
- **Shadcn**: UI component library used for building interactive elements like tabs and buttons.
- **Axios**: Used for making API requests from the frontend to the backend.
- **Zustand**: A lightweight state management library for handling global states such as user data and authentication status.
- **Socket.io (Client)**: Enables real-time, bi-directional communication between the frontend and the server.

### Backend
- **Node.js**: JavaScript runtime for server-side operations.
- **Express.js**: Web framework for building REST APIs and handling HTTP requests.
- **MongoDB**: NoSQL database for storing user information, messages, and files.
- **Socket.io (Server)**: Handles real-time messaging and communication between users.
- **Bcrypt**: Used for hashing passwords to enhance security.
- **JWT (JsonWebToken)**: For securely managing user sessions.
- **CORS**: Configured to allow secure cross-origin requests between the client and server.

## How It Works

1. **Authentication**: Users sign up or log in using JWT for secure authentication. All passwords are hashed with **bcrypt** before storing in the database.
   
2. **Profile Management**: Users can customize their profiles by uploading images and setting their profile color preferences. The **Multer** middleware is used to handle file uploads, while profile updates are securely stored in **MongoDB**.

3. **Real-time Messaging**: The chat interface allows users to send and receive messages instantly. **Socket.io** manages the real-time connection, ensuring messages are synced across clients without delay.

4. **File Sharing**: Users can upload and share files, such as images and documents, directly within the chat. Uploaded files are stored on the server and can be downloaded by other users in the chat.

5. **Responsive Design**: The frontend is built with **Tailwind CSS**, ensuring that the chat application is responsive.

## Key Implementations

- **Real-time Updates**: Powered by **Socket.io**, users experience real-time interactions as they chat and share files.
- **Secure Authentication**: User credentials are protected with **bcrypt** and JWT, providing secure authentication and session management.
- **File Uploads and Downloads**: Using **Multer** for file uploads and **Axios** for file downloads, users can share and retrieve files effortlessly.
- **Responsive UI**: The use of **Tailwind CSS** ensures that the interface adapts fluidly.

## Setup and Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd react-chat-app
   ```
2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
    cd client
    npm install
   ```

4. **Set Up Environment Variables Create a .env file in the server directory and configure your environment variables:**
   ```bash
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chat-app
    JWT_SECRET=your_jwt_secret
    ORIGIN="http://localhost:5173"
   ```
   
5. **Set Up Environment Variables Create a .env file in the client directory and configure your environment variables:**
   ```bash
    VITE_BACKEND_SERVER_URL='http://localhost:3000'
   ```
   
6. **Start the Backend Server**
   ```bash
   npm start
   ```

7. **Start the Frontend Server**
   ```bash
   npm run dev
   ```
