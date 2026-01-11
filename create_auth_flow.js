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
        type: type, 
    };
}

function createBackground(artboard) {
    // Base
    const bgBase = new sketch.ShapePath({
        name: "BG/Base",
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: 0, y: 0, width: 393, height: 852 },
        style: { fills: [{ color: '#F2F2F7' }], borders: [] },
        parent: artboard
    });

    // Blobs
    const blob1 = new sketch.ShapePath({
        name: "BG/Blob1",
        shapeType: sketch.ShapePath.ShapeType.Oval,
        frame: { x: -80, y: -80, width: 450, height: 450 },
        style: { fills: [{ color: '#007AFF' }], borders: [] },
        parent: artboard
    });
    blob1.style.opacity = 0.5;
    applyBlur(blob1, 80, 0);

    const blob2 = new sketch.ShapePath({
        name: "BG/Blob2",
        shapeType: sketch.ShapePath.ShapeType.Oval,
        frame: { x: 100, y: 600, width: 400, height: 400 },
        style: { fills: [{ color: '#AF52DE' }], borders: [] },
        parent: artboard
    });
    blob2.style.opacity = 0.4;
    applyBlur(blob2, 90, 0);
}

function createSocialButtons(parent, startX, startY, width) {
    let y = startY;

    // --- DIVIDER ---
    const dividerText = new sketch.Text({
        text: "Or continue with",
        frame: { x: startX, y: y, width: width, height: 20 },
        style: {
            textColor: '#00000066', // 40%
            fontSize: 13,
            fontWeight: 500,
            alignment: sketch.Text.Alignment.center,
            fontFamily: 'SF Pro Text'
        },
        parent: parent
    });
    y += 30;

    // --- APPLE BUTTON (Official: Black Fill, White Text) ---
    const appleBtn = new sketch.ShapePath({
        name: "Btn/Apple/Bg",
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: startX, y: y, width: width, height: 52 },
        style: {
            fills: [{ color: '#000000' }],
            borders: []
        },
        parent: parent
    });
    appleBtn.points.forEach(p => p.cornerRadius = 26);

    const appleIcon = new sketch.Text({
        text: "  Continue with Apple", // Native Glyph
        frame: { x: startX, y: y + 15, width: width, height: 22 },
        style: {
            textColor: '#FFFFFF',
            fontSize: 17,
            fontWeight: 600,
            alignment: sketch.Text.Alignment.center,
            fontFamily: 'SF Pro Text'
        },
        parent: parent
    });
    y += 52 + 16;

    // --- GOOGLE BUTTON (Official: White, Border, Dark Text) ---
    const googleBtn = new sketch.ShapePath({
        name: "Btn/Google/Bg",
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: startX, y: y, width: width, height: 52 },
        style: {
            fills: [{ color: '#FFFFFF' }],
            borders: [{ color: '#E5E5EA', thickness: 1, position: 'Inside' }] // System Gray 5
        },
        parent: parent
    });
    googleBtn.points.forEach(p => p.cornerRadius = 26);

    const googleText = new sketch.Text({
        text: "G  Continue with Google", // G placeholder for robustness
        frame: { x: startX, y: y + 15, width: width, height: 22 },
        style: {
            textColor: '#000000',
            fontSize: 17,
            fontWeight: 600,
            alignment: sketch.Text.Alignment.center,
            fontFamily: 'SF Pro Text'
        },
        parent: parent
    });
    
    // Simulate Colorful G (Hacky Overlay)
    // In a real scenario we'd create the vector, but text is safer for CLI
    const gCover = new sketch.Text({
        text: "G",
        frame: { x: startX + 68, y: y + 15, width: 20, height: 22 }, // Approx position
        style: {
            textColor: '#4285F4', // Google Blue
            fontSize: 17,
            fontWeight: 700,
            fontFamily: 'SF Pro Text'
        },
        parent: parent
    });

    return y + 52 + 24; // Return new Y cursor
}

// ==========================================
// SCREEN 1: LOGIN
// ==========================================
const loginArtboard = new sketch.Artboard({
  name: "Auth / Login",
  frame: { x: 0, y: 0, width: 393, height: 852 },
  parent: page
});
createBackground(loginArtboard);

// Glass Sheet (Taller for Social)
const sheetW = 345;
const sheetX = 24;
const loginSheetH = 640; // Increased height
const sheetY = 106; // Moved up

const loginSheet = new sketch.ShapePath({
  name: "Container",
  shapeType: sketch.ShapePath.ShapeType.Rectangle,
  frame: { x: sheetX, y: sheetY, width: sheetW, height: loginSheetH },
  style: {
    fills: [{ color: '#FFFFFFCC' }],
    borders: [{ color: '#FFFFFF', thickness: 1 }],
    shadows: [{ color: '#00000026', blur: 40, y: 20 }]
  },
  parent: loginArtboard
});
loginSheet.points.forEach(p => p.cornerRadius = 32);
applyBlur(loginSheet, 30, 1);

// Content
let cursorY = sheetY + 40;
const contentW = sheetW - 48;
const contentX = sheetX + 24;

// Headers
new sketch.Text({
    text: "Welcome Back",
    frame: { x: contentX, y: cursorY, width: contentW, height: 40 },
    style: { fontSize: 34, fontWeight: 700, fontFamily: 'SF Pro Display' },
    parent: loginArtboard
});
cursorY += 50;

// Inputs
["Email", "Password"].forEach(placeholder => {
    const bg = new sketch.ShapePath({
        frame: { x: contentX, y: cursorY, width: contentW, height: 52 },
        style: { fills: [{ color: '#0000000D' }], borders: [] },
        parent: loginArtboard
    });
    bg.points.forEach(p => p.cornerRadius = 16);
    
    new sketch.Text({
        text: placeholder,
        frame: { x: contentX + 16, y: cursorY + 16, width: contentW, height: 22 },
        style: { fontSize: 17, textColor: '#00000066', fontFamily: 'SF Pro Text' },
        parent: loginArtboard
    });
    cursorY += 68;
});

// Primary Button
const btnLogin = new sketch.ShapePath({
    frame: { x: contentX, y: cursorY, width: contentW, height: 52 },
    style: { fills: [{ color: '#007AFF' }], borders: [], shadows: [{color: '#007AFF4D', blur:10, y:5}] },
    parent: loginArtboard
});
btnLogin.points.forEach(p => p.cornerRadius = 26);

new sketch.Text({
    text: "Sign In",
    frame: { x: contentX, y: cursorY + 15, width: contentW, height: 22 },
    style: { fontSize: 17, fontWeight: 600, textColor: '#FFFFFF', alignment: 'center', fontFamily: 'SF Pro Text' },
    parent: loginArtboard
});
cursorY += 80;

// Social
cursorY = createSocialButtons(loginArtboard, contentX, cursorY, contentW);

// Footer
new sketch.Text({
    text: "Don't have an account? Sign Up",
    frame: { x: contentX, y: cursorY, width: contentW, height: 22 },
    style: { fontSize: 15, fontWeight: 500, textColor: '#007AFF', alignment: 'center', fontFamily: 'SF Pro Text' },
    parent: loginArtboard
});


// ==========================================
// SCREEN 2: SIGN UP
// ==========================================
const signupArtboard = new sketch.Artboard({
  name: "Auth / Sign Up",
  frame: { x: 450, y: 0, width: 393, height: 852 }, // Offset X
  parent: page
});
createBackground(signupArtboard);

const signupSheet = new sketch.ShapePath({
  name: "Container",
  shapeType: sketch.ShapePath.ShapeType.Rectangle,
  frame: { x: sheetX, y: sheetY - 40, width: sheetW, height: loginSheetH + 68 }, // Taller for Name input
  style: {
    fills: [{ color: '#FFFFFFCC' }],
    borders: [{ color: '#FFFFFF', thickness: 1 }],
    shadows: [{ color: '#00000026', blur: 40, y: 20 }]
  },
  parent: signupArtboard
});
signupSheet.points.forEach(p => p.cornerRadius = 32);
applyBlur(signupSheet, 30, 1);

cursorY = sheetY; // Reset cursor
// Headers
new sketch.Text({
    text: "Create Account",
    frame: { x: contentX, y: cursorY, width: contentW, height: 40 },
    style: { fontSize: 34, fontWeight: 700, fontFamily: 'SF Pro Display' },
    parent: signupArtboard
});
cursorY += 50;

// Inputs
["Full Name", "Email", "Password"].forEach(placeholder => {
    const bg = new sketch.ShapePath({
        frame: { x: contentX, y: cursorY, width: contentW, height: 52 },
        style: { fills: [{ color: '#0000000D' }], borders: [] },
        parent: signupArtboard
    });
    bg.points.forEach(p => p.cornerRadius = 16);
    
    new sketch.Text({
        text: placeholder,
        frame: { x: contentX + 16, y: cursorY + 16, width: contentW, height: 22 },
        style: { fontSize: 17, textColor: '#00000066', fontFamily: 'SF Pro Text' },
        parent: signupArtboard
    });
    cursorY += 68;
});

// Primary Button
const btnSignup = new sketch.ShapePath({
    frame: { x: contentX, y: cursorY, width: contentW, height: 52 },
    style: { fills: [{ color: '#007AFF' }], borders: [], shadows: [{color: '#007AFF4D', blur:10, y:5}] },
    parent: signupArtboard
});
btnSignup.points.forEach(p => p.cornerRadius = 26);

new sketch.Text({
    text: "Sign Up",
    frame: { x: contentX, y: cursorY + 15, width: contentW, height: 22 },
    style: { fontSize: 17, fontWeight: 600, textColor: '#FFFFFF', alignment: 'center', fontFamily: 'SF Pro Text' },
    parent: signupArtboard
});
cursorY += 80;

// Social
cursorY = createSocialButtons(signupArtboard, contentX, cursorY, contentW);

// Footer
new sketch.Text({
    text: "Already have an account? Sign In",
    frame: { x: contentX, y: cursorY, width: contentW, height: 22 },
    style: { fontSize: 15, fontWeight: 500, textColor: '#007AFF', alignment: 'center', fontFamily: 'SF Pro Text' },
    parent: signupArtboard
});

console.log(JSON.stringify({
    status: "Auth Flow Created",
    screens: 2,
    social_integration: true
}));
