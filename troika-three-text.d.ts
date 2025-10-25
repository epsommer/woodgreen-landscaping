/**
 * Type declarations for troika-three-text
 *
 * This library doesn't provide official TypeScript definitions.
 * We declare the module to allow imports without type errors.
 */

declare module 'troika-three-text' {
  import { Object3D, Material, BufferGeometry } from 'three';

  export class Text extends Object3D {
    text: string;
    font?: string;
    fontSize?: number;
    color?: number | string;
    anchorX?: number | string;
    anchorY?: number | string;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    maxWidth?: number;
    lineHeight?: number | string;
    letterSpacing?: number;
    outlineWidth?: number | string;
    outlineColor?: number | string;
    strokeWidth?: number | string;
    strokeColor?: number | string;
    fillOpacity?: number;
    material?: Material | null;
    geometry?: BufferGeometry | null;
    sync(callback?: () => void): void;
    dispose(): void;
  }

  export function preloadFont(
    options: { font: string; characters?: string },
    callback: () => void
  ): void;
}
