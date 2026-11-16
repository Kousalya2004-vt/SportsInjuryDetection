@echo off
echo ============================================================
echo 🏃 STARTING KINETIQ.AI SPORTS INJURY PREVENTION PLATFORM
echo ============================================================

echo Starting Flask Backend Server (Port 5000)...
start "KinetIQ Backend" cmd /k "cd backend && python app.py"

timeout /t 3

echo Starting Vite Frontend Web App (Port 5173 / 3000)...
start "KinetIQ Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo ✅ Platform Launching!
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:5000
echo ============================================================
