# 🦷 The Digital Lounge — Precision Oral Care Portal

Welcome to **The Digital Lounge**, a responsive, high-fidelity full-stack web application built with React, Vite, Tailwind CSS, Express, and MongoDB. The application provides an elegant, modern, high-tech patient hub for specialized dentistry, featuring interactive diagnostics, live appointment booking, customized practitioner profiles, and full-stack administrative content controllers.

---

## 🛠️ Technological Stack

*   **Frontend**: React 18+, Tailwind CSS, Framer Motion (`motion/react` animations), Lucide icons.
*   **Backend**: Node.js, Express framework, server-side REST API controllers.
*   **Database**: Dual-engine storage pattern:
    *   **Primary Database**: **MongoDB** with **Mongoose ODM** schemas.
    *   **Fallback Storage**: Automatic **local state file cache** (`data-store.json`) for effortless, server-restart resistant mock execution in sandboxes or situations without a running MongoDB cluster.
*   **Build Pipeline**: Vite compilation of browser assets, integrated with **esbuild** compiling the Node.js TypeScript server into a self-contained production bundle (`dist/server.cjs`) to ensure lightning-fast cold-start launches.

---

## ⚙️ Environment Configuration

The application is fully configurable via standard environment variables. Set these in a `.env` file at the root directory in local environments:

```env
# Optional MongoDB connection URI. If omitted, the server operates on fallback dynamic JSON cache.
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/thedigitallounge"

# Target port for ingress (defaults to 3000)
PORT=3000

# Administrator credentials for dashboard edits
ADMIN_EMAIL="admin@thedigitallounge.com"

# SMTP Relay Host parameters (for simulated patient inquiry delivery logs)
SMTP_HOST="smtp.resend.com"
```

---

## 🚀 Quick Start — Local Development

Follow these steps to configure and run the application locally in development mode:

### 1. Install Project Dependencies
Run npm installer to pull all framework and engine modules:
```bash
npm install
```

### 2. Boot the Development Stack
Start the integrated multi-environment server. This launches the Express backend which handles file assets via Vite's middleware proxy helper on port **3000**:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application with hot module replacement and live database routing.

---

## 🏗️ Production Compilation

Before deploying the portal to production environments, generate the optimized bundles for server and client.

### Compile Assets & Server
Execute the production build script:
```bash
npm run build
```

This single command triggers a dual build phase:
1.  **Vite Compiler**: Compiles the client-side SPA, optimizing styles, tree-shaking scripts, and exporting minified assets to the `/dist` directory.
2.  **esbuild Compiler**: Transpiles and bundles `server.ts` alongside its relative endpoints into a single, high-performance CommonJS file at `dist/server.cjs`. This bundles external paths safely and bypasses Node relative importing resolution issues on standard runtimes.

---

## ☁️ Deployment Instructions

Once compiled, you can host the application on any standard container system, server runtime, or platform service.

### 1. Standalone Host (VPS, Compute Engine, AWS EC2)
Transfer the project directory containing `package.json`, `dist/`, and production dependencies, configure your ports, then:
```bash
# Configure Environment Target
export NODE_ENV=production

# Boot the Standalone Compiler Server
npm run start
```
The server will boot from `/dist/server.cjs` and automatically serve client routes and API endpoints on port `3000`.

### 2. Micro-Container Deployments (Google Cloud Run, AWS ECS, Render)
The application can be instantly containerized using a lightweight Dockerfile. Below is a production-hardened target template:

```dockerfile
# Use precise slim Node image
FROM node:20-slim as builder

WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install standard development dependencies 
RUN npm ci

# Copy complete project parameters 
COPY . .

# Compile application browser client and Server assets
RUN npm run build \
    && npm prune --production

# Use light production runtime
FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy node-modules and bundled compilation outcomes
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist

# Expose active Port 3000
EXPOSE 3000

# Start deployment server
CMD ["node", "dist/server.cjs"]
```

Build, tag, and publish the container image to your container registry (e.g., Google Artifact Registry) and deploy, binding port 3000 to your application's external ingress traffic.

---

## 🔐 Administrative Access & Portals

*   **Role Identification**: The system supports secure medical roles.
*   **Default login**: Login using the email `dr.vance@thedigitallounge.com` (password: `admin123`) from the **Login** tab on the header.
*   **Symmetric Actions**: Once authenticated, the **Admin Panel** tab appears on the navigation bar, enabling you to edit clinic content, add doctors, complete walk-in check-ins, advance treating patient queues, and read live inbox enquiries.
