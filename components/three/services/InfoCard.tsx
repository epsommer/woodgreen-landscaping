"use client";

import * as THREE from "three";
import { Text } from "@react-three/drei";
import { ServiceInfo } from "./ServiceStationsScene";

interface InfoCardProps {
  serviceInfo: ServiceInfo;
  isSelected: boolean;
}

export function InfoCard({ serviceInfo, isSelected }: InfoCardProps) {
  return (
    <group position={[0, 5, 0]}>
      {/* Upper card background plane - double sided */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.8, 0.6]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Front side text - upper card */}
      <group position={[0, 0.1, 0.01]}>
        <Text
          fontSize={0.18}
          color={serviceInfo.color}
          anchorY="bottom"
          fontWeight="bold"
        >
          {serviceInfo.name}
        </Text>
        <Text
          fontSize={0.12}
          color="white"
          position={[0, -0.25, 0]}
          anchorY="top"
        >
          {serviceInfo.title}
        </Text>
      </group>

      {/* Back side text - upper card (flipped 180°) */}
      <group position={[0, 0.1, -0.01]} rotation={[0, Math.PI, 0]}>
        <Text
          fontSize={0.18}
          color={serviceInfo.color}
          anchorY="bottom"
          fontWeight="bold"
        >
          {serviceInfo.name}
        </Text>
        <Text
          fontSize={0.12}
          color="white"
          position={[0, -0.25, 0]}
          anchorY="top"
        >
          {serviceInfo.title}
        </Text>
      </group>

      {/* Lower description cube card - only when selected */}
      {isSelected && (
        <group position={[0, -0.8, 0]}>
          <mesh>
            <boxGeometry args={[3.0, 1.0, 0.08]} />
            <meshBasicMaterial color="#1a1a1a" transparent opacity={0.9} />
          </mesh>

          {/* Text on both sides */}
          {[0.041, -0.041].map((z, index) => (
            <group
              key={index}
              position={[0, 0, z]}
              rotation={[0, index === 1 ? Math.PI : 0, 0]}
            >
              <Text
                fontSize={0.11}
                color="white"
                anchorY="middle"
                maxWidth={2.7}
                textAlign="center"
              >
                {serviceInfo.description}
              </Text>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}