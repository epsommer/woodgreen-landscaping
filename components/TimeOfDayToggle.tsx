"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { TimeOfDay } from "./three/Scene";

interface TimeOfDayToggleProps {
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  timeProgress: MotionValue<number>;
}

export function TimeOfDayToggle({
  timeOfDay,
  setTimeOfDay,
  timeProgress,
}: TimeOfDayToggleProps) {
  const rotation = useTransform(timeProgress, [0, 1], [0, 180]);
  const handleToggle = () => {
    setTimeOfDay(timeOfDay === "day" ? "night" : "day");
  };

  return (
    <div>
      <p className="text-white/80 text-xs mb-3 font-medium text-center">Time</p>
      <div className="flex justify-center">
        <motion.div
          className="relative w-20 h-20 rounded-full cursor-pointer bg-slate-700/50 border-2 border-white/10 flex items-center justify-center"
          onClick={handleToggle}
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
            <motion.div
              className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-slate-400"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}