"use client";

const DesignIcon = () => (
  <>
    {/* Drawing tablet */}
    <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 6, 0, 0]}>
      <boxGeometry args={[0.6, 0.02, 0.8]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
    {/* Sketch on tablet */}
    <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 6, 0, 0]}>
      <planeGeometry args={[0.5, 0.7]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    {/* Pencil */}
    <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
      <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
      <meshStandardMaterial color="#CEFF65" />
    </mesh>
    {/* Color palette orbs */}
    {[
      [-0.2, 0, 0],
      [0, 0, 0.2],
      [0.2, 0, 0],
    ].map((pos, i) => (
      <mesh key={i} position={[pos[0], 0.3, pos[2]]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={i === 0 ? "#22c55e" : i === 1 ? "#CEFF65" : "#4ade80"}
        />
      </mesh>
    ))}
  </>
);

const MaintenanceIcon = () => (
  <>
    {/* Battery mower - DeWalt colors (yellow/black) */}
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[0.4, 0.25, 0.5]} />
      <meshStandardMaterial color="#FFDE00" /> {/* DeWalt yellow */}
    </mesh>
    {/* Black accents */}
    <mesh position={[0, 0.28, 0]}>
      <boxGeometry args={[0.38, 0.08, 0.48]} />
      <meshStandardMaterial color="#000000" />
    </mesh>
    {/* Wheels */}
    <mesh position={[0.15, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
      <meshStandardMaterial color="#222222" />
    </mesh>
    <mesh position={[-0.15, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
      <meshStandardMaterial color="#222222" />
    </mesh>

    {/* Battery pack (glowing green) */}
    <mesh position={[0, 0.35, -0.15]}>
      <boxGeometry args={[0.15, 0.12, 0.08]} />
      <meshStandardMaterial
        color="#4ade80"
        emissive="#4ade80"
        emissiveIntensity={0.5}
      />
    </mesh>

    {/* "60V" text indicator */}
    <mesh position={[0, 0.36, -0.1]}>
      <boxGeometry args={[0.08, 0.04, 0.01]} />
      <meshStandardMaterial color="#FFFFFF" />
    </mesh>
  </>
);

const PlantingIcon = () => (
  <>
    {/* Flower pot */}
    <mesh position={[0, 0.15, 0]}>
      <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
      <meshStandardMaterial color="#a0522d" />
    </mesh>
    {/* Flowers */}
    {[
      [-0.15, 0, 0],
      [0, 0, 0.15],
      [0.15, 0, -0.1],
    ].map((pos, i) => (
      <group key={i} position={[pos[0], 0.3, pos[2]]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color={["#ff6b9d", "#CEFF65", "#60a5fa"][i]}
          />
        </mesh>
      </group>
    ))}
  </>
);

const HardscapeIcon = () => (
  <>
    {/* Stone pavers stacked */}
    {[0, 0.08, 0.16].map((y, i) => (
      <mesh
        key={i}
        position={[0, y + 0.1, 0]}
        rotation={[0, i * (Math.PI / 6), 0]}
      >
        <boxGeometry args={[0.4, 0.06, 0.4]} />
        <meshStandardMaterial
          color={["#808080", "#999999", "#707070"][i]}
        />
      </mesh>
    ))}
    {/* "Coming Soon" badge */}
    <mesh position={[0, 0.5, 0]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color="#60a5fa"
        emissive="#60a5fa"
        emissiveIntensity={0.5}
      />
    </mesh>
  </>
);

const ConstructionIcon = () => (
  <>
    {/* Shovel */}
    <mesh position={[-0.2, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
      <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
    <mesh position={[-0.3, 0.05, 0]} rotation={[0, 0, -Math.PI / 6]}>
      <boxGeometry args={[0.15, 0.02, 0.2]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
    {/* Hammer */}
    <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
      <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
    <mesh position={[0.3, 0.48, 0]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.08, 0.15, 0.06]} />
      <meshStandardMaterial color="#888888" />
    </mesh>
    {/* Blueprint */}
    <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2 + 0.2, 0, 0]}>
      <planeGeometry args={[0.5, 0.4]} />
      <meshStandardMaterial color="#6ba3d4" />
    </mesh>
  </>
);

export const CapabilityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "design": return <DesignIcon />;
    case "maintenance": return <MaintenanceIcon />;
    case "planting": return <PlantingIcon />;
    case "hardscape": return <HardscapeIcon />;
    case "construction": return <ConstructionIcon />;
    default: return null;
  }
};