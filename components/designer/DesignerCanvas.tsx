"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, TransformControls } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import { Season, TimeOfDay } from "../three/Scene";
import { ElementType } from "./ElementLibrary";

interface DesignerCanvasProps {
  season: Season;
  timeOfDay: TimeOfDay;
  placedElements: PlacedElement[];
  selectedElementId?: string | null;
  selectedElementType?: ElementType | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cameraControlsRef?: React.MutableRefObject<any>;
  onElementClick?: (id: string) => void;
  onGroundClick?: (position: [number, number, number]) => void;
  onElementUpdate?: (id: string, position: [number, number, number]) => void;
}

export interface PlacedElement {
  id: string;
  type: "tree" | "plant" | "path" | "water";
  position: [number, number, number];
  rotation?: number;
  scale?: number;
}

export function DesignerCanvas({
  season,
  timeOfDay,
  placedElements,
  selectedElementId,
  selectedElementType,
  cameraControlsRef,
  onElementClick,
  onGroundClick,
  onElementUpdate,
}: DesignerCanvasProps) {
  return (
    <Canvas
      camera={{ position: [10, 10, 10], fov: 50 }}
      gl={{ antialias: true }}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <DesignerScene
          season={season}
          timeOfDay={timeOfDay}
          placedElements={placedElements}
          selectedElementId={selectedElementId}
          selectedElementType={selectedElementType}
          cameraControlsRef={cameraControlsRef}
          onElementClick={onElementClick}
          onGroundClick={onGroundClick}
          onElementUpdate={onElementUpdate}
        />
      </Suspense>
    </Canvas>
  );
}

function DesignerScene({
  season,
  timeOfDay,
  placedElements,
  selectedElementId,
  selectedElementType,
  cameraControlsRef,
  onElementClick,
  onGroundClick,
  onElementUpdate,
}: DesignerCanvasProps) {
  const [ghostPosition, setGhostPosition] = useState<[number, number, number] | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformControlsRef = useRef<any>(null);

  // Sync the cameraControlsRef with orbitControlsRef
  useEffect(() => {
    if (cameraControlsRef && orbitControlsRef.current) {
      cameraControlsRef.current = orbitControlsRef.current;
    }
  }, [cameraControlsRef]);

  // Lighting based on time of day
  const lighting =
    timeOfDay === "day"
      ? { sunIntensity: 1.5, ambientIntensity: 0.6 }
      : { sunIntensity: 0, ambientIntensity: 0.3 };

  // Disable orbit controls when using transform controls
  useEffect(() => {
    if (transformControlsRef.current && orbitControlsRef.current) {
      const controls = transformControlsRef.current;
      const orbit = orbitControlsRef.current;

      const onDragStart = () => {
        orbit.enabled = false;
      };

      controls.addEventListener("dragging-changed", (event: { value: boolean }) => {
        orbit.enabled = !event.value;
      });

      return () => {
        controls.removeEventListener("dragging-changed", onDragStart);
      };
    }
  }, [selectedElementId]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={lighting.ambientIntensity} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={lighting.sunIntensity}
        castShadow
      />
      {timeOfDay === "night" && (
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#B0C4DE" />
      )}

      {/* Ground Grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Ground Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          const point = e.point;

          // If an element type is selected, place it
          if (selectedElementType && !selectedElementId) {
            // Snap to grid on placement
            const snappedX = Math.round(point.x);
            const snappedZ = Math.round(point.z);
            onGroundClick?.([snappedX, 0, snappedZ]);
          } else {
            // Otherwise, deselect any selected element
            onElementClick?.("");
          }
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (selectedElementType && !selectedElementId) {
            const point = e.point;
            // Snap ghost position to grid
            const snappedX = Math.round(point.x);
            const snappedZ = Math.round(point.z);
            setGhostPosition([snappedX, 0, snappedZ]);
          }
        }}
        onPointerLeave={() => {
          setGhostPosition(null);
        }}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={season === "winter" ? "#FFFFFF" : "#7CFC00"}
          roughness={0.8}
        />
      </mesh>

      {/* Ghost preview when selecting element type */}
      {ghostPosition && selectedElementType && !selectedElementId && (
        <GhostElementPreview
          type={selectedElementType}
          position={ghostPosition}
          season={season}
        />
      )}

      {/* Render placed elements */}
      {placedElements.map((element) => (
        <PlacedElementMesh
          key={element.id}
          element={element}
          season={season}
          isSelected={element.id === selectedElementId}
          onClick={() => onElementClick?.(element.id)}
          onElementUpdate={onElementUpdate}
          transformControlsRef={element.id === selectedElementId ? transformControlsRef : undefined}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={5}
        maxDistance={30}
        target={[0, 0, 0]}
      />
    </>
  );
}

// Ghost preview component
function GhostElementPreview({
  type,
  position,
  season,
}: {
  type: ElementType;
  position: [number, number, number];
  season: Season;
}) {
  return (
    <ElementGeometry
      type={type}
      position={position}
      rotation={0}
      scale={1}
      season={season}
      isGhost={true}
    />
  );
}

function PlacedElementMesh({
  element,
  season,
  isSelected,
  onClick,
  onElementUpdate,
  transformControlsRef,
}: {
  element: PlacedElement;
  season: Season;
  isSelected?: boolean;
  onClick: () => void;
  onElementUpdate?: (id: string, position: [number, number, number]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformControlsRef?: React.MutableRefObject<any>;
}) {
  const [hovered, setHovered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupRef = useRef<any>(null);

  return (
    <>
      <group ref={groupRef} position={element.position} rotation={[0, element.rotation || 0, 0]}>
        <ElementGeometry
          type={element.type}
          position={[0, 0, 0]}
          rotation={0}
          scale={element.scale || 1}
          season={season}
          isGhost={false}
          isHovered={hovered}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
      </group>

      {/* Transform Controls - only show when element is selected */}
      {isSelected && transformControlsRef && groupRef.current && (
        <TransformControls
          ref={transformControlsRef}
          object={groupRef.current}
          mode="translate"
          showY={false}
          translationSnap={1}
          onObjectChange={() => {
            if (groupRef.current && onElementUpdate) {
              const pos = groupRef.current.position;
              // Keep Y position at 0 (ground level)
              groupRef.current.position.y = 0;
              // Snap to grid
              const snappedX = Math.round(pos.x);
              const snappedZ = Math.round(pos.z);
              groupRef.current.position.x = snappedX;
              groupRef.current.position.z = snappedZ;
              onElementUpdate(element.id, [snappedX, 0, snappedZ]);
            }
          }}
        />
      )}
    </>
  );
}

// Shared element geometry component
function ElementGeometry({
  type,
  position,
  rotation,
  scale,
  season,
  isGhost = false,
  isHovered = false,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  type: ElementType;
  position: [number, number, number];
  rotation: number;
  scale: number;
  season: Season;
  isGhost?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}) {
  // Get color based on type and season
  const getColor = () => {
    if (type === "tree") {
      const colors = {
        spring: "#90EE90",
        summer: "#228B22",
        fall: "#D2691E",
        winter: "#FFFFFF",
      };
      return colors[season];
    }
    if (type === "plant") {
      const colors = {
        spring: "#FFB6C1",
        summer: "#FF69B4",
        fall: "#FFA500",
        winter: "#E6E6FA",
      };
      return colors[season];
    }
    if (type === "path") return "#8B7355";
    if (type === "water") return "#4169E1";
    return "#CCCCCC";
  };

  const opacity = isGhost ? 0.5 : 1;
  const wireframe = isGhost;

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Tree */}
      {type === "tree" && (
        <group>
          {/* Trunk */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
            <meshStandardMaterial color="#8B4513" opacity={opacity} transparent={isGhost} wireframe={wireframe} />
          </mesh>
          {/* Foliage */}
          <mesh
            position={[0, 2.5, 0]}
            castShadow
            onClick={onClick}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            scale={isHovered ? 1.1 : 1}
          >
            <coneGeometry args={[1, 2, 8]} />
            <meshStandardMaterial color={getColor()} opacity={opacity} transparent={isGhost} wireframe={wireframe} />
          </mesh>
        </group>
      )}

      {/* Plant/Flower */}
      {type === "plant" && (
        <mesh
          position={[0, 0.3, 0]}
          castShadow
          onClick={onClick}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          scale={isHovered ? 1.2 : 1}
        >
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color={getColor()} opacity={opacity} transparent={isGhost} wireframe={wireframe} />
        </mesh>
      )}

      {/* Path */}
      {type === "path" && (
        <mesh
          position={[0, 0.05, 0]}
          receiveShadow
          onClick={onClick}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        >
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial
            color={getColor()}
            opacity={isGhost ? 0.5 : isHovered ? 0.8 : 1}
            transparent
            wireframe={wireframe}
          />
        </mesh>
      )}

      {/* Water Feature */}
      {type === "water" && (
        <mesh
          position={[0, 0.1, 0]}
          receiveShadow
          onClick={onClick}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        >
          <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
          <meshStandardMaterial
            color={getColor()}
            opacity={isGhost ? 0.5 : isHovered ? 0.7 : 0.6}
            transparent
            wireframe={wireframe}
          />
        </mesh>
      )}
    </group>
  );
}
