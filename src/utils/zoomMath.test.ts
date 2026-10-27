import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTouchDistance,
  calculateTouchCenter,
  clampZoomScale,
  calculatePinchScale,
  clampPanOffset
} from './zoomMath';

test('calculateTouchDistance computes Euclidean distance accurately', () => {
  const p1 = { clientX: 0, clientY: 0 };
  const p2 = { clientX: 30, clientY: 40 };
  assert.equal(calculateTouchDistance(p1, p2), 50);
});

test('calculateTouchCenter computes midpoints', () => {
  const p1 = { clientX: 100, clientY: 200 };
  const p2 = { clientX: 200, clientY: 400 };
  assert.deepEqual(calculateTouchCenter(p1, p2), { x: 150, y: 300 });
});

test('clampZoomScale enforces bounds between 0.8 and 2.4', () => {
  assert.equal(clampZoomScale(0.5), 0.8);
  assert.equal(clampZoomScale(3.2), 2.4);
  assert.equal(clampZoomScale(1.5), 1.5);
  assert.equal(clampZoomScale(NaN), 1.0);
});

test('calculatePinchScale multiplies starting scale by touch distance ratio', () => {
  // initial dist 100, new dist 150 -> 1.5x of 1.0 = 1.5
  assert.equal(calculatePinchScale(100, 150, 1.0), 1.5);

  // initial dist 100, new dist 50 -> 0.5x of 2.0 = 1.0
  assert.equal(calculatePinchScale(100, 50, 2.0), 1.0);

  // Exceeds max zoom
  assert.equal(calculatePinchScale(100, 300, 1.0), 2.4);
});

test('clampPanOffset keeps zoomed pan within limits', () => {
  // At 1.0 scale
  const centered = clampPanOffset({ x: 200, y: -200 }, 1.0);
  assert.equal(centered.x, 30);
  assert.equal(centered.y, -30);

  // At 2.0 scale (limit = 180 * (2 - 1) = 180)
  const zoomed = clampPanOffset({ x: 150, y: -120 }, 2.0);
  assert.equal(zoomed.x, 150);
  assert.equal(zoomed.y, -120);

  const overflow = clampPanOffset({ x: 300, y: -300 }, 2.0);
  assert.equal(overflow.x, 180);
  assert.equal(overflow.y, -180);
});
