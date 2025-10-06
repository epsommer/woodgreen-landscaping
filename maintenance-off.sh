#!/bin/bash
echo "🔧 Disabling maintenance mode..."

# Update .env.local
sed -i '' 's/FORCE_MAINTENANCE_MODE=true/FORCE_MAINTENANCE_MODE=false/' .env.local

# Kill any running dev server
echo "🔄 Restarting development server..."
pkill -f "next dev" 2>/dev/null

# Start dev server in background
npm run dev &

echo "✅ Maintenance mode disabled!"
echo "🌐 Visit http://localhost:3000 to see normal website"
