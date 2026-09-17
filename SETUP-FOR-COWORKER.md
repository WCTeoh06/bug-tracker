# Bug Tracker — setup on your machine

This zip is the app's source code (`node_modules`, the `.next` build
folder, and `.env` are left out on purpose — the first two are big and
regenerate automatically, and `.env` holds real secrets that shouldn't
travel over email/chat).

1. Unzip this somewhere on your machine (e.g. Desktop), so you have a
   `bug-tracker` folder with `app/`, `components/`, `lib/`, etc. in it.
2. You need **Node.js 20+** installed.
3. Copy `.env.example` to `.env` and fill in the real values — ask
   [whoever set this up] for:
   - `DATABASE_URL` — same shared PostgreSQL server everyone points at
   - `AUTH_PASSWORD` — the shared team login password
   - `SESSION_SECRET` — can be your own random 32+ char string (generate
     with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
     — it only needs to be consistent with itself, not shared with anyone else's.
4. Run it:
   - Windows: double-click `start.bat`
   - macOS/Linux: `chmod +x start.sh && ./start.sh` (first time only)

   This installs dependencies, applies database migrations, builds, and
   starts the app at `http://localhost:3000` — reachable only from your
   own machine, same as the original install.
5. Log in with the shared password and your own display name.

See `README.md` for everything else (API surface, the MCP agent tools,
security model).
