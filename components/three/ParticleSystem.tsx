"use client";

import { useRef, useMemo } from "react";
import { Points, BufferGeometry, PointsMaterial, BufferAttribute } from "three";
import { useFrame } from "@react-three/fiber";
import { Season, TimeOfDay } from "./Scene";

interface ParticleSystemProps {
  season: Season;
  timeOfDay: TimeOfDay;
}

const PARTICLE_COUNT = 1000;

export function ParticleSystem({ season, timeOfDay }: ParticleSystemProps) {
  const particlesRef = useRef<Points>(null);

  // Particle configuration based on season
  const particleConfig = useMemo(() => {
    switch (season) {
      case "spring":
        return {
          color: "#FFB6C1", // Pollen/petals
          size: 0.1,
          speed: 0.5,
          spread: 20,
        };
      case "summer":
        return {
          color: timeOfDay === "night" ? "#FFFF00" : "#FFD700", // Fireflies at night, sparkles during day
          size: timeOfDay === "night" ? 0.15 : 0.05,
          speed: 0.3,
          spread: 15,
        };
      case "fall":
        return {
          color: "#D2691E", // Falling leaves
          size: 0.2,
          speed: 0.8,
          spread: 25,
        };
      case "winter":
        return {
          color: "#FFFFFF", // Snow
          size: 0.15,
          speed: 1.0,
          spread: 30,
        };
      default:
        return {
          color: "#FFFFFF",
          size: 0.1,
          speed: 0.5,
          spread: 20,
        };
    }
  }, [season, timeOfDay]);

  // Create particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * particleConfig.spread;
      positions[i3 + 1] = Math.random() * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * particleConfig.spread;

      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = -Math.random() * particleConfig.speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    return { positions, velocities };
  }, [particleConfig]);

  // Animate particles
  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position
      .array as Float32Array;
    const velocities = particlePositions.velocities;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Update positions
      positions[i3] += velocities[i3] * delta * 10;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 10;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 10;

      // Reset particles when they fall below ground
      if (positions[i3 + 1] < 0) {
        positions[i3] = (Math.random() - 0.5) * particleConfig.spread;
        positions[i3 + 1] = 20;
        positions[i3 + 2] = (Math.random() - 0.5) * particleConfig.spread;
      }

      // For fireflies (summer night), add bobbing motion
      if (season === "summer" && timeOfDay === "night") {
        const time = state.clock.getElapsedTime();
        positions[i3 + 1] += Math.sin(time * 2 + i) * 0.02;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={particlePositions.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleConfig.size}
        color={particleConfig.color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}
