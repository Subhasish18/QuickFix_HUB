# QuickFix_HUB

A MERN-based platform designed to simplify finding and booking trusted providers for everyday home services.  
**Status:** Completed 😊  
**Live Demo:** [QuickFix HUB on Render](https://quickfix-hub-1.onrender.com)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Find and book trusted home service providers quickly.
- Secure authentication and user management.
- Modern responsive UI.
- Provider listings and booking flow.
- Built with scalability and maintainability in mind.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Firebase
- **Other:** JWT, RESTful API, PostCSS, ESLint

---

## Project Structure

```
QuickFix_HUB/
├── backend/            # Express.js, MongoDB, and backend logic
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── db.js
│   ├── firebase.js
│   ├── index.js
│   ├── seed.js
│   ├── package.json
│   └── ...
├── frontend/           # React frontend
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── ...
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Subhasish18/QuickFix_HUB.git
   cd QuickFix_HUB
   ```

2. **Install backend dependencies**
   ```sh
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```sh
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**  
   Rename `.env.example` to `.env` in the backend and frontend folders, and update with your secrets.

5. **Run the backend server**
   ```sh
   cd backend
   npm start
   ```

6. **Run the frontend app**
   ```sh
   cd ../frontend
   npm run dev
   ```

---

## Contributing

Contributions are welcome!  
Please fork the repo, create a new branch, and submit a pull request.

---

## License

This project is for learning and portfolio purposes.  
If you wish to use it in production or commercial projects, please contact the maintainer.

---

**Author:** [Subhasish18](https://github.com/Subhasish18)
