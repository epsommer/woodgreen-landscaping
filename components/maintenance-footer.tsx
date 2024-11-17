'use client'

export function MaintenanceFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#2F3B30] dark:bg-black text-white py-4 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {currentYear} Woodgreen Landscaping. All rights reserved.</p>
      </div>
    </footer>
  )
}