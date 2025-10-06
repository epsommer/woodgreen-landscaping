"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, RotateCw } from "lucide-react";
import { PlacedElement } from "./DesignerCanvas";

interface PropertiesPanelProps {
  selectedElement: PlacedElement | null;
  onUpdate: (id: string, updates: Partial<PlacedElement>) => void;
  onDelete: (id: string) => void;
}

export function PropertiesPanel({
  selectedElement,
  onUpdate,
  onDelete,
}: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <Card className="p-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          Select an element to view and edit its properties
        </p>
      </Card>
    );
  }

  const handlePositionChange = (axis: "x" | "y" | "z", value: string) => {
    const newPosition = [...selectedElement.position] as [number, number, number];
    const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
    newPosition[axisIndex] = parseFloat(value) || 0;
    onUpdate(selectedElement.id, { position: newPosition });
  };

  const handleRotationChange = (value: string) => {
    const degrees = parseFloat(value) || 0;
    const radians = (degrees * Math.PI) / 180;
    onUpdate(selectedElement.id, { rotation: radians });
  };

  const handleScaleChange = (value: string) => {
    onUpdate(selectedElement.id, { scale: parseFloat(value) || 1 });
  };

  const getTypeName = (type: string) => {
    const names = {
      tree: "Tree",
      plant: "Plant",
      path: "Path",
      water: "Water Feature",
    };
    return names[type as keyof typeof names] || type;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {getTypeName(selectedElement.type)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ID: {selectedElement.id.slice(0, 8)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(selectedElement.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Position */}
          <div>
            <Label className="text-xs text-slate-700 dark:text-slate-300 mb-2 block">
              Position
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label
                  htmlFor="pos-x"
                  className="text-xs text-slate-500 dark:text-slate-400"
                >
                  X
                </Label>
                <Input
                  id="pos-x"
                  type="number"
                  step="0.5"
                  value={selectedElement.position[0].toFixed(1)}
                  onChange={(e) => handlePositionChange("x", e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label
                  htmlFor="pos-y"
                  className="text-xs text-slate-500 dark:text-slate-400"
                >
                  Y
                </Label>
                <Input
                  id="pos-y"
                  type="number"
                  step="0.5"
                  value={selectedElement.position[1].toFixed(1)}
                  onChange={(e) => handlePositionChange("y", e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label
                  htmlFor="pos-z"
                  className="text-xs text-slate-500 dark:text-slate-400"
                >
                  Z
                </Label>
                <Input
                  id="pos-z"
                  type="number"
                  step="0.5"
                  value={selectedElement.position[2].toFixed(1)}
                  onChange={(e) => handlePositionChange("z", e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <Label
              htmlFor="rotation"
              className="text-xs text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"
            >
              <RotateCw className="w-3 h-3" />
              Rotation (degrees)
            </Label>
            <Input
              id="rotation"
              type="number"
              step="15"
              min="0"
              max="360"
              value={Math.round(
                ((selectedElement.rotation || 0) * 180) / Math.PI
              )}
              onChange={(e) => handleRotationChange(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          {/* Scale */}
          <div>
            <Label
              htmlFor="scale"
              className="text-xs text-slate-700 dark:text-slate-300 mb-2 block"
            >
              Scale
            </Label>
            <Input
              id="scale"
              type="number"
              step="0.1"
              min="0.5"
              max="3"
              value={(selectedElement.scale || 1).toFixed(1)}
              onChange={(e) => handleScaleChange(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Quick Actions
        </h4>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => onUpdate(selectedElement.id, { rotation: 0 })}
          >
            <RotateCw className="w-3 h-3 mr-2" />
            Reset Rotation
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => onUpdate(selectedElement.id, { scale: 1 })}
          >
            Reset Scale
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-full justify-start text-xs mt-4"
            onClick={() => onDelete(selectedElement.id)}
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Delete Selected Element
          </Button>
        </div>
      </Card>
    </div>
  );
}
