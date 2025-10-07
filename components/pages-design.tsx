"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Download,
  Save,
  Undo,
  Redo,
  Calendar,
  Calculator,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { emitEvent, EVENTS } from "@/lib/events";
import { Season, TimeOfDay } from "./three/Scene";
import { ElementLibrary, ElementType } from "./designer/ElementLibrary";
import { PropertiesPanel } from "./designer/PropertiesPanel";
import { PlacedElement } from "./designer/DesignerCanvas";

// Dynamically import 3D canvas to avoid SSR issues
const DesignerCanvas = dynamic(
  () =>
    import("./designer/DesignerCanvas").then((mod) => mod.DesignerCanvas),
  { ssr: false }
);

export function GardenDesigner() {
  const [season, setSeason] = useState<Season>("summer");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [selectedElementType, setSelectedElementType] =
    useState<ElementType | null>(null);
  const [placedElements, setPlacedElements] = useState<PlacedElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [history, setHistory] = useState<PlacedElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const cameraControlsRef = useRef<unknown>(null);

  const selectedElement =
    placedElements.find((el) => el.id === selectedElementId) || null;

  // Zoom controls
  const handleZoomIn = () => {
    if (cameraControlsRef.current) {
      const controls = cameraControlsRef.current;
      const currentDistance = controls.getDistance();
      controls.dollyTo(Math.max(currentDistance - 2, controls.minDistance), true);
    }
  };

  const handleZoomOut = () => {
    if (cameraControlsRef.current) {
      const controls = cameraControlsRef.current;
      const currentDistance = controls.getDistance();
      controls.dollyTo(Math.min(currentDistance + 2, controls.maxDistance), true);
    }
  };

  // Add to history
  const addToHistory = useCallback((newElements: PlacedElement[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newElements];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPlacedElements(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPlacedElements(history[historyIndex + 1]);
    }
  };

  // Handle canvas click to place element
  const handleCanvasClick = useCallback(
    (position: [number, number, number]) => {
      if (!selectedElementType) return;

      const newElement: PlacedElement = {
        id: `${selectedElementType}-${Date.now()}`,
        type: selectedElementType,
        position,
        rotation: 0,
        scale: 1,
      };

      const newElements = [...placedElements, newElement];
      setPlacedElements(newElements);
      addToHistory(newElements);
      setSelectedElementType(null); // Deselect after placing
    },
    [selectedElementType, placedElements, addToHistory]
  );

  // Update element properties
  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<PlacedElement>) => {
      const newElements = placedElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      setPlacedElements(newElements);
      addToHistory(newElements);
    },
    [placedElements, addToHistory]
  );

  // Handle element position update from TransformControls
  const handleElementPositionUpdate = useCallback(
    (id: string, position: [number, number, number]) => {
      handleUpdateElement(id, { position });
    },
    [handleUpdateElement]
  );

  // Delete element
  const handleDeleteElement = useCallback(
    (id: string) => {
      const newElements = placedElements.filter((el) => el.id !== id);
      setPlacedElements(newElements);
      addToHistory(newElements);
      setSelectedElementId(null);
    },
    [placedElements, addToHistory]
  );

  // Keyboard shortcuts for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete or Backspace key
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        // Prevent default backspace navigation
        e.preventDefault();
        handleDeleteElement(selectedElementId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, handleDeleteElement]);

  // Clear all
  const handleClearAll = () => {
    if (placedElements.length === 0) return;
    if (confirm("Are you sure you want to clear all elements?")) {
      setPlacedElements([]);
      addToHistory([]);
      setSelectedElementId(null);
    }
  };

  // Save design
  const handleSave = () => {
    const design = {
      elements: placedElements,
      season,
      timeOfDay,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("gardenDesign", JSON.stringify(design));
    alert("Design saved successfully!");
  };

  // Export as image (placeholder)
  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  const handleGetEstimate = () => {
    emitEvent(EVENTS.OPEN_ESTIMATE_MODAL);
  };

  // Cycle through seasons
  const seasons: Season[] = ["spring", "summer", "fall", "winter"];
  const cycleSeason = () => {
    const currentIndex = seasons.indexOf(season);
    const nextIndex = (currentIndex + 1) % seasons.length;
    setSeason(seasons[nextIndex]);
  };

  // Toggle time of day
  const toggleTimeOfDay = () => {
    setTimeOfDay(timeOfDay === "day" ? "night" : "day");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Top Toolbar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Garden Designer
            </h1>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {placedElements.length} element{placedElements.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex === 0}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={placedElements.length === 0}
              title="Restart - Clear all elements"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-600 mx-2" />
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-nature-500 hover:bg-nature-600"
              onClick={handleGetEstimate}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Get Estimate
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Element Library */}
        <aside className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Elements
            </h2>
            <ElementLibrary
              onElementSelect={setSelectedElementType}
              selectedType={selectedElementType}
            />
          </div>
        </aside>

        {/* Center - 3D Canvas */}
        <main className="flex-1 relative">
          {/* Zoom Controls - positioned above canvas */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full h-full">
            <DesignerCanvas
              season={season}
              timeOfDay={timeOfDay}
              placedElements={placedElements}
              selectedElementId={selectedElementId}
              selectedElementType={selectedElementType}
              cameraControlsRef={cameraControlsRef}
              onElementClick={setSelectedElementId}
              onGroundClick={handleCanvasClick}
              onElementUpdate={handleElementPositionUpdate}
            />
          </div>

          {/* Bottom Control Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 p-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cycleSeason}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 capitalize"
                >
                  Season: {season}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTimeOfDay}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 capitalize"
                >
                  Time: {timeOfDay}
                </Button>
              </div>

              <Button
                variant="default"
                className="bg-nature-500 hover:bg-nature-600"
                onClick={handleGetEstimate}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Properties
            </h2>
            <PropertiesPanel
              selectedElement={selectedElement}
              onUpdate={handleUpdateElement}
              onDelete={handleDeleteElement}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
