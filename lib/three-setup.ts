// This file ensures Three.js is properly set up for the application
import * as THREE from "three";

// Make Three available globally for easier access
if (typeof window !== "undefined") {
  (window as any).THREE = THREE;
}

export { THREE };
