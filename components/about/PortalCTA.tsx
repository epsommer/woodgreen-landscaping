"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { GardenPortal } from "../three/about/GardenPortal";
import { LoadingPlant } from "../three/LoadingPlant";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PortalCTA() {
  return (
    <section className="relative h-screen bg-[#2F3B30] overflow-hidden">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 2]}
          className="w-full h-full"
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={["#2F3B30"]} />

          <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={60} />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 5, 2]} intensity={0.8} />
          <pointLight position={[0, 1.5, 2]} intensity={1} color="#4ade80" />
          <pointLight position={[-2, 1, 1]} intensity={0.5} color="#CEFF65" />
          <pointLight position={[2, 1, 1]} intensity={0.5} color="#60a5fa" />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.5}
          />

          <Suspense fallback={<LoadingPlant />}>
            <GardenPortal />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-nature-300 to-white bg-clip-text text-transparent">
            Ready to Turn Your Vision Into Reality?
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Step through the portal to your dream landscape.
            <br />
            Let&apos;s create something extraordinary together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              asChild
              className="bg-nature-500 hover:bg-nature-600 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-nature-500/50 transition-all hover:shadow-xl hover:shadow-nature-500/60 hover:scale-105"
            >
              <Link href="/contact">Get Free Consultation</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-nature-400/50 text-nature-300 hover:bg-nature-500/10 hover:border-nature-400 font-semibold px-8 py-6 text-lg transition-all hover:scale-105"
            >
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-nature-400 rounded-full animate-pulse" />
              <span>Zero-Emission Equipment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-nature-400 rounded-full" />
              <span>Design + Earth Fusion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-nature-400 rounded-full" />
              <span>Personal Service Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-nature-400 rounded-full animate-pulse" />
              <span>Eco-Conscious Practices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f1810] to-transparent pointer-events-none" />
    </section>
  );
}
