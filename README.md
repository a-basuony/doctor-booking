<div align="center">

# 🏥 Doctor Booking App

### Modern Healthcare Appointment Management System

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://doctor-booking-team2.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

[Live Demo](https://doctor-booking-team2.vercel.app/) • [Report Bug](https://github.com/a-basuony/doctor-booking/issues) • [Request Feature](https://github.com/a-basuony/doctor-booking/issues)

</div>

---

## 📖 Overview

A **production-ready** healthcare appointment booking platform built with modern web technologies. This application provides a seamless experience for patients to discover doctors, book appointments, manage their medical records, and communicate with healthcare providers......

### ✨ Key Features

- 🔍 **Smart Doctor Search** - Advanced filtering by specialty, location, availability, and ratings
- 📅 **Real-time Booking** - Interactive calendar with live availability updates
- 💳 **Secure Payments** - Integrated Stripe payment processing
- 🗺️ **Location Services** - Interactive maps with Leaflet for finding nearby doctors
- 💬 **Live Chat** - Real-time communication between patients and doctors
- ⭐ **Reviews & Ratings** - Patient feedback and doctor rating system
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🔐 **OAuth Authentication** - Secure login with Google OAuth integration
- 🌙 **Modern UI/UX** - Beautiful interface with Material-UI and Tailwind CSS
- 📊 **Patient Dashboard** - Manage appointments, favorites, and medical history

---

## 🛠️ Tech Stack

### Core Framework

- **[React 19.2](https://reactjs.org/)** - Modern UI library with latest features
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite 7.2](https://vitejs.dev/)** - Lightning-fast build tool and dev server

### UI & Styling

- **[Material-UI (MUI) 7.3](https://mui.com/)** - Comprehensive component library
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion 12.23](https://www.framer.com/motion/)** - Smooth animations
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[React Icons 5.5](https://react-icons.github.io/react-icons/)** - Additional icon sets

### State Management & Data Fetching

- **[TanStack Query 5.90](https://tanstack.com/query)** - Powerful async state management
- **[Axios 1.13](https://axios-http.com/)** - HTTP client for API requests
- **[React Hook Form 7.68](https://react-hook-form.com/)** - Performant form handling
- **[Zod 4.1](https://zod.dev/)** - TypeScript-first schema validation

### Routing & Navigation

- **[React Router DOM 7.10](https://reactrouter.com/)** - Client-side routing

### Additional Libraries

- **[@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)** - Google OAuth integration
- **[Stripe](https://stripe.com/)** - Payment processing
- **[Leaflet](https://leafletjs.com/)** - Interactive maps
- **[React Hot Toast](https://react-hot-toast.com/)** - Elegant notifications
- **[date-fns](https://date-fns.org/)** & **[Day.js](https://day.js.org/)** - Date manipulation
- **[React Slick](https://react-slick.neostack.com/)** - Carousel component

---

## 📁 Project Structure

```
doctor-booking/
├── public/                    # Static assets (images, icons)
├── src/
│   ├── assets/               # Images, fonts, and media files
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Shared components (Button, Input, Card)
│   │   ├── forms/           # Form components
│   │   └── layout/          # Layout components (Navbar, Footer)
│   ├── constants/            # Application constants and config
│   ├── contexts/             # React Context providers
│   ├── data/                 # Static data and mock data
│   ├── hooks/                # Custom React hooks
│   ├── layouts/              # Page layouts
│   ├── pages/                # Page components
│   │   ├── Home/            # Landing page
│   │   ├── Search/          # Doctor search and filters
│   │   ├── DoctorDetails/   # Doctor profile and booking
│   │   ├── Appointment/     # Appointment management
│   │   ├── Profile/         # User profile
│   │   └── Chat/            # Messaging interface
│   ├── services/             # API service layer
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions and helpers
│   ├── App.tsx               # Root application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/a-basuony/doctor-booking.git
cd doctor-booking
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Open `.env` and configure the following variables:

```env
# API Configuration
VITE_PUBLIC_API_KEY=your_api_key_here

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Additional configurations (if needed)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
```

**📝 How to get these values:**

- **API Key**: Contact your backend team or check your API provider dashboard
- **Google OAuth Credentials**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing one
  3. Enable Google+ API
  4. Create OAuth 2.0 credentials
  5. Add authorized redirect URIs
- **Stripe Key**: Get from [Stripe Dashboard](https://dashboard.stripe.com/)

4. **Start the development server**

```bash
npm run dev
```

The application will open at [http://localhost:5173](http://localhost:5173)

---

## 📜 Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build production-ready bundle            |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint to check code quality         |

---

## 🔧 Configuration

### Tailwind CSS

Customize your theme in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: "#your-color",
        // Add custom colors
      },
    },
  },
};
```

### Vite

Modify build settings in `vite.config.ts` for optimization and plugins.

---

## 🌐 Deployment

This project is configured for deployment on **Vercel**.

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/)
3. Configure environment variables in Vercel dashboard
4. Deploy!

For other platforms, build the project and serve the `dist` folder:

```bash
npm run build
```

---

## 📚 Additional Resources

- **[AUTH_FIX.md](./AUTH_FIX.md)** - Authentication troubleshooting guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[.env.example](./.env.example)** - Environment variables reference

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is part of a team development effort. Please contact the repository owner for licensing information.

---

## 👥 Team

Developed by **Team 2** - Healthcare Innovation Project

---

## 📞 Support

If you encounter any issues or have questions:

- 📧 Open an [issue](https://github.com/a-basuony/doctor-booking/issues)
- 📖 Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 💬 Contact the development team

