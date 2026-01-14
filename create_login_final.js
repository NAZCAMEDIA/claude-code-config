const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const page = document.selectedPage;

page.layers = []; // Reset

// --- UTILS ---
function applyBlur(layer, radius, type) {
    layer.style.blur = {
        center: { x: 0.5, y: 0.5 },
        isEnabled: true,
        motionAngle: 0,
        radius: radius,
        type: type, // 0 = Gaussian, 1 = Background
    };
}

// --- SETUP ---
const artboard = new sketch.Artboard({
  name: "Login / iOS 18 Liquid",
  frame: { x: 0, y: 0, width: 393, height: 852 },
  parent: page
});

// Background Gradients
const bgBase = new sketch.ShapePath({
  name: "BG/Base",
  shapeType: sketch.ShapePath.ShapeType.Rectangle,
  frame: { x: 0, y: 0, width: 393, height: 852 },
  style: { fills: [{ color: '#F2F2F7' }], borders: [] },
  parent: artboard
});

const blob1 = new sketch.ShapePath({
  name: "BG/Blob1",
  shapeType: sketch.ShapePath.ShapeType.Oval,
  frame: { x: -80, y: -80, width: 450, height: 450 },
  style: { fills: [{ color: '#007AFF' }], borders: [] },
  parent: artboard
});
blob1.style.opacity = 0.5;
applyBlur(blob1, 80, 0); // Gaussian

const blob2 = new sketch.ShapePath({
  name: "BG/Blob2",
  shapeType: sketch.ShapePath.ShapeType.Oval,
  frame: { x: 100, y: 600, width: 400, height: 400 },
  style: { fills: [{ color: '#AF52DE' }], borders: [] },
  parent: artboard
});
blob2.style.opacity = 0.4;
applyBlur(blob2, 90, 0);

// --- GLASS SHEET ---
const sheetWidth = 345; // 393 - 24*2
const sheetX = 24;
const sheetY = 160;

const glassSheet = new sketch.ShapePath({
  name: "Container/Glass",
  shapeType: sketch.ShapePath.ShapeType.Rectangle,
  frame: { x: sheetX, y: sheetY, width: sheetWidth, height: 480 },
  style: {
    fills: [{ color: '#FFFFFFCC' }], // 80% White
    borders: [{ color: '#FFFFFF', position: 'Inside', thickness: 1 }],
    shadows: [{ color: '#00000020', blur: 40, y: 15 }]
  },
  parent: artboard
});
glassSheet.points.forEach(p => p.cornerRadius = 32);
applyBlur(glassSheet, 30, 1); // Background Blur

// --- CONTENT GROUP ---
// We calculate relative positions to the Sheet
const contentStartX = sheetX + 24;
const contentWidth = sheetWidth - 48; // 297pt
let cursorY = sheetY + 40;

// 1. Title
const title = new sketch.Text({
    text: "Welcome",
    frame: { x: contentStartX, y: cursorY, width: contentWidth, height: 41 },
    style: {
        textColor: '#000000',
        fontSize: 34,
        fontWeight: 700,
        fontFamily: 'SF Pro Display',
        alignment: sketch.Text.Alignment.left
    },
    parent: artboard
});
cursorY += 50;

const subtitle = new sketch.Text({
    text: "Sign in to continue",
    frame: { x: contentStartX, y: cursorY, width: contentWidth, height: 22 },
    style: {
        textColor: '#00000099', // 60%
        fontSize: 17,
        fontFamily: 'SF Pro Text',
        alignment: sketch.Text.Alignment.left
    },
    parent: artboard
});
cursorY += 40;

// 2. Input: Email
const inputEmailBg = new sketch.ShapePath({
    name: "Input/Email/Bg",
    shapeType: sketch.ShapePath.ShapeType.Rectangle,
    frame: { x: contentStartX, y: cursorY, width: contentWidth, height: 52 },
    style: {
        fills: [{ color: '#0000000D' }], // Gray 5%
        borders: []
    },
    parent: artboard
});
inputEmailBg.points.forEach(p => p.cornerRadius = 16);

const inputEmailText = new sketch.Text({
    text: "email@example.com",
    frame: { x: contentStartX + 16, y: cursorY + 15, width: contentWidth - 32, height: 22 },
    style: { textColor: '#000000', fontSize: 17, fontFamily: 'SF Pro Text' },
    parent: artboard
});
cursorY += 52 + 16; // Height + Gap

// 3. Input: Password
const inputPassBg = new sketch.ShapePath({
    name: "Input/Pass/Bg",
    shapeType: sketch.ShapePath.ShapeType.Rectangle,
    frame: { x: contentStartX, y: cursorY, width: contentWidth, height: 52 },
    style: {
        fills: [{ color: '#0000000D' }],
        borders: []
    },
    parent: artboard
});
inputPassBg.points.forEach(p => p.cornerRadius = 16);

const inputPassText = new sketch.Text({
    text: "••••••••",
    frame: { x: contentStartX + 16, y: cursorY + 15, width: contentWidth - 32, height: 22 },
    style: { textColor: '#000000', fontSize: 17, fontFamily: 'SF Pro Text' },
    parent: artboard
});
cursorY += 52 + 24; // Height + Gap

// 4. Primary Button (Pill)
const btnBg = new sketch.ShapePath({
    name: "Button/Primary/Bg",
    shapeType: sketch.ShapePath.ShapeType.Rectangle,
    frame: { x: contentStartX, y: cursorY, width: contentWidth, height: 52 },
    style: {
        fills: [{ color: '#007AFF' }],
        borders: [],
        shadows: [{ color: '#007AFF4D', blur: 12, y: 4 }]
    },
    parent: artboard
});
btnBg.points.forEach(p => p.cornerRadius = 26); // Pill

const btnText = new sketch.Text({
    text: "Sign In",
    frame: { x: contentStartX, y: cursorY, width: contentWidth, height: 52 },
    style: {
        textColor: '#FFFFFF',
        fontSize: 17,
        fontWeight: 600,
        alignment: sketch.Text.Alignment.center
    },
    parent: artboard
});
// Center text vertically manually approximation
btnText.frame.y = cursorY + (52 - 22)/2; // 22 is approx cap-height+line

cursorY += 52 + 20;

// 5. Link
const link = new sketch.Text({
    text: "Forgot Password?",
    frame: { x: contentStartX, y: cursorY, width: contentWidth, height: 20 },
    style: {
        textColor: '#007AFF',
        fontSize: 15,
        fontWeight: 500,
        alignment: sketch.Text.Alignment.center
    },
    parent: artboard
});

console.log(JSON.stringify({
    status: "Login Screen Created",
    check: {
        artboard: artboard.frame,
        input_gap: 16,
        button_gap: 24,
        total_elements: 10
    }
}));
