"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { TimeOfDay } from "./three/Scene";

interface TimeOfDayToggleProps {
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
}

export function TimeOfDayToggle({
  timeOfDay,
  setTimeOfDay,
}: TimeOfDayToggleProps) {
  return (
    <div>
      <p className="text-white/80 text-xs mb-3 font-medium text-center">Time</p>
      <div
        className={`w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors justify-between ${
          timeOfDay === "day" ? "bg-sky-500/50" : "bg-slate-700/50"
        }`}
        onClick={() => setTimeOfDay(timeOfDay === "day" ? "night" : "day")}
      >
        <motion.div
          className="w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center"
          initial={false}
          animate={{ x: timeOfDay === "day" ? 0 : 40 }}
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={timeOfDay}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {timeOfDay === "day" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        {/* This div is just a placeholder to push the thumb */}
        <div />
      </div>
    </div>
  );
}