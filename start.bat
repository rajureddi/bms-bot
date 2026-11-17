@echo off
echo Starting Docker containers (PostgreSQL + Redis)...
docker-compose up -d

echo.
echo Starting BMS Bot in development mode...
yarn dev
pause
