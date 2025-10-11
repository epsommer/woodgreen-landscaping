'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Leaf, Phone, Mail } from "lucide-react"

export function MapPlaceholder() {
  return (
    <Card className="bg-white dark:bg-[#2F3B30] border-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-[#2F3B30] dark:text-white">Service Area</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 bg-gradient-to-br from-nature-100 to-nature-200 dark:from-[#2F3B30] dark:to-[#1C1C1C] rounded-lg flex flex-col items-center justify-center p-8 border border-nature-300/30 dark:border-nature-500/20">
          {/* Decorative background elements */}
          <div className="absolute top-4 right-4 opacity-10 dark:opacity-5">
            <Leaf className="w-24 h-24 text-nature-600 dark:text-nature-400" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-10 dark:opacity-5">
            <Leaf className="w-16 h-16 text-nature-600 dark:text-nature-400 rotate-180" />
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-nature-500 mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-[#2F3B30] dark:text-white mb-2">
              Greater Toronto Area
            </h3>

            <p className="text-[#4A5D4C] dark:text-gray-300 mb-4 max-w-md">
              Proudly serving Toronto and surrounding communities with eco-conscious, design-focused landscaping
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-[#4A5D4C] dark:text-gray-400">
                <Phone className="w-4 h-4 text-nature-600 dark:text-nature-400" />
                <span>Contact for service area details</span>
              </div>
              <div className="flex items-center gap-2 text-[#4A5D4C] dark:text-gray-400">
                <Mail className="w-4 h-4 text-nature-600 dark:text-nature-400" />
                <span>Boutique service, one project at a time</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}