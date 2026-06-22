# MandanaPharma Catalog Backend

This is the production-ready MERN backend for the MandanaPharma Catalog system.

## Stack
- Node.js
- Express
- TypeScript
- MongoDB / Mongoose
- JWT Auth & Bcrypt
- Zod (Validation)
- Multer (File uploads)
- Nodemailer (Email service for password resets)

## Getting Started

1. Clone the repository and navigate to the `backend` folder.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in the values (MongoDB URI, JWT secret, SMTP credentials).
4. Run `npm run dev` to start the development server.

## Scripts
- `npm run dev` - Starts dev server using `ts-node-dev` with hot reload.
- `npm run build` - Compiles TypeScript to the `dist/` directory.
- `npm start` - Runs the compiled `dist/server.js`.

## API Documentation

- **Auth endpoints**: `/api/auth/setup`, `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/forgot-password`, `/api/auth/reset-password/:resetToken`, `/api/auth/change-password`
- **Admin Category endpoints**: `/api/categories/*`
- **Admin Tag endpoints**: `/api/tags/*`
- **Admin Product endpoints**: `/api/products/*`
- **Public endpoints (Open, Rate-limited)**: `/api/public/categories`, `/api/public/tags`, `/api/public/products`, `/api/public/products/:slug`

All administrative endpoints are protected by JWT, and specific routes enforce specific roles (`superadmin`, `admin`, `editor`, `viewer`).
