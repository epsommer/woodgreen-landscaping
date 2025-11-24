import { NextRequest, NextResponse } from "next/server";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

/**
 * API Route: POST /api/testimonials/submit
 * Proxy route to forward testimonial submissions to the CRM API
 * This avoids CORS issues by making the request server-side
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the CRM API
    const response = await fetch('https://evangelosommer.com/api/testimonials/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Return the response from the CRM API
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error submitting testimonial:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit testimonial. Please try again later.",
      },
      { status: 500 },
    );
  }
}
