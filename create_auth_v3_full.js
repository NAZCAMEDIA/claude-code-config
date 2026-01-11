const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const page = document.selectedPage;

page.layers = []; // Reset total para evitar duplicados

// ==========================================
// 🎨 DESIGN SYSTEM & ASSETS
// ==========================================

const COLORS = {
    primary: '#007AFF',
    background: '#F2F2F7',
    text: {
        primary: '#000000',
        secondary: '#00000099', // 60%
        tertiary: '#0000004D',  // 30%
        inverse: '#FFFFFF'
    },
    glass: {
        sheet: '#FFFFFFCC', // 80% White
        input: '#0000000D'  // 5% Black
    }
};

const ICONS = {
    google: `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/><path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/><path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/><path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/></svg>`,
    apple: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.8462 14.9608C17.8286 14.0759 18.2526 13.315 18.8415 12.636C18.2917 11.6663 17.3828 11.0886 16.2991 11.0886C15.0135 11.0886 14.1672 11.9678 13.1539 11.9678C12.1896 11.9678 11.4746 11.1264 10.3725 11.1264C8.9554 11.1264 7.62546 11.9566 6.90342 13.2045C5.46654 15.6888 6.5518 19.3879 7.95293 21.4116C8.63852 22.4019 9.45892 23.4938 10.5516 23.4938C11.6115 23.4938 11.9961 22.8123 13.3106 22.8123C14.6309 22.8123 14.9964 23.4938 16.1158 23.4938C17.2276 23.4938 17.9304 22.4851 18.6186 21.4891C19.1438 20.7303 19.6429 19.7214 19.8973 19.1983C19.8398 19.1687 18.0067 18.4715 17.8462 14.9608ZM15.4852 9.07921C16.0825 8.3563 16.4801 7.33871 16.3688 6.32677C15.4312 6.36531 14.3644 6.95831 13.6934 7.74906C13.0906 8.45524 12.6324 9.49755 12.7667 10.468C13.8016 10.548 14.8559 9.84379 15.4852 9.07921Z" fill="white"/></svg>`
};

// ==========================================
// 🛠 UTILITIES
// ==========================================

function applyBlur(layer, radius, saturation = 1.0) {
    layer.style.blur = {
        center: { x: 0.5, y: 0.5 },
        isEnabled: true,
        motionAngle: 0,
        radius: radius,
        type: sketch.Style.BlurType.Gaussian, 
    };
    // Note: Saturation adjustment is not directly exposed in simple JS API without diving into native internals, 
    // but Gaussian blur is standard. Background blur (for glass) is different.
}

function applyBackgroundBlur(layer, radius) {
     layer.style.blur = {
        center: { x: 0.5, y: 0.5 },
        isEnabled: true,
        motionAngle: 0,
        radius: radius,
        type: sketch.Style.BlurType.Background, 
    };
}

function createText(parent, text, x, y, width, size, weight, color, align = 'left', font = 'SF Pro Text') {
    return new sketch.Text({
        text: text,
        frame: { x: x, y: y, width: width, height: size * 1.5 },
        style: {
            fontSize: size,
            fontWeight: weight,
            textColor: color,
            alignment: align,
            fontFamily: font
        },
        parent: parent
    });
}

function createCenteredButton(parent, name, y, width, bgStyle, textProps, svgData, iconSize) {
    const btnHeight = 52;
    const gap = 8;
    
    const group = new sketch.Group({ name: name, parent: parent });

    const bg = new sketch.ShapePath({
        name: "Bg",
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: 0, y: y, width: width, height: btnHeight },
        style: bgStyle,
        parent: group
    });
    bg.points.forEach(p => p.cornerRadius = 26); // Pill shape

    // Temp text to measure width
    const textLayer = new sketch.Text({
        text: textProps.text,
        parent: group,
        style: {
            fontSize: 17,
            fontWeight: 600,
            fontFamily: 'SF Pro Text',
            textColor: textProps.textColor,
            alignment: 'left'
        }
    });
    textLayer.adjustToFit();
    const textWidth = textLayer.frame.width;
    const textHeight = textLayer.frame.height;

    // Center Logic
    const totalContentWidth = iconSize + (svgData ? gap : 0) + textWidth;
    const startX = (width - totalContentWidth) / 2;
    
    // Icon
    if (svgData) {
        try {
            const icon = sketch.createLayerFromData(svgData, 'svg');
            icon.parent = group;
            icon.frame.width = iconSize;
            icon.frame.height = iconSize;
            icon.frame.x = startX;
            icon.frame.y = y + (btnHeight - iconSize) / 2;
        } catch(e) {}
        textLayer.frame.x = startX + iconSize + gap;
    } else {
        textLayer.frame.x = startX;
    }

    textLayer.frame.y = y + (btnHeight - textHeight) / 2;

    return y + btnHeight;
}

function createInput(parent, y, width, placeholder, isPassword = false) {
    const height = 52;
    const bg = new sketch.ShapePath({
        name: `Input/${placeholder}`,
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: 0, y: y, width: width, height: height },
        style: { fills: [{ color: COLORS.glass.input }], borders: [] },
        parent: parent
    });
    bg.points.forEach(p => p.cornerRadius = 16);

    createText(parent, placeholder, 16, y + 16, width - 32, 17, 400, COLORS.text.tertiary);
    
    return y + height;
}

function createBackground(artboard, variant = 1) {
    // Base Gray
    new sketch.ShapePath({
        name: "Base",
        frame: { x: 0, y: 0, width: 393, height: 852 },
        style: { fills: [{ color: COLORS.background }] },
        parent: artboard
    });

    // Blobs
    const blob1 = new sketch.ShapePath({
        shapeType: sketch.ShapePath.ShapeType.Oval,
        frame: { x: -50, y: -50, width: 400, height: 400 },
        style: { fills: [{ color: '#007AFF' }], opacity: 0.4 },
        parent: artboard
    });
    applyBlur(blob1, 100);

    const blob2 = new sketch.ShapePath({
        shapeType: sketch.ShapePath.ShapeType.Oval,
        frame: { x: 100, y: 500, width: 400, height: 400 },
        style: { fills: [{ color: '#AF52DE' }], opacity: 0.3 },
        parent: artboard
    });
    applyBlur(blob2, 120);
}

// ==========================================
// 📱 SCREEN GENERATORS
// ==========================================

function createOnboarding(x) {
    const artboard = new sketch.Artboard({
        name: "01 Onboarding",
        frame: { x: x, y: 0, width: 393, height: 852 },
        parent: page
    });
    createBackground(artboard);

    // Hero Content
    const contentY = 320;
    
    // Logo Placeholder
    const logo = new sketch.ShapePath({
        shapeType: sketch.ShapePath.ShapeType.Oval,
        frame: { x: (393-120)/2, y: 160, width: 120, height: 120 },
        style: { 
            fills: [{ color: '#FFFFFF' }], 
            shadows: [{ color: '#0000001A', blur: 20, y: 10 }] 
        },
        parent: artboard
    });
    
    createText(artboard, "Liquid Glass", 24, contentY, 345, 40, 700, COLORS.text.primary, 'center', 'SF Pro Display');
    createText(artboard, "Experience the next generation\nof interface design.", 24, contentY + 60, 345, 17, 400, COLORS.text.secondary, 'center');

    // Bottom Action
    createCenteredButton(
        artboard, 
        "Btn/Start", 
        750, 
        345, 
        { fills: [{ color: COLORS.primary }], shadows: [{ color: '#007AFF4D', blur: 10, y: 5 }] }, 
        { text: "Get Started", textColor: '#FFFFFF' }, 
        null, 0
    ).frame; // We just need the button created, X positioning inside function is relative to group 0 which is wrong here. 
    
    // Fix Button Position (createCenteredButton assumes parent group 0,0 relative mostly)
    // Actually our createCenteredButton uses parent coordinates directly on shape. 
    // We need to wrap it in a container centered on screen.
    const btnGroup = artboard.layers.find(l => l.name === "Btn/Start");
    if(btnGroup) {
        btnGroup.frame.x = 24; // Margin 24
    }
}

function createAuthScreen(x, type) {
    const isLogin = type === 'login';
    const artboard = new sketch.Artboard({
        name: isLogin ? "02 Login" : "03 Sign Up",
        frame: { x: x, y: 0, width: 393, height: 852 },
        parent: page
    });
    createBackground(artboard);

    // Glass Sheet
    const sheetH = isLogin ? 580 : 650;
    const sheetY = (852 - sheetH) / 2;
    const padding = 24;
    const innerW = 345 - (padding * 2);

    const sheet = new sketch.Group({ name: "Glass Sheet", parent: artboard });
    sheet.frame.x = 24;
    sheet.frame.y = sheetY;
    sheet.frame.width = 345;
    sheet.frame.height = sheetH;

    // Sheet Bg
    const sheetBg = new sketch.ShapePath({
        name: "Sheet/Bg",
        frame: { x: 0, y: 0, width: 345, height: sheetH },
        style: { 
            fills: [{ color: COLORS.glass.sheet }], 
            borders: [{ color: '#FFFFFF', thickness: 1 }],
            shadows: [{ color: '#0000001A', blur: 40, y: 20 }] 
        },
        parent: sheet
    });
    sheetBg.points.forEach(p => p.cornerRadius = 32);
    applyBackgroundBlur(sheetBg, 30);

    // Content Flow
    let cY = 40;
    
    // Title
    createText(sheet, isLogin ? "Welcome Back" : "Create Account", padding, cY, innerW, 34, 700, COLORS.text.primary, 'center', 'SF Pro Display');
    cY += 60;

    // Inputs
    if (!isLogin) {
        cY = createInput(sheet, cY, innerW, "Full Name");
        cY += 16;
    }
    cY = createInput(sheet, cY, innerW, "Email Address");
    cY += 16;
    cY = createInput(sheet, cY, innerW, "Password", true);
    cY += 32;

    // Primary Action
    const primaryBtnY = createCenteredButton(
        sheet, 
        "Btn/Primary", 
        cY, 
        innerW, 
        { fills: [{ color: COLORS.primary }], shadows: [{ color: '#007AFF4D', blur: 10, y: 5 }] }, 
        { text: isLogin ? "Sign In" : "Sign Up", textColor: '#FFFFFF' }, 
        null, 0
    );
    // Adjust X manually for the group created by function
    const pBtn = sheet.layers.find(l => l.name === "Btn/Primary");
    if(pBtn) pBtn.frame.x = padding;
    cY = primaryBtnY + 24;

    // Divider
    createText(sheet, "Or continue with", padding, cY, innerW, 13, 500, COLORS.text.tertiary, 'center');
    cY += 30;

    // Social Apple
    const appleY = createCenteredButton(
        sheet, 
        "Btn/Apple", 
        cY, 
        innerW, 
        { fills: [{ color: '#000000' }] }, 
        { text: "Continue with Apple", textColor: '#FFFFFF' }, 
        ICONS.apple, 18
    );
    const appleBtn = sheet.layers.find(l => l.name === "Btn/Apple");
    if(appleBtn) appleBtn.frame.x = padding;
    cY = appleY + 16;

    // Social Google
    const googleY = createCenteredButton(
        sheet, 
        "Btn/Google", 
        cY, 
        innerW, 
        { fills: [{ color: '#FFFFFF' }], borders: [{ color: '#E5E5EA', thickness: 1, position: 'Inside' }] }, 
        { text: "Continue with Google", textColor: COLORS.text.primary }, 
        ICONS.google, 18
    );
    const googleBtn = sheet.layers.find(l => l.name === "Btn/Google");
    if(googleBtn) googleBtn.frame.x = padding;
}

// ==========================================
// 🚀 MAIN EXECUTION
// ==========================================

createOnboarding(0);
createAuthScreen(450, 'login');
createAuthScreen(900, 'signup');

console.log(JSON.stringify({
    status: "Success", 
    screens: ["Onboarding", "Login", "SignUp"],
    theme: "Liquid Glass v2"
}));
