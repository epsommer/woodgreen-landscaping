"use client";

import Image from "next/image";
import Link from "next/link";

export function Terms() {
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
                Terms of Service
              </h1>
              <p className="text-xl mb-8">Last updated: June 1, 2024</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By accessing or using the services provided by Woodgreen
                Landscaping, you agree to be bound by these Terms of Service. If
                you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                2. Description of Services
              </h2>
              <p className="mb-4">
                Woodgreen Landscaping provides landscaping design, installation,
                and maintenance services. The specific services to be provided
                will be outlined in a separate agreement or proposal.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                3. Client Responsibilities
              </h2>
              <p className="mb-4">Clients are responsible for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Providing accurate and complete information about their
                  property and desired services
                </li>
                <li>
                  Granting necessary access to the property for service
                  provision
                </li>
                <li>
                  Promptly communicating any concerns or issues regarding the
                  services
                </li>
                <li>
                  Paying for services as agreed upon in the service agreement or
                  proposal
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 mt-8">4. Payment Terms</h2>
              <p className="mb-4">
                Payment terms will be specified in the service agreement or
                proposal. Generally, a deposit may be required before work
                begins, with the balance due upon completion of the project or
                as specified in the agreement.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                5. Cancellation and Refund Policy
              </h2>
              <p className="mb-4">
                Cancellation policies and any applicable refunds will be
                outlined in the service agreement or proposal. In general,
                cancellations made with sufficient notice may be eligible for a
                refund, less any costs incurred.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                6. Limitation of Liability
              </h2>
              <p className="mb-4">
                Woodgreen Landscaping shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages
                resulting from the use of our services. Our liability is limited
                to the amount paid for the specific services in question.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">7. Warranties</h2>
              <p className="mb-4">
                We warrant that our services will be performed in a professional
                manner consistent with industry standards. This warranty is
                exclusive and in lieu of all other warranties, whether express
                or implied.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                8. Dispute Resolution
              </h2>
              <p className="mb-4">
                Any disputes arising from these terms or our services shall be
                resolved through good-faith negotiations. If negotiations are
                unsuccessful, disputes will be submitted to binding arbitration
                in accordance with the rules of the American Arbitration
                Association.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                9. Changes to Terms
              </h2>
              <p className="mb-4">
                We reserve the right to modify these Terms of Service at any
                time. We will notify clients of any significant changes.
                Continued use of our services after such modifications
                constitutes acceptance of the updated terms.
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">
                10. Contact Information
              </h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <p>
                Woodgreen Landscaping
                <br />
                123 Green Street, Woodville, WV 12345
                <br />
                Email: info@woodgreenlandscaping.com
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
