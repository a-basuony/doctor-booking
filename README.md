

#  Doctor Booking App — Frontend

A **modern React + TypeScript** frontend for a Doctor Booking system.  
The app is built using industry-standard tools to ensure high performance, clean architecture, and scalability.

---

## 🧩 Tech Stack

- **React + Vite**  
- **TypeScript**  
- **MUI (Material UI)**  
- **React Query (@tanstack/react-query)**  
- **React Hook Form + Zod**  
- **Axios**  
- **React Router**  
- **Redux Toolkit**  
- **React Icons**

---

## 📦 Recommended Install Order

1️⃣ **React Router + React Query + Axios**

```bash
npm install react-router-dom @tanstack/react-query axios
````

2️⃣ **React Hook Form + Zod**

```bash
npm install react-hook-form zod @hookform/resolvers
```

3️⃣ **MUI (Material UI)**

```bash
npm install @mui/material @emotion/react @emotion/styled
```

4️⃣ **Redux Toolkit**

```bash
npm install @reduxjs/toolkit react-redux
```

---

## 🗂 Project Folder Structure

```
src/
  api/                 # Axios API calls & service files
  components/          # Reusable components (Button, Card, Modal, Input)
  hooks/               # Custom React hooks
  pages/               # Page components (Home, Search, DoctorDetails, Appointment, Favorites, Profile, Chat)
  layouts/             # Layout components (Navbar, Footer, Container)
  store/               # Redux Toolkit slices & store
  utils/               # Utility functions
  types/               # TypeScript types & interfaces
  App.tsx              # Root App component
  main.tsx             # Project entry point
```

---

## ⚡ Basic Setup Steps

### 1. Router & React Query

* Configure routing using React Router DOM (public, private, layout routes)
* Create a global `QueryClient`, and wrap your application with `QueryClientProvider`

### 2. Global Layout & UI Components

* Global layout including **Navbar**, **Footer**, and a main **Container**
* Global reusable components: `Button`, `Input`, `Card`, `Spinner`, `Modal`

### 3. Forms & Validation

* Use **React Hook Form** + **Zod** for form management and schema validation.

### 4. State Management

* Use **Redux Toolkit** (optional, but recommended) — e.g. for authentication or UI state.

### 5. API Calls

* Use **Axios** for API calls.
* Integrate Axios calls with React Query for data fetching, caching, and synchronization.

---

## 📝 Notes

* Styling relies on **MUI** and standard **CSS**.
  No TailwindCSS dependency is included.
* Icons are provided via **React Icons**.
* You are free to add theming, context providers, or additional libraries as needed.

---

## 🚀 Getting Started

```bash
git clone https://github.com/a-basuony/doctor-booking
cd doctor-booking
npm install
npm run dev
```

Then open:
[http://localhost:5173](http://localhost:5173) in your browser.

---

## 📌 Repository

[https://github.com/a-basuony/doctor-booking](https://github.com/a-basuony/doctor-booking)

---


```
```
