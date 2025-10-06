#!/bin/bash
echo "🚧 Enabling maintenance mode..."

# Update .env.local
sed -i '' 's/FORCE_MAINTENANCE_MODE=false/FORCE_MAINTENANCE_MODE=true/' .env.local

# Kill any running dev server
echo "🔄 Restarting development server..."
pkill -f "next dev" 2>/dev/null

# Start dev server in background
npm run dev &

echo "✅ Maintenance mode enabled!"
echo "🌐 Visit http://localhost:3000 to see maintenance page"
