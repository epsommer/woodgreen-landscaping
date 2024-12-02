'use client'

export function MaintenanceFooter() {
  return (
    <footer className="bg-[#2F3B30] text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Woodgreen Landscaping. All rights reserved.</p>
      </div>
    </footer>
  )
}