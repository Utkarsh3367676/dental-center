# Dental Center Management System

![Dental Center](https://img.shields.io/badge/Dental%20Center-1.0.0-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Material UI](https://img.shields.io/badge/Material%20UI-5.11.16-purple)

A comprehensive web application for dental clinic management, providing tools to manage patients, appointments, treatments, and clinic operations. Built with React and Material UI for a modern, responsive user interface.

## 🔗 Live Demo

Visit the live application: [Dental Center App](https://stalwart-cuchufli-041124.netlify.app)

## ✨ Features

### For Administrators
- **Dashboard**: View clinic statistics, upcoming appointments, and key metrics
- **Patient Management**: Create, view, edit, and manage patient profiles
- **Appointment Scheduling**: Schedule, reschedule, and cancel appointments
- **Treatment Records**: Record, track, and manage dental treatments and procedures
- **Calendar View**: Interactive calendar for appointment management

### For Patients
- **Personalized Dashboard**: View upcoming appointments and treatment history
- **Appointment History**: Track past and upcoming dental appointments
- **Treatment Records**: Access personal dental treatment records
- **Profile Management**: Update personal information

## 🛠️ Technology Stack

- **Frontend**: React.js with hooks for state management
- **UI Framework**: Material UI components
- **State Management**: Context API for application state
- **Routing**: React Router for navigation
- **Data Storage**: LocalStorage for data persistence (can be extended to use backend APIs)
- **Deployment**: Netlify for hosting and continuous deployment

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Utkarsh3367676/dental-center.git
   ```

2. Navigate to the project directory:
   ```bash
   cd dental-center
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## 📦 Building for Production

```bash
npm run build
```

The build files will be generated in the `build` directory.

## 🚢 Deployment

The application is configured for easy deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Deploy your site

## 🔐 Authentication

The application includes role-based access control:

- **Admin**: Full access to all features and data
- **Patient**: Limited access to own appointments and treatment records

Default admin credentials for testing:
- Username: `admin`
- Password: `admin123`

## 📋 Project Structure

```
src/
├── components/    # Reusable UI components
├── context/       # React context for state management
├── pages/         # Main application pages
├── services/      # Data and authentication services
└── App.js         # Main application component
```

## 🧩 Future Enhancements

- Backend integration for secure data storage
- Patient appointment booking system
- Notification system for appointment reminders
- Billing and payment processing
- Staff management and scheduling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Contributors

- Utkarsh - Project Lead & Developer

---

© 2025 Dental Center Management System. All rights reserved.
