'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MapPlaceholder() {
  return (
    <Card className="bg-white dark:bg-[#2F3B30] border-0">
      <CardHeader>
        <CardTitle>Find Us</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Map placeholder</p>
        </div>
      </CardContent>
    </Card>
  )
}