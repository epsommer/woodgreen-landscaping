'use client'

export function Privacy() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <p>
            At Woodgreen Landscaping, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our website or services.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, and address when you contact us or use our services. We also collect non-personal information such as browser type, IP address, and pages visited on our website.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
          <p>
            We use the information we collect to provide and improve our services, communicate with you, and send you relevant updates and promotions. We do not sell or share your personal information with third parties for marketing purposes.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. If you have any questions or concerns about our Privacy Policy or how we handle your data, please contact us.
          </p>
          <p>
            This Privacy Policy is subject to change without notice. Please check this page periodically for updates.
          </p>
        </div>
      </main>
    </div>
  )
}