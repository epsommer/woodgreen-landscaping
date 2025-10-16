"use client";

import { useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  MotionValue,
  PanInfo,
  TapInfo,
} from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useRef } from "react";
import { TimeOfDay } from "./three/Scene";

interface TimeOfDayDialProps {
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  timeProgress: MotionValue<number>;
}

export function TimeOfDayDial({
  timeOfDay,
  setTimeOfDay,
  timeProgress,
}: TimeOfDayDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const rotation = useTransform(timeProgress, [0, 1], [0, 180], {
    // My apologies, this was a leftover from a previous attempt and is not needed.
    clamp: false,
  });

  // This effect synchronizes the discrete timeOfDay state with the continuous timeProgress value.
  // It runs when the animation completes to avoid conflicts during an active drag.
  useEffect(() => {
    const unsubscribe = timeProgress.on("change", (latest) => {
      setTimeOfDay(latest < 0.5 ? "day" : "night");
    });

    return () => unsubscribe();
  }, [timeProgress, setTimeOfDay]);

  const handlePan = (
    // The event parameter is required by the framer-motion type definition.
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    console.log("User is dragging (onPan)");
    if (!dialRef.current) return;

    const { x, y, width, height } = dialRef.current.getBoundingClientRect();
    const center = { x: x + width / 2, y: y + height / 2 };
    const angle = Math.atan2(info.point.y - center.y, info.point.x - center.x) + Math.PI / 2;
    
    // Normalize angle to be between 0 and 2PI
    const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
    
    // We only care about the top-half of the dial for 180 degree rotation
    if (normalizedAngle > Math.PI) return;

    const newProgress = normalizedAngle / Math.PI;
    
    timeProgress.set(newProgress);
  };

  const handleTap = (
    // The event parameter is required by the framer-motion type definition.
    _event: MouseEvent | TouchEvent | PointerEvent,
  ) => {
    console.log("User tapped (onTap)");
    // A small delay to allow pan to be recognized first
    setTimeout(() => {
      if (timeProgress.getVelocity() === 0) {
        console.log("Executing tap action");
        if (timeOfDay === "day") {
          setTimeOfDay("night");
          timeProgress.set(1);
        } else {
          setTimeOfDay("day");
          timeProgress.set(0);
        }
      }
    }, 50);
  };

  return (
    <div>
      <p className="text-white/80 text-xs mb-3 font-medium text-center">Time</p>
      <div className="flex justify-center">
        <motion.div
          ref={dialRef}
          className="relative w-20 h-20 rounded-full cursor-pointer bg-slate-800/70 border-2 border-white/10 flex items-center justify-center"
          onPan={handlePan}
          onTap={handleTap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Sun and Moon Icons in the center */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={timeOfDay}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
              className="absolute"
            >
              {timeOfDay === "day" ? (
                <Sun className="w-8 h-8 text-yellow-300" />
              ) : (
                <Moon className="w-7 h-7 text-slate-300" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Knob */}
          <motion.div
            className="absolute w-full h-full"
            style={{ rotate: rotation }}
          >
            <motion.div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full border-2 border-slate-400" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}