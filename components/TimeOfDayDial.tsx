"use client";

import {
  motion,
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
  const rotation = useTransform(timeProgress, [0, 1], [0, 180]);

  const updateDialFromPoint = (point: { x: number; y: number }) => {
    if (!dialRef.current) return;

    const { x, y, width, height } = dialRef.current.getBoundingClientRect();
    const center = { x: x + width / 2, y: y + height / 2 };

    const angle = Math.atan2(point.y - center.y, point.x - center.x);
    const newProgress = (angle + Math.PI / 2) / Math.PI;
    const clampedProgress = Math.max(0, Math.min(1, newProgress));

    timeProgress.set(clampedProgress);
    setTimeOfDay(clampedProgress < 0.5 ? "day" : "night");
  };

  const handlePan = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    updateDialFromPoint(info.point);
  };

  const handleTap = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: TapInfo,
  ) => {
    updateDialFromPoint(info.point);
  };

  return (
    <div>
      <p className="text-white/80 text-xs mb-3 font-medium text-center">Time</p>
      <div className="flex justify-center">
        <motion.div
          ref={dialRef}
          className="relative w-20 h-20 rounded-full cursor-pointer bg-slate-700/50 border-2 border-white/10 flex items-center justify-center"
          onPan={handlePan}
          onTap={handleTap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Dial Background */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <motion.div
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(180deg, #87CEEB 0%, #4682B4 50%, #000080 50%, #191970 100%)",
                rotate: rotation,
              }}
            />
          </div>

          {/* Sun and Moon Icons */}
          <motion.div
            className="absolute w-full h-full"
            style={{ rotate: rotation }}
          >
            <motion.div
              className="absolute top-1 left-1/2 -translate-x-1/2"
              initial={false}
              animate={timeOfDay === "day" ? { scale: 1.2 } : { scale: 0.8 }}
            >
              <Sun className="w-6 h-6 text-yellow-300" />
            </motion.div>
            <motion.div
              className="absolute bottom-1 left-1/2 -translate-x-1/2"
              initial={false}
              animate={timeOfDay === "night" ? { scale: 1.2 } : { scale: 0.8 }}
            >
              <Moon className="w-5 h-5 text-slate-300" />
            </motion.div>
          </motion.div>

          {/* Knob */}
          <motion.div
            className="absolute w-full h-full"
            style={{ rotate: rotation }}
          >
            <motion.div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-slate-400" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}