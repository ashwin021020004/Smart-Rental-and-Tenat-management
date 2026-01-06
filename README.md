# Smart Rental System

A full-stack rental management system with Spring Boot backend and React frontend.

## Features

- **Admin Dashboard**: Manage rooms, view bookings, handle complaints
- **User Dashboard**: View available rooms, book rooms, submit complaints
- **Room Management**: Add, delete, and manage room availability
- **Booking System**: Request and approve room bookings
- **Complaint Management**: Submit and resolve tenant complaints

## Tech Stack

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database
- Maven

### Frontend
- React 19
- React Router
- Axios
- Vite
- CSS

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-rental-system
```

### 2. Backend Setup

```bash
cd smart-rental-backend

# Install dependencies and run
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`

### 3. Frontend Setup

```bash
cd smart-rental-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Add new room
- `DELETE /api/rooms/{id}` - Delete room
- `POST /api/rooms/book` - Book a room

### Bookings
- `GET /api/bookings` - Get all bookings
- `PUT /api/bookings/{id}/status` - Update booking status

### Complaints
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Add complaint
- `PUT /api/complaints/{id}/status` - Update complaint status

## Database

The application uses H2 in-memory database. You can access the H2 console at:
`http://localhost:8081/h2-console`

- JDBC URL: `jdbc:h2:mem:smartrental`
- Username: `sa`
- Password: `password`

## Usage

1. Open `http://localhost:5173` in your browser
2. Login as Admin or User
3. Admin can manage rooms, bookings, and complaints
4. Users can view rooms, make bookings, and submit complaints

## Project Structure

```
smart-rental-system/
├── smart-rental-backend/
│   ├── src/main/java/com/smartrental/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── dto/
│   │   └── SmartRentalBackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── smart-rental-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
