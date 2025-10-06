#!/bin/bash

case $1 in
  "on"|"ON"|"1"|"true")
    echo "🚧 Enabling maintenance mode..."
    sed -i '' 's/FORCE_MAINTENANCE_MODE=false/FORCE_MAINTENANCE_MODE=true/' .env.local
    ACTION="enabled"
    ;;
  "off"|"OFF"|"0"|"false")
    echo "🔧 Disabling maintenance mode..."
    sed -i '' 's/FORCE_MAINTENANCE_MODE=true/FORCE_MAINTENANCE_MODE=false/' .env.local
    ACTION="disabled"
    ;;
  *)
    echo "Usage: ./toggle-maintenance.sh [on|off]"
    echo "Current status:"
    grep "FORCE_MAINTENANCE_MODE" .env.local
    exit 1
    ;;
esac

# Kill any running dev server
echo "🔄 Restarting development server..."
pkill -f "next dev" 2>/dev/null
sleep 1

# Start dev server in background
npm run dev &

echo "✅ Maintenance mode $ACTION!"
echo "🌐 Visit http://localhost:3000"
