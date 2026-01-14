const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const page = document.selectedPage;

// Clean page first for test
page.layers = [];

// Create Button Background
const button = new sketch.ShapePath({
  name: "Button/Primary",
  shapeType: sketch.ShapePath.ShapeType.Rectangle,
  frame: {
    x: 100,
    y: 100,
    width: 200,
    height: 52 // iOS 26 Standard
  },
  style: {
    fills: [{
      color: '#007AFF', // System Blue
      fillType: 'Color'
    }],
    borders: []
  },
  parent: page
});

// Set Corner Radius
button.points.forEach(p => p.cornerRadius = 14); // Continuous curve approximation

// Add Text
const label = new sketch.Text({
  text: "Continue",
  frame: { x: 100, y: 100, width: 200, height: 52 },
  alignment: sketch.Text.Alignment.center,
  parent: page
});
label.style.textColor = '#FFFFFF';
label.style.fontSize = 17;
label.style.fontWeight = 600; // Semibold
label.style.fontFamily = "SF Pro Text";

// Align Text
label.frame.y = 100 + (52 - label.frame.height)/2;

return JSON.stringify({
    background: {
        frame: button.frame,
        style: button.style
    },
    label: {
        text: label.text,
        frame: label.frame,
        style: label.style
    }
});