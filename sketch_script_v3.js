const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const page = document.selectedPage;

page.layers = [];

// 1. Create Pill Button (Primary)
const buttonHeight = 52;
const buttonWidth = 343; // Standard iPhone width minus margins (16*2)
const cornerRadius = buttonHeight / 2; // Perfect Pill

const button = new sketch.ShapePath({
  name: "Components/Button/Primary/Default",
  shapeType: sketch.ShapePath.ShapeType.Rectangle,
  frame: {
    x: 16,
    y: 100,
    width: buttonWidth,
    height: buttonHeight
  },
  style: {
    fills: [{
      color: '#007AFF', // System Blue
      fillType: 'Color'
    }],
    borders: [],
    shadows: [{
        color: '#00000040', // 25% opacity
        blur: 10,
        y: 4,
        x: 0,
        spread: 0,
        enabled: false // Disabled by default in flat design, but defined
    }]
  },
  parent: page
});

// Apply Pill Radius
button.points.forEach(p => p.cornerRadius = cornerRadius);

// 2. Create Label
const label = new sketch.Text({
  text: "Sign In",
  parent: page,
  frame: { x: 16, y: 100, width: buttonWidth, height: buttonHeight } // Placeholder frame
});

// Text Styling (SF Pro Display for Titles, Text for body. Buttons are usually Text-Semibold)
label.style.textColor = '#FFFFFF';
label.style.fontSize = 17;
label.style.fontWeight = 600; // Semibold
label.style.fontFamily = "SF Pro Text";
label.style.alignment = sketch.Text.Alignment.center;

// Force layout refresh to get text bounds
label.adjustToFit();

// Re-center logic
const textHeight = label.frame.height;
const textWidth = label.frame.width;

// Center manually
label.frame.x = 16 + (buttonWidth - textWidth) / 2;
label.frame.y = 100 + (buttonHeight - textHeight) / 2 - 1; // -1 optical adjustment

// Group them
const group = new sketch.Group({
    name: "Button Group",
    layers: [button, label],
    parent: page
});

// Lock constraints (Responsive)
button.resizingConstraint = 63; // Fixed height? No, standard resizing.

console.log(JSON.stringify({
    status: "Created 10/10 Pill Button",
    dimensions: { w: buttonWidth, h: buttonHeight, r: cornerRadius },
    text: label.text
}));
