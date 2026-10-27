/**
 * Pure math calculations for pinch-to-zoom and pan transformations.
 */

export interface Point {
  clientX: number;
  clientY: number;
}

export const MIN_ZOOM = 0.8;
export const MAX_ZOOM = 2.4;
export const DEFAULT_ZOOM = 1.0;

/**
 * Calculates Euclidean distance between two touch points
 */
export function calculateTouchDistance(p1: Point, p2: Point): number {
  const dx = p1.clientX - p2.clientX;
  const dy = p1.clientY - p2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates midpoint between two touch points
 */
export function calculateTouchCenter(p1: Point, p2: Point): { x: number; y: number } {
  return {
    x: (p1.clientX + p2.clientX) / 2,
    y: (p1.clientY + p2.clientY) / 2
  };
}

/**
 * Clamps scale value to stay within supported range
 */
export function clampZoomScale(scale: number, min = MIN_ZOOM, max = MAX_ZOOM): number {
  if (isNaN(scale) || scale <= 0) return DEFAULT_ZOOM;
  return Math.min(max, Math.max(min, Number(scale.toFixed(2))));
}

/**
 * Calculates updated scale factor during a pinch gesture
 */
export function calculatePinchScale(
  initialDistance: number,
  currentDistance: number,
  startScale: number,
  min = MIN_ZOOM,
  max = MAX_ZOOM
): number {
  if (initialDistance <= 0) return startScale;
  const ratio = currentDistance / initialDistance;
  return clampZoomScale(startScale * ratio, min, max);
}

/**
 * Clamps pan coordinates based on current zoom scale to prevent dragging out of bounds
 */
export function clampPanOffset(
  pan: { x: number; y: number },
  scale: number,
  maxOffset = 180
): { x: number; y: number } {
  // If not zoomed in, keep near center
  if (scale <= 1.0) {
    const bound = 30 * scale;
    return {
      x: Math.min(bound, Math.max(-bound, pan.x)),
      y: Math.min(bound, Math.max(-bound, pan.y))
    };
  }

  const dynamicLimit = maxOffset * (scale - 1);
  return {
    x: Math.min(dynamicLimit, Math.max(-dynamicLimit, pan.x)),
    y: Math.min(dynamicLimit, Math.max(-dynamicLimit, pan.y))
  };
}
