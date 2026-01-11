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

function hexToRgba(hex) {
    // Basic implementation for Sketch API if needed, but usually hex string works
    return hex;
}

// --- OFFICIAL ASSETS (VECTOR DATA) ---

// Google "G" Logo - Simplified Vector Construction
// In a real CLI scenario, we would define SVG path data and import it.
// Since we are using Sketch API 'ShapePath', we can try to use SVG path string integration
// or construct simpler approximations if SVG parsing isn't exposed in this minimal API.
// SKETCH API has `sketch.createLayerFromData` for SVG strings! This is the KEY.

const googleIconSVG = `
<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
</svg>
`;

const appleIconSVG = `
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.8462 14.9608C17.8286 14.0759 18.2526 13.315 18.8415 12.636C18.2917 11.6663 17.3828 11.0886 16.2991 11.0886C15.0135 11.0886 14.1672 11.9678 13.1539 11.9678C12.1896 11.9678 11.4746 11.1264 10.3725 11.1264C8.9554 11.1264 7.62546 11.9566 6.90342 13.2045C5.46654 15.6888 6.5518 19.3879 7.95293 21.4116C8.63852 22.4019 9.45892 23.4938 10.5516 23.4938C11.6115 23.4938 11.9961 22.8123 13.3106 22.8123C14.6309 22.8123 14.9964 23.4938 16.1158 23.4938C17.2276 23.4938 17.9304 22.4851 18.6186 21.4891C19.1438 20.7303 19.6429 19.7214 19.8973 19.1983C19.8398 19.1687 18.0067 18.4715 17.8462 14.9608ZM15.4852 9.07921C16.0825 8.3563 16.4801 7.33871 16.3688 6.32677C15.4312 6.36531 14.3644 6.95831 13.6934 7.74906C13.0906 8.45524 12.6324 9.49755 12.7667 10.468C13.8016 10.548 14.8559 9.84379 15.4852 9.07921Z" fill="white"/>
</svg>
`;

function createOfficialSocialButtons(parent, startX, startY, width) {
    let y = startY;

    // Divider
    new sketch.Text({
        text: "Or continue with",
        frame: { x: startX, y: y, width: width, height: 20 },
        style: { textColor: '#00000066', fontSize: 13, fontWeight: 500, alignment: 'center', fontFamily: 'SF Pro Text' },
        parent: parent
    });
    y += 30;

    // --- APPLE BUTTON (Official) ---
    const appleBtnGroup = new sketch.Group({
        name: "Btn/Apple",
        parent: parent
    });
    
    // Bg
    const appleBg = new sketch.ShapePath({
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: startX, y: y, width: width, height: 52 },
        style: { fills: [{ color: '#000000' }] },
        parent: appleBtnGroup
    });
    appleBg.points.forEach(p => p.cornerRadius = 26);

    // Text
    const appleText = new sketch.Text({
        text: "Continue with Apple",
        frame: { x: startX, y: y + 15, width: width, height: 22 },
        style: { textColor: '#FFFFFF', fontSize: 17, fontWeight: 600, alignment: 'center', fontFamily: 'SF Pro Text' },
        parent: appleBtnGroup
    });
    
    // Import SVG Icon
    try {
        const appleIconGroup = sketch.createLayerFromData(appleIconSVG, 'svg');
        appleIconGroup.parent = appleBtnGroup;
        // Position Icon: To the left of text. 
        // Approx text width for "Continue with Apple" is 150px.
        // Center of button is startX + width/2.
        // Icon should be at: Center - (TextWidth/2) - IconWidth - Gap
        const iconX = (startX + width/2) - (160/2) - 24; 
        appleIconGroup.frame.x = iconX;
        appleIconGroup.frame.y = y + 14;
        appleIconGroup.frame.width = 24;
        appleIconGroup.frame.height = 24;
        appleIconGroup.name = "Icon/Apple";
    } catch (e) {
        console.log("Error importing Apple SVG: " + e);
    }
    y += 68;

    // --- GOOGLE BUTTON (Official) ---
    const googleBtnGroup = new sketch.Group({
        name: "Btn/Google",
        parent: parent
    });

    // Bg
    const googleBg = new sketch.ShapePath({
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: startX, y: y, width: width, height: 52 },
        style: { fills: [{ color: '#FFFFFF' }], borders: [{ color: '#E5E5EA', thickness: 1, position: 'Inside' }] },
        parent: googleBtnGroup
    });
    googleBg.points.forEach(p => p.cornerRadius = 26);

    // Text
    const googleText = new sketch.Text({
        text: "Continue with Google",
        frame: { x: startX, y: y + 15, width: width, height: 22 },
        style: { textColor: '#000000', fontSize: 17, fontWeight: 600, alignment: 'center', fontFamily: 'SF Pro Text' },
        parent: googleBtnGroup
    });

    // Import SVG Icon
    try {
        const googleIconGroup = sketch.createLayerFromData(googleIconSVG, 'svg');
        googleIconGroup.parent = googleBtnGroup;
        const iconX = (startX + width/2) - (170/2) - 20; 
        googleIconGroup.frame.x = iconX;
        googleIconGroup.frame.y = y + 17; // 18x18 icon
        googleIconGroup.frame.width = 18;
        googleIconGroup.frame.height = 18;
        googleIconGroup.name = "Icon/Google";
    } catch (e) {
        console.log("Error importing Google SVG: " + e);
    }

    return y + 52 + 24;
}

// ... REUSING PREVIOUS SCREEN LOGIC FOR LOGIN/SIGNUP ...
// (I will reconstruct the main flow calling createOfficialSocialButtons)

const artboard = new sketch.Artboard({
  name: "Auth / Login Official",
  frame: { x: 0, y: 0, width: 393, height: 852 },
  parent: page
});

// Background
const bg = new sketch.ShapePath({
  frame: { x: 0, y: 0, width: 393, height: 852 },
  style: { fills: [{ color: '#F2F2F7' }] },
  parent: artboard
});
// (Skipping complex blobs for brevity of this vector demo, adding simple one)
const blob = new sketch.ShapePath({
  shapeType: sketch.ShapePath.ShapeType.Oval,
  frame: { x: -80, y: -80, width: 450, height: 450 },
  style: { fills: [{ color: '#007AFF' }] },
  parent: artboard
});
applyBlur(blob, 80, 0);
blob.style.opacity = 0.5;

// Sheet
const sheet = new sketch.ShapePath({
  frame: { x: 24, y: 120, width: 345, height: 600 },
  style: { fills: [{ color: '#FFFFFFCC' }], shadows: [{ color: '#00000026', blur: 40, y: 20 }] },
  parent: artboard
});
sheet.points.forEach(p => p.cornerRadius = 32);
applyBlur(sheet, 30, 1);

// Content
let cY = 160;
new sketch.Text({
    text: "Welcome",
    frame: { x: 48, y: cY, width: 297, height: 40 },
    style: { fontSize: 34, fontWeight: 700, fontFamily: 'SF Pro Display' },
    parent: artboard
});
cY += 120; // Skip inputs for this demo to focus on buttons

createOfficialSocialButtons(artboard, 48, cY, 297);

console.log(JSON.stringify({ status: "Official SVG Assets Integrated" }));
