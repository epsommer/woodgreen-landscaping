"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface Milestone {
  year: number;
  title: string;
  description: string;
  position: [number, number, number];
  branchAngle: number;
}

const milestones: Milestone[] = [
  {
    year: 2010,
    title: "Woodgreen Apprenticeship",
    description:
      "Apprenticing in Woodgreen, Ontario—learning from my father's 20+ years of landscaping mastery",
    position: [0, 0.5, 0],
    branchAngle: 0,
  },
  {
    year: 2016,
    title: "Expanding Horizons",
    description:
      "Working with multiple landscaping companies, mastering diverse techniques and approaches",
    position: [-2, 2, 0.5],
    branchAngle: Math.PI / 3,
  },
  {
    year: 2019,
    title: "Design Meets Earth",
    description:
      "Discovering the fusion of graphic design and landscape architecture",
    position: [1.8, 3.5, -0.5],
    branchAngle: -Math.PI / 4,
  },
  {
    year: 2020,
    title: "Toronto Bound",
    description:
      "Relocated to Toronto to be closer to family and pursue a dream",
    position: [-1.5, 5, 0.8],
    branchAngle: Math.PI / 2,
  },
  {
    year: 2022,
    title: "First Clients",
    description:
      "Started with local neighbors—word-of-mouth beginnings in the community",
    position: [2.2, 6.5, -0.3],
    branchAngle: -Math.PI / 3,
  },
  {
    year: 2023,
    title: "Going Green",
    description:
      "Invested in 100% battery-powered equipment - DeWalt 60V professional lineup",
    position: [-1, 7.2, 0.5],
    branchAngle: Math.PI / 5,
  },
  {
    year: 2024,
    title: "Growing Network",
    description:
      "Neighbors telling friends—building trust through quality and personal care",
    position: [1.8, 8.5, -0.3],
    branchAngle: -Math.PI / 4,
  },
  {
    year: 2025,
    title: "Legitimizing the Dream",
    description:
      "Expanding beyond the neighborhood, formalizing the business, adding hardscapes",
    position: [1.5, 9.5, 0],
    branchAngle: 0,
  },
];

interface TimelineTreeProps {
  isVisible?: boolean;
}

export function TimelineTree({ isVisible = false }: TimelineTreeProps) {
  const treeRef = useRef<THREE.Group>(null);
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);
  const leavesRef = useRef<THREE.InstancedMesh>(null);

  // Time-based animation
  const animationStartTime = useRef<number | null>(null);
  const currentMilestones = useRef(1);
  const currentHeight = useRef(5); // Start with sapling height
  const [visibleMilestones, setVisibleMilestones] = useState(1);

  // Animation duration: 12 seconds total (1.5 seconds per milestone)
  const ANIMATION_DURATION = 12;

  // Use current height for rendering trunk
  const maxHeight = currentHeight.current;

  // Create leaves - globular clouds around branch tips (using corrected positions)
  const leafCount = 150;
  const leafPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const leavesPerMilestone = Math.floor(leafCount / milestones.length);

    // Angle offsets for leaf clouds (separate from sphere offsets)
    const leafAngleOffsets = [70, 270, 180, 270, 10, 5, 20, 50];

    // Create leaf clouds around each milestone's actual branch tip
    for (let i = 0; i < milestones.length; i++) {
      const [mx, my, mz] = milestones[i].position;

      // Calculate actual branch tip position for leaf cloud center
      const radialDistance = Math.sqrt(mx * mx + mz * mz);
      const baseSpokeAngle = Math.atan2(mx, mz);
      const staggerOffset = i * Math.PI * 0.6 + Math.sin(i * 1.7) * 0.8;
      const spokeAngle = -(baseSpokeAngle + staggerOffset);
      const leafCloudAngle = spokeAngle + (leafAngleOffsets[i] * Math.PI) / 180;

      const cloudCenterX = Math.cos(leafCloudAngle) * radialDistance;
      const cloudCenterY = my;
      const cloudCenterZ = Math.sin(leafCloudAngle) * radialDistance;

      for (let j = 0; j < leavesPerMilestone; j++) {
        let attempts = 0;
        while (attempts < 20) {
          attempts++;

          // Create spherical cloud around branch tip
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const cloudRadius = 0.8 + Math.random() * 0.7; // Smaller globular clouds

          const x = cloudCenterX + cloudRadius * Math.sin(phi) * Math.cos(theta);
          const y = cloudCenterY + cloudRadius * Math.cos(phi);
          const z = cloudCenterZ + cloudRadius * Math.sin(phi) * Math.sin(theta);

          // Avoid area near label (cards hover above branch tips)
          const labelDistance = Math.sqrt(
            Math.pow(x - cloudCenterX, 2) +
              Math.pow(y - (cloudCenterY + 0.8), 2) + // Card is 0.8 units above branch
              Math.pow(z - (cloudCenterZ + (i === 0 ? 1.5 : 0)), 2),
          );

          // Keep leaves away from label area (1.8 unit radius)
          if (labelDistance > 1.8) {
            positions.push(new THREE.Vector3(x, y, z));
            break;
          }
        }
      }
    }

    return positions;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Start animation timer when visible
    if (isVisible && animationStartTime.current === null) {
      animationStartTime.current = time;
    }

    // Calculate target milestone based on elapsed time
    let targetMilestones = 1;
    if (isVisible && animationStartTime.current !== null) {
      const elapsed = time - animationStartTime.current;
      const progress = Math.min(1, elapsed / ANIMATION_DURATION);

      // Linear progression through milestones over time
      // Ensure we reach full count: 1 -> 8
      targetMilestones = 1 + progress * (milestones.length - 1);
    }

    // Smooth lerp milestone count for gradual reveal
    currentMilestones.current = THREE.MathUtils.lerp(
      currentMilestones.current,
      targetMilestones,
      delta * 2, // Lerp speed
    );

    // Update visible milestones for rendering - ensure we reach all 8
    const newVisibleMilestones = Math.min(
      milestones.length,
      Math.max(1, Math.ceil(currentMilestones.current)),
    );
    if (newVisibleMilestones !== visibleMilestones) {
      setVisibleMilestones(newVisibleMilestones);
    }

    // Calculate target height based on current milestone progression
    const targetHeight =
      newVisibleMilestones > 0
        ? milestones[Math.min(newVisibleMilestones - 1, milestones.length - 1)]
            .position[1] + 4.5
        : 5;

    // Smooth lerp tree height growth
    currentHeight.current = THREE.MathUtils.lerp(
      currentHeight.current,
      targetHeight,
      delta * 2,
    );

    // Gentle tree sway
    if (treeRef.current) {
      treeRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
    }

    // Animate leaves
    if (leavesRef.current) {
      const dummy = new THREE.Object3D();
      const leavesPerMilestone = Math.floor(leafCount / milestones.length);

      leafPositions.forEach((pos, i) => {
        const milestoneIndex = Math.floor(i / leavesPerMilestone);

        // Only show leaves for visible milestones with smooth fade
        if (milestoneIndex < currentMilestones.current) {
          const sway = Math.sin(time * 2 + i * 0.1) * 0.08;
          dummy.position.copy(pos);
          dummy.position.x += sway;
          dummy.rotation.z = sway * 2;

          // Fade in based on milestone reveal progress
          const milestoneProgress = currentMilestones.current - milestoneIndex;
          const revealProgress = Math.min(1, milestoneProgress);
          dummy.scale.set(revealProgress, revealProgress, revealProgress);
        } else {
          dummy.scale.set(0, 0, 0);
        }

        dummy.updateMatrix();
        leavesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      leavesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={treeRef}>
      {/* Main trunk - grows with milestones */}
      <mesh position={[0, maxHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, maxHeight, 12]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} />
      </mesh>

      {/* Trunk texture (bark lines) - only up to current height */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((h) => {
        if (h > maxHeight) return null;
        return (
          <mesh key={h} position={[0, h, 0]} rotation={[0, h * 0.3, 0]}>
            <torusGeometry
              args={[0.32 + Math.max(0, maxHeight - h) * 0.015, 0.02, 8, 12]}
            />
            <meshStandardMaterial color="#3a2510" />
          </mesh>
        );
      })}

      {/* Roots underground */}
      {[-Math.PI / 3, 0, Math.PI / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.sin(angle) * 0.5, -0.3, Math.cos(angle) * 0.5]}
          rotation={[0, angle, Math.PI / 6]}
        >
          <cylinderGeometry args={[0.08, 0.15, 1, 8]} />
          <meshStandardMaterial color="#4a3520" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Milestone branches */}
      {milestones.slice(0, visibleMilestones).map((milestone, index) => {
        const isHovered = hoveredMilestone === index;
        const [x, y, z] = milestone.position;

        // BIKE WHEEL SPOKE GEOMETRY
        // Trunk = vertical cylinder (axle), Branches = horizontal spokes

        // Trunk radius at this height (tapers from 0.5 at base to 0.3 at top)
        const trunkRadius = 0.5 - (0.2 * y) / maxHeight;

        // Distance from trunk axis to milestone in XZ plane (horizontal)
        const radialDistance = Math.sqrt(x * x + z * z);

        // Branch length: from trunk surface to milestone
        const branchLength = radialDistance - trunkRadius;

        // Angle around trunk axis (Y) - direction the spoke points
        // Add significant variation so branches don't appear in a vertical line
        // Negative angle for clockwise rotation (when viewed from above)
        const baseSpokeAngle = Math.atan2(x, z);
        const staggerOffset =
          index * Math.PI * 0.6 + Math.sin(index * 1.7) * 0.8;
        const spokeAngle = -(baseSpokeAngle + staggerOffset);

        // Branch position: midpoint between trunk surface and branch end
        const branchRadialPosition = (trunkRadius + radialDistance) / 2;

        // Calculate actual branch tip position (thin end)
        // Each branch needs individual angle correction due to geometry variations
        const angleOffsets = [20, 270, 180, 270, 10, 5, 20, 50]; // Individual corrections per milestone
        const sphereAngleOffset = angleOffsets[index] || 0;
        const sphereAngle = spokeAngle + (sphereAngleOffset * Math.PI) / 180;
        const branchTipX = Math.cos(sphereAngle) * radialDistance;
        const branchTipY = y;
        const branchTipZ = Math.sin(sphereAngle) * radialDistance;

        // Card hovers above branch tip
        const cardYOffset = 0.8;
        const cardPosition: [number, number, number] = [
          branchTipX,
          branchTipY + cardYOffset,
          branchTipZ + (index === 0 ? 1.5 : 0),
        ];

        return (
          <group key={index}>
            {/* Branch = horizontal spoke radiating from vertical trunk */}
            {/* Rotate around Y axis first to point in spoke direction, then position and rotate to horizontal */}
            <group position={[0, y, 0]} rotation={[0, spokeAngle, 0]}>
              <mesh
                position={[branchRadialPosition, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
                castShadow
              >
                {/* Thick end (0.12) at trunk, thin end (0.06) outward at milestone */}
                <cylinderGeometry args={[0.12, 0.06, branchLength, 8]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
            </group>

            {/* Milestone node (clickable sphere at thin branch tip) */}
            <mesh
              position={[branchTipX, branchTipY, branchTipZ]}
              onPointerEnter={() => setHoveredMilestone(index)}
              onPointerLeave={() => setHoveredMilestone(null)}
              scale={isHovered ? 1.3 : 1}
            >
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial
                color={isHovered ? "#CEFF65" : "#22c55e"}
                emissive={isHovered ? "#CEFF65" : "#000000"}
                emissiveIntensity={isHovered ? 0.5 : 0}
              />
            </mesh>

            {/* Milestone label - hovering above branch, facing radially outward */}
            <group position={cardPosition} rotation={[0, spokeAngle, 0]}>
              {/* Background panel for better readability - double-sided */}
              <mesh position={[0, 0.35, 0]} rotation={[0, -Math.PI / 6, 0]}>
                <planeGeometry args={[3, 0.8]} />
                <meshBasicMaterial
                  color="#000000"
                  transparent
                  opacity={0.7}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Front side text */}
              <group rotation={[0, -Math.PI / 6, 0]}>
                {/* Year text */}
                <Text
                  position={[0, 0.5, 0.05]}
                  fontSize={0.35}
                  color="#CEFF65"
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.03}
                  outlineColor="#000000"
                  fontWeight="bold"
                >
                  {milestone.year}
                </Text>

                {/* Title text */}
                <Text
                  position={[0, 0.15, 0.05]}
                  fontSize={0.2}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2.8}
                  textAlign="center"
                  outlineWidth={0.02}
                  outlineColor="#000000"
                >
                  {milestone.title}
                </Text>
              </group>

              {/* Back side text (flipped) */}
              <group rotation={[0, Math.PI - Math.PI / 6, 0]}>
                {/* Year text */}
                <Text
                  position={[0, 0.5, 0.05]}
                  fontSize={0.35}
                  color="#CEFF65"
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.03}
                  outlineColor="#000000"
                  fontWeight="bold"
                >
                  {milestone.year}
                </Text>

                {/* Title text */}
                <Text
                  position={[0, 0.15, 0.05]}
                  fontSize={0.2}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={2.8}
                  textAlign="center"
                  outlineWidth={0.02}
                  outlineColor="#000000"
                >
                  {milestone.title}
                </Text>
              </group>
            </group>

            {/* Glow ring on hover - around sphere at branch tip */}
            {isHovered && (
              <mesh
                position={[branchTipX, branchTipY, branchTipZ]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <ringGeometry args={[0.25, 0.35, 32]} />
                <meshBasicMaterial color="#CEFF65" transparent opacity={0.5} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Leaves (instanced) - globular cloud particles */}
      <instancedMesh
        ref={leavesRef}
        args={[undefined, undefined, leafCount]}
        castShadow
      >
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#22c55e" transparent opacity={0.85} />
      </instancedMesh>

      {/* Ground (showing roots) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color="#2F3B30" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
