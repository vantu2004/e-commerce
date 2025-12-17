# E-Commerce MERN Course Project

## Project overview

This repository is a full-stack e-commerce example built during a MERN course. It demonstrates a practical online store with product management, user authentication, shopping cart, coupons, Stripe payments, analytics, and a simple admin UI.

## Key features

- Product listing, categories, and CRUD operations (admin).
- User signup/login with protected routes.
- Shopping cart persisted in Redis (session/store).
- Coupon creation and application.
- Stripe payment integration for checkout.
- Image upload via Cloudinary.
- Basic analytics and order management.

## Repository structure

- backend/: Node/Express API and services.

  - server.js — application entry.
  - controllers/ — route handlers (auth, products, cart, coupon, payment, analytics).
  - routes/ — Express route definitions.
  - models/ — Mongoose models (user, product, order, coupon).
  - lib/ — third-party integrations (Cloudinary, Stripe), and DB/Redis helpers.
  - middleware/ — auth middleware and other request middleware.

- frontend/: Vite + React single-page app.
  - src/ — React components, pages, and state stores.
  - public/ — static assets.

## Getting started

Prerequisites

```

- Node.js (v16+ recommended)
- MongoDB instance (local or hosted)
- Redis (optional but used by the project when enabled)
- A Cloudinary account (for image uploads)
- Stripe account and API keys (for payments)

Install dependencies
```

From the repository root run:

```bash
# install backend deps
cd backend
npm install

# install frontend deps
cd ../frontend
npm install
```

## Environment variables

Create `.env` files for the backend and frontend where required. Minimum variables for backend include:

- `MONGO_URI` — MongoDB connection string.
- `PORT` — backend server port (e.g., 5000).
- `JWT_SECRET` — secret for signing JWT tokens.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials.
- `STRIPE_SECRET_KEY` — Stripe secret key.
- `REDIS_URL` — Redis connection string (if using Redis).

Example backend `.env` (do not commit secrets):

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
PORT=5000
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_...
REDIS_URL=redis://localhost:6379
```

Frontend environment variables (if used) should go into `frontend/.env` and typically include the backend API base URL, e.g. `VITE_API_URL=http://localhost:5000/api` and any public Stripe publishable key for client integration.

## Running locally

Start the backend server (from `backend`):

```bash
npm run dev
# or if there is a script in package.json
node server.js
```

Start the frontend dev server (from `frontend`):

```bash
npm run dev
```

## Building for production

Frontend build (from `frontend`):

```bash
npm run build
```

Serve the built frontend with a static server or integrate with the backend for a single deployment. The backend can be configured to serve the frontend build folder (`frontend/dist`) in production.

## API documentation

Routes live in the `backend/routes` folder. Controllers are in `backend/controllers`. Main entry is [backend/server.js](backend/server.js).

Important files:

- [backend/server.js](backend/server.js) — Express application startup and middleware.
- [backend/controllers/auth.controller.js](backend/controllers/auth.controller.js) — authentication handlers.
- [frontend/src/App.jsx](frontend/src/App.jsx) — React router and top-level app shell.

## Testing

There are no formal tests included by default. To add tests, pick a framework (Jest for backend and frontend, or React Testing Library for React components) and add test scripts to each `package.json`.

## Deployment notes

- Ensure environment variables are set in your host environment (e.g., Vercel, Heroku, DigitalOcean App Platform, or Docker/Kubernetes).
- For simple deployments, build the frontend and serve static files from the backend Express server.
- Use HTTPS in production and set up secure JWT secret storage.

## Security considerations

- Never commit `.env` files or API keys into source control.
- Use strong `JWT_SECRET` values and consider token rotation strategies.
- Validate and sanitize user input on both backend and frontend.
- Limit image upload sizes and check allowed file types.

## Contributing

If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Open a PR with a clear description of changes.

## Contact and license

This project was created as a course example. Update this section with author or license information as appropriate.

## Troubleshooting

- If the backend fails to connect to MongoDB, verify `MONGO_URI` and that MongoDB is running.
- If uploads fail, verify Cloudinary credentials in environment variables.
- If payments fail, verify Stripe keys and webhook configuration.

## Next steps

- Add tests and CI.
- Harden authentication and add role-based access control for admin routes.
- Add pagination, search, and filtering to product lists.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
