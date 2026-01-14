const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const page = document.selectedPage;

// Clean page for clean slate
page.layers = [];

// 1. Setup Artboard (iPhone 15 Pro dimensions)
const artboard = new sketch.Artboard({
  name: "Login / iOS 18 Liquid",
  frame: { x: 0, y: 0, width: 393, height: 852 },
  parent: page
});

// 2. Background (Mesh Gradient Simulation)
// Layer 1: Base Color
const bgBase = new sketch.ShapePath({
  name: "Background/Base",
  shapeType: sketch.ShapePath.ShapeType.Rectangle,
  frame: { x: 0, y: 0, width: 393, height: 852 },
  style: {
    fills: [{ color: '#F2F2F7', fillType: 'Color' }], // iOS System Gray 6
    borders: []
  },
  parent: artboard
});

// Layer 2: Gradient Blob Top-Left (Blue)
const blob1 = new sketch.ShapePath({
  name: "Blob/Blue",
  shapeType: sketch.ShapePath.ShapeType.Oval,
  frame: { x: -100, y: -100, width: 400, height: 400 },
  style: {
    fills: [{ color: '#007AFF', fillType: 'Color' }],
    borders: [],
    blur: {
        center: { x: 0.5, y: 0.5 },
        isEnabled: true,
        motionAngle: 0,
        radius: 100, // Heavy Blur
        type: 0 // Gaussian
    }
  },
  parent: artboard
});
blob1.style.opacity = 0.6;

// Layer 3: Gradient Blob Bottom-Right (Purple/Pink)
const blob2 = new sketch.ShapePath({
  name: "Blob/Purple",
  shapeType: sketch.ShapePath.ShapeType.Oval,
  frame: { x: 193, y: 552, width: 400, height: 400 },
  style: {
    fills: [{ color: '#AF52DE', fillType: 'Color' }], // System Purple
    borders: [],
    blur: {
        center: { x: 0.5, y: 0.5 },
        isEnabled: true,
        motionAngle: 0,
        radius: 120,
        type: 0
    }
  },
  parent: artboard
});
blob2.style.opacity = 0.5;

// 3. Glass Sheet (The Container)
const glassSheet = new sketch.ShapePath({
  name: "Container/Glass Sheet",
  shapeType: sketch.ShapePath.ShapeType.Rectangle,
  frame: { x: 24, y: 180, width: 345, height: 500 },
  style: {
    fills: [{ color: '#FFFFFFCC', fillType: 'Color' }], // White 80%
    borders: [{ color: '#FFFFFF', position: 'Inside', thickness: 1 }],
    shadows: [{ color: '#0000001A', blur: 30, y: 10, x: 0 }],
    blur: {
        center: { x: 0.5, y: 0.5 },
        isEnabled: true,
        motionAngle: 0,
        radius: 40,
        type: 1 // Background Blur
    }
  },
  parent: artboard
});
glassSheet.points.forEach(p => p.cornerRadius = 32); // Large smooth corners

console.log(JSON.stringify({
    step: "Phase 1 Complete",
    artboard: artboard.frame,
    glass_frame: glassSheet.frame
}));
