# Spead AI - Web Platform

The frontend and CMS monorepo for Spead AI, a secure and contextual AI work assistant.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion.
- **Backend / CMS**: Directus (Headless CMS) via Docker.
- **Database**: SQLite (managed by Directus in Docker).

---

## 🚀 Quick Start Guide

Follow these steps to get the project running locally.

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **Docker Desktop** (running)
- **Git**

### 2. Backend Setup (Directus)
The backend runs in a Docker container to ensure a consistent environment.

1.  **Start the Backend**:
    Run this command in the project root:
    ```bash
    docker compose up -d
    ```
    *Wait about 30-60 seconds for the database to initialize.*

2.  **Access the Admin Dashboard**:
    - URL: [http://localhost:8055/admin](http://localhost:8055/admin)
    - **Email**: `admin@spead.ai`
    - **Password**: `password123`

3.  **Troubleshooting**:
    If the backend fails to start, try resetting it:
    ```bash
    docker compose down
    docker compose up -d
    ```

### 3. Frontend Setup (Next.js)

1.  **Environment Variables**:
    Ensure you have a `.env` file in the root directory with the following content:
    ```env
    NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    DIRECTUS_STATIC_TOKEN= # Optional, for server-side scripts
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **View the Site**:
    - Open [http://localhost:3000](http://localhost:3000)
    - *Note: If port 3000 is busy, Next.js may autoswitch to 3001.*

### 4. Common Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Frontend in dev mode (Hot Reloading). |
| `npm run build` | Build Frontend for production. |
| `npm run start` | Start production Frontend. |
| `docker compose up -d` | Start Backend (Detached mode). |
| `docker compose stop` | Stop Backend. |
| `npx kill-port 3000` | Kill process running on port 3000 (Windows/Mac/Linux). |

---

## 📂 Project Structure

- **/src/app**: Next.js App Router pages (Home, News, Blog).
- **/src/components**: React components (Navbar, Footer, UI).
- **/src/lib**: Utility functions (Directus SDK client).
- **/scripts**: Helper scripts for seeding/fixing Directus data.
- **/directus**: Configurations for the CMS.

## 🛠 Troubleshooting

**"Global Settings Fetched Successfully" not appearing?**
- Ensure Docker is running.
- Ensure `NEXT_PUBLIC_DIRECTUS_URL` matches your Docker port (default 8055).
- Check if `global_settings` collection exists and is Public in Directus.

**Port 3000 Already in Use?**
- Run: `npx kill-port 3000`
- Or simply use the port Next.js assigns (e.g., 3001) as shown in the terminal.
