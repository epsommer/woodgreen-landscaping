import { useRef } from "react";
import { ThreeEvent } from "@react-three/fiber";

interface StationInteractionProps {
  onHover?: (hovering: boolean) => void;
  onClick?: () => void;
}

/**
 * Custom hook to manage common interaction logic for service stations.
 * This includes hover effects (cursor change) and differentiating
 * between a click and a drag to prevent firing clicks when panning the camera.
 */
export function useStationInteraction({
  onHover,
  onClick,
}: StationInteractionProps) {
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5 && onClick) {
      onClick();
    }
    e.stopPropagation();
  };

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    if (onHover) onHover(true);
    document.body.style.cursor = "pointer";
    e.stopPropagation();
  };

  const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
    if (onHover) onHover(false);
    document.body.style.cursor = "auto";
    e.stopPropagation();
  };

  return {
    onPointerDown: handlePointerDown,
    onClick: handleClick,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
  };
}