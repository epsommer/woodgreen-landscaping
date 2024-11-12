"use client";

import Image from "next/image";
import Link from "next/link";

export function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/woodgreen-landscaping-icon.svg" // Path to your custom logo
              alt="Woodgreen Landscaping Logo" // Alternative text
              width={32} // Specify the width
              height={32} // Specify the height
              className="text-green-600" // Apply any necessary styles
            />
            <span className="text-xl font-bold">Woodgreen Landscaping</span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-600 hover:text-green-600"
            >
              Services
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-600">
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-green-600"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-green-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl mb-8">Last updated: June 1, 2024</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Woodgreen Landscaping (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
                &ldquo;us&rdquo;) is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website or use our
                services.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                2. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information that you provide directly to us, such as
                when you fill out a contact form, request a quote, or
                communicate with us via email or phone. This may include your
                name, email address, phone number, and any other information you
                choose to provide.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                3. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>
                  Communicate with you about our services, offers, and
                  promotions
                </li>
                <li>
                  Monitor and analyze trends, usage, and activities in
                  connection with our services
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                4. Sharing of Information
              </h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personally
                identifiable information to outside parties. This does not
                include trusted third parties who assist us in operating our
                website, conducting our business, or servicing you, as long as
                those parties agree to keep this information confidential.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">5. Data Security</h2>
              <p className="mb-4">
                We implement a variety of security measures to maintain the
                safety of your personal information. However, no method of
                transmission over the Internet or method of electronic storage
                is 100% secure, and we cannot guarantee its absolute security.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                6. Changes to This Privacy Policy
              </h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &ldquo;Last updated&rdquo; date at
                the top of this Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">7. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p>
                Woodgreen Landscaping
                <br />
                123 Green Street, Woodville, WV 12345
                <br />
                Email: privacy@woodgreenlandscaping.com
                <br />
                Phone: (123) 456-7890
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 Woodgreen Landscaping. All rights reserved.</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/privacy" className="hover:text-green-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-green-400">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
