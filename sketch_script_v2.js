const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const page = document.selectedPage;

// Clean page
page.layers = [];

// Create Button Background
const button = new sketch.ShapePath({
  name: "Button/Primary",
  shapeType: sketch.ShapePath.ShapeType.Rectangle,
  frame: {
    x: 100,
    y: 100,
    width: 200,
    height: 52 
  },
  style: {
    fills: [{
      color: '#007AFF', 
      fillType: 'Color'
    }],
    borders: []
  },
  parent: page
});

// Radius
button.points.forEach(p => p.cornerRadius = 14);

// Text
const label = new sketch.Text({
  text: "Continue",
  frame: { x: 100, y: 100, width: 200, height: 52 },
  parent: page
});

// FIX: Use style.alignment
label.style.alignment = sketch.Text.Alignment.center;
label.style.textColor = '#FFFFFF';
label.style.fontSize = 17;
label.style.fontWeight = 600;
label.style.fontFamily = "SF Pro Text";

// Vertical Center Calculation
// SF Pro Text 17pt cap height is approx 12pt, but line height is default.
// Let's center based on frame.
label.frame.y = 100 + (52 - label.frame.height)/2;

// Output Result for Gemini
const result = {
    button_frame: button.frame,
    button_style: button.style.fills[0],
    text_content: label.text,
    text_style: {
        align: label.style.alignment,
        color: label.style.textColor,
        font: label.style.fontFamily
    }
};

console.log(JSON.stringify(result));
return "Done";