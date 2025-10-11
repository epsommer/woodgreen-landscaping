"use client";

import { Button } from "@/components/ui/button";
import { Check, Calendar, Ruler, Wrench } from "lucide-react";

export function EnhancedCTA() {
  return (
    <section className="relative py-24 bg-[#2F3B30] text-white overflow-hidden">
      {/* Animated background mesh gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-nature-500/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-nature-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main content */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-nature-300 bg-clip-text text-transparent">
            Ready to Transform Your Space?
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Let&apos;s discuss your project and create a custom plan for your landscape goals
          </p>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="flex items-start gap-3 text-left">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-nature-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-nature-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Free Consultation</h3>
                <p className="text-sm text-gray-400">
                  Expert advice with no obligation
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-nature-500/20 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-nature-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Custom Design Plans</h3>
                <p className="text-sm text-gray-400">
                  Tailored to your property
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-nature-500/20 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-nature-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Zero-Emission Equipment</h3>
                <p className="text-sm text-gray-400">
                  100% battery-powered tools
                </p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-nature-500 hover:bg-nature-600 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-nature-500/50 transition-all hover:shadow-xl hover:shadow-nature-500/60 hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Consultation
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-nature-400/50 text-nature-300 hover:bg-nature-500/10 hover:border-nature-400 font-semibold px-8 py-6 text-lg transition-all hover:scale-105"
            >
              Get Free Quote
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-4">Design-focused, eco-conscious landscaping for the Greater Toronto Area</p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-nature-400">20+</div>
                <div className="text-xs text-gray-500">Years Legacy Training</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-nature-400">0</div>
                <div className="text-xs text-gray-500">Emissions</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-nature-400">100%</div>
                <div className="text-xs text-gray-500">Personal Attention</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
