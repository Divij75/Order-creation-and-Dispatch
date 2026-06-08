# DispatchLog

A lightweight, fullstack order creation and dispatch system designed for logistics monitoring and management.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Divij75/Order-creation-and-Dispatch.git
cd Order-creation-and-Dispatch

# Start backend (terminal 1)
cd backend
npm install
npm start

# Start frontend (terminal 2)
cd ../frontend
npm install
npm run dev
```

- Backend: http://localhost:8080
- Frontend: http://localhost:5173

---

## How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (installed automatically with Node.js)

### 1. Start the Backend
The backend is built with Node.js and Express.
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The backend server will run on [http://localhost:8080](http://localhost:8080).

### 2. Start the Frontend
The frontend is built with React, Vite, and Tailwind CSS.
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend UI will run on [http://localhost:5173](http://localhost:5173).

---

## Architectural Decisions

- **Decoupled REST Architecture**: The system uses a clean separation of concerns with a React frontend communicating asynchronously with a Node.js/Express backend via RESTful APIs. This separation ensures that either side can be rewritten or deployed independently.
- **In-Memory Data & State Synchronization**: For rapid development and simplified execution without external dependencies, application state (orders and drivers) is managed in-memory on the Express server. The frontend synchronizes with this state using clean React hooks (`useEffect`, `useCallback`) and updates views dynamically on mutating actions.
- **Resource Lifecycle Management (Locking & Freeing Drivers)**: Drivers are treated as a shared, finite pool of resources. The architecture enforces strict lifecycle rules:
  - Assigning an order to a driver locks them (`available = false`, `current_order = order_id`).
  - Marking an order as delivered releases the driver (`available = true`, `current_order = 0`).
  - Deleting an active/dispatched order handles the edge case of immediately releasing the driver, preventing resource leaks.
- **State Machine Validation**: The backend validates transitions between order states (`Pending` -> `Dispatched` -> `Delivered`). For example, you cannot directly mark a `Pending` order as `Delivered` without first dispatching it to a driver.
- **Modern React Setup**: The frontend uses Vite for fast development server starts and hot module replacement, coupled with Tailwind CSS for utility-first styling and Lucide icons for semantic UI elements.

---

## Trade-offs & Known Limitations

| Decision | What Was Gained | What Was Sacrificed |
|---|---|---|
| **In-memory storage** | Zero setup, instant run | Data lost on server restart |
| **Monolithic `server.js`** | Simple to understand & run | Harder to scale as routes grow |
| **Single-file `App.jsx` frontend** | Quick to iterate on | Less modular; harder to unit test components in isolation |
| **No authentication** | Faster demo-ready setup | Any user can create, delete, or modify any order |
| **REST over WebSockets** | Simpler server-side logic | Dashboard does not update in real-time across multiple browser tabs |
| **No optimistic UI updates** | UI always reflects true server state | Slight perceived latency on actions |
| **Hardcoded driver pool** | No need for a driver management UI | Cannot add/remove drivers without restarting the server |

---

## Future Improvements (With More Time)

1. **Persistent Database**: Migrate the in-memory arrays to a SQL (e.g., PostgreSQL) or NoSQL (e.g., MongoDB) database to ensure order data and driver status persist between server restarts.
2. **Real-time Dispatch Updates**: Implement WebSockets (e.g., Socket.io) to push dispatch status updates to all connected dashboard instances instantly without needing manual refreshes.
3. **Authentication & Roles**: Implement user authentication (JWT-based) separating Dispatcher roles (who create/delete/assign orders) from Driver roles (who only update order progress).
4. **Unit & Integration Tests**: Add automated test coverage using Jest / Supertest on the backend, and Vitest / React Testing Library on the frontend.
5. **Interactive Map & Route Optimization**: Integrate an interactive mapping service (e.g., Leaflet or Google Maps API) to show live order locations, pickup/delivery points, and suggest optimized routes for drivers.
6. **Dedicated Driver Interface**: Build a responsive mobile view for drivers to manage their queue, accept/reject dispatches, update delivery progress, and capture proof of delivery.
7. **End-to-End Type Safety**: Migrate the Express backend to TypeScript to share type definitions between the frontend and backend, preventing runtime API integration issues.
8. **Structured Logging & Auditing**: Set up a logger (like Winston) with correlation IDs to track lifecycle events of every order for logging and auditing.
9. **Dockerization**: Create Dockerfiles and a `docker-compose.yml` configuration to orchestrate frontend and backend services in isolated containers, aligning local and production setups.
