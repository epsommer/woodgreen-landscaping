"use client";

import { Card } from "@/components/ui/card";
import { TreePine, Flower2, Waves, Square } from "lucide-react";

export type ElementType = "tree" | "plant" | "path" | "water";

interface ElementLibraryProps {
  onElementSelect: (type: ElementType) => void;
  selectedType: ElementType | null;
}

const elements = [
  {
    type: "tree" as ElementType,
    name: "Trees",
    icon: TreePine,
    description: "Add evergreen and deciduous trees",
    color: "text-green-600",
  },
  {
    type: "plant" as ElementType,
    name: "Plants & Flowers",
    icon: Flower2,
    description: "Colorful flowers and shrubs",
    color: "text-pink-500",
  },
  {
    type: "path" as ElementType,
    name: "Paths & Hardscape",
    icon: Square,
    description: "Walkways, patios, and pavers",
    color: "text-amber-700",
  },
  {
    type: "water" as ElementType,
    name: "Water Features",
    icon: Waves,
    description: "Ponds, fountains, and streams",
    color: "text-blue-500",
  },
];

export function ElementLibrary({
  onElementSelect,
  selectedType,
}: ElementLibraryProps) {
  return (
    <div className="space-y-3">
      {elements.map((element) => {
        const Icon = element.icon;
        const isSelected = selectedType === element.type;

        return (
          <Card
            key={element.type}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              isSelected
                ? "ring-2 ring-nature-500 bg-nature-50 dark:bg-nature-900/20"
                : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
            }`}
            onClick={() => onElementSelect(element.type)}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-700 ${element.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm text-slate-900 dark:text-white mb-1">
                  {element.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {element.description}
                </p>
                {isSelected && (
                  <p className="text-xs text-nature-600 dark:text-nature-400 mt-2 font-medium">
                    Click on canvas to place
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}

      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 dark:text-blue-400 text-xs">ℹ️</div>
          <div className="flex-1">
            <p className="text-xs text-blue-900 dark:text-blue-200">
              <strong>How to use:</strong>
              <br />
              1. Select an element type
              <br />
              2. Click on the canvas to place
              <br />
              3. Click placed items to edit
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
