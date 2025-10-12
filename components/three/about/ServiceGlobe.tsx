"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

// Toronto coordinates: 43.6532° N, 79.3832° W
const TORONTO_LAT = 43.6532;
const TORONTO_LON = -79.3832;

// Convert lat/lon to 3D coordinates on sphere
function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export function ServiceGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const markerRef = useRef<THREE.Group>(null);
  const coverageRef = useRef<THREE.Mesh>(null);

  const torontoPosition = useMemo(
    () => latLonToVector3(TORONTO_LAT, TORONTO_LON, 2),
    [],
  );

  // Calculate rotation to make rings lie flat on the sphere surface
  const ringRotation = useMemo(() => {
    // Ring's normal should point radially outward from sphere center
    const normal = torontoPosition.clone().normalize();

    // Align ring's Z-axis (normal) with the radial direction
    const quaternion = new THREE.Quaternion();
    const defaultNormal = new THREE.Vector3(0, 0, 1); // Ring's default normal
    quaternion.setFromUnitVectors(defaultNormal, normal);

    const euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion);
    return euler;
  }, [torontoPosition]);

  // Create simple continent outlines
  const continentGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const points: THREE.Vector3[] = [];

    // Simplified North America outline
    const naPoints = [
      [60, -130],
      [70, -110],
      [75, -90],
      [70, -75],
      [60, -65],
      [50, -60],
      [40, -70],
      [30, -80],
      [25, -95],
      [20, -105],
      [25, -115],
      [35, -125],
      [50, -135],
      [60, -130],
    ];

    naPoints.forEach(([lat, lon]) => {
      points.push(latLonToVector3(lat, lon, 2.01));
    });

    geometry.setFromPoints(points);
    return geometry;
  }, []);

  useFrame((state, delta) => {
    // Gentle globe rotation
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.1;
    }

    // Pulsing marker
    if (markerRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
      markerRef.current.scale.set(pulse, pulse, pulse);
    }

    // Pulsing coverage area
    if (coverageRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.4;
      (coverageRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });

  return (
    <group>
      {/* Main globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#0f2f1f" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Ocean texture (slightly lighter blue) */}
      <mesh>
        <sphereGeometry args={[1.99, 64, 64]} />
        <meshBasicMaterial color="#1a3f2f" transparent opacity={0.6} />
      </mesh>

      {/* Continent outlines */}
      <primitive
        object={
          new THREE.Line(
            continentGeometry,
            new THREE.LineBasicMaterial({ color: "#4ade80" }),
          )
        }
      />

      {/* Grid lines (latitude/longitude) */}
      {/* Latitude lines */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const points: THREE.Vector3[] = [];
        for (let lon = -180; lon <= 180; lon += 10) {
          points.push(latLonToVector3(lat, lon, 2.02));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive
            key={`lat-${lat}`}
            object={
              new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                  color: "#22c55e",
                  transparent: true,
                  opacity: 0.2,
                }),
              )
            }
          />
        );
      })}

      {/* Longitude lines */}
      {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((lon) => {
        const points: THREE.Vector3[] = [];
        for (let lat = -90; lat <= 90; lat += 5) {
          points.push(latLonToVector3(lat, lon, 2.02));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive
            key={`lon-${lon}`}
            object={
              new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                  color: "#22c55e",
                  transparent: true,
                  opacity: 0.2,
                }),
              )
            }
          />
        );
      })}

      {/* Toronto marker */}
      <group ref={markerRef} position={torontoPosition} rotation={ringRotation}>
        {/* Filled center point where pin is pointing */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[0.08, 32]} />
          <meshBasicMaterial color="#CEFF65" side={THREE.DoubleSide} />
        </mesh>

        {/* Pin pointing outward from sphere - rotated to point along Z-axis */}
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / -2, 0, 0]}>
          <coneGeometry args={[0.05, 0.2, 8]} />
          <meshStandardMaterial
            color="#CEFF65"
            emissive="#CEFF65"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Pin base */}
        <mesh position={[0, 0, 0.35]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#CEFF65"
            emissive="#CEFF65"
            emissiveIntensity={1}
          />
        </mesh>

        {/* Bullseye rings */}
        <mesh>
          <circleGeometry args={[0.09, 32]} />
          <meshBasicMaterial
            color="#CEFF65"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.15, 0.2, 32]} />
          <meshBasicMaterial
            color="#CEFF65"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.25, 0.3, 32]} />
          <meshBasicMaterial
            color="#CEFF65"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Label */}
        <Text
          position={[0, 0, 0.5]}
          fontSize={0.12}
          color="white"
          anchorY="bottom"
        >
          Toronto, ON
        </Text>
      </group>

      {/* Service coverage area (circle around Toronto) - aligned with surface normal */}
      <mesh
        ref={coverageRef}
        position={torontoPosition}
        rotation={ringRotation}
      >
        <ringGeometry args={[0.4, 0.8, 64]} />
        <meshBasicMaterial
          color="#4ade80"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.15, 64, 64]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ambient particles around globe */}
      {[...Array(100)].map((_, i) => {
        const lat = Math.random() * 180 - 90;
        const lon = Math.random() * 360 - 180;
        const pos = latLonToVector3(lat, lon, 2.5 + Math.random() * 0.5);

        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}
