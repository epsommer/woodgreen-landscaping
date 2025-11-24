"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Star, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

const TestimonialSubmitPage = () => {
  const params = useParams()
  const [testimonialId] = useState(params.id as string)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (!content.trim()) {
      setError('Please write your testimonial')
      return
    }

    setIsSubmitting(true)

    try {
      // Submit to CRM API (cross-domain)
      const response = await fetch('https://evangelosommer.com/api/testimonials/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testimonialId,
          rating,
          title: title.trim(),
          content: content.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to submit testimonial')
      }
    } catch {
      setError('An error occurred while submitting your testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-10 w-10 ${
                star <= (hoverRating || rating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-8 text-center">
            <CheckCircle className="h-20 w-20 mx-auto mb-6 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4 uppercase">
              Thank You!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your testimonial has been submitted successfully and is now under review.
            </p>
            <p className="text-sm text-gray-500">
              We appreciate your feedback and will review it shortly.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl border border-gray-200 relative">
        {/* Header */}
        <div className="bg-emerald-600 p-8 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white uppercase tracking-wide text-center">
            Share Your Experience
          </h1>
          <p className="text-center text-emerald-100 mt-2">
            We&apos;d love to hear about your experience with our services
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide text-center">
                How would you rate our service?
              </label>
              {renderStars()}
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600">
                  {rating === 5 && 'Excellent!'}
                  {rating === 4 && 'Very Good'}
                  {rating === 3 && 'Good'}
                  {rating === 2 && 'Fair'}
                  {rating === 1 && 'Needs Improvement'}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Excellent Service!"
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Your Testimonial *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length} characters
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting || rating === 0 || !content.trim()}
                className="px-8 py-3 bg-emerald-600 text-white font-bold uppercase tracking-wide rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Testimonial'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 rounded-b-lg border-t border-gray-200 relative">
          <p className="text-center text-sm text-gray-600">
            Thank you for choosing <strong className="text-emerald-600">Woodgreen Landscaping</strong>
          </p>
          {/* Discrete logo in bottom right */}
          <div className="absolute top-1/2 -translate-y-1/2 right-4">
            <Image
              src="/woodgreen-landscaping-logo-palmette.svg"
              alt="Woodgreen Landscaping"
              width={60}
              height={60}
              className="opacity-30"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialSubmitPage
