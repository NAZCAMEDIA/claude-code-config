const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const page = document.selectedPage;

// --- RALPH WIGGUM CONFIG ---
const DEBUG_MODE = true;
const SPECS = {
    padding: 24,
    grid: 8,
    radius: {
        sheet: 32,
        button: 26,
        input: 16
    }
};

page.layers = []; // Limpieza total

// --- ASSETS ---
const ICONS = {
    google: `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/><path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/><path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/><path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/></svg>`,
    apple: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.8462 14.9608C17.8286 14.0759 18.2526 13.315 18.8415 12.636C18.2917 11.6663 17.3828 11.0886 16.2991 11.0886C15.0135 11.0886 14.1672 11.9678 13.1539 11.9678C12.1896 11.9678 11.4746 11.1264 10.3725 11.1264C8.9554 11.1264 7.62546 11.9566 6.90342 13.2045C5.46654 15.6888 6.5518 19.3879 7.95293 21.4116C8.63852 22.4019 9.45892 23.4938 10.5516 23.4938C11.6115 23.4938 11.9961 22.8123 13.3106 22.8123C14.6309 22.8123 14.9964 23.4938 16.1158 23.4938C17.2276 23.4938 17.9304 22.4851 18.6186 21.4891C19.1438 20.7303 19.6429 19.7214 19.8973 19.1983C19.8398 19.1687 18.0067 18.4715 17.8462 14.9608ZM15.4852 9.07921C16.0825 8.3563 16.4801 7.33871 16.3688 6.32677C15.4312 6.36531 14.3644 6.95831 13.6934 7.74906C13.0906 8.45524 12.6324 9.49755 12.7667 10.468C13.8016 10.548 14.8559 9.84379 15.4852 9.07921Z" fill="white"/></svg>`
};

// --- CORE FUNCTIONS (THE RALPH ENGINE) ---

function createInput(parent, name, localY, width, placeholder, isPassword = false) {
    const height = 52;
    // CRITICAL: x is relative to parent. Parent (Sheet) has internal padding logic.
    // We assume 'parent' is the Sheet Group.
    // The content inside the sheet starts at x = SPECS.padding
    
    const x = SPECS.padding; // 24pt relative to sheet left edge
    const effectiveWidth = width; // Width passed should be the INNER width

    const group = new sketch.Group({ name: `InputGroup/${name}`, parent: parent });
    // Not setting group frame here, we let children define it or we set it explicitly?
    // Safer to set children relative to 0,0 of this group, then move the group.
    
    const bg = new sketch.ShapePath({
        name: "Bg",
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: 0, y: 0, width: effectiveWidth, height: height },
        style: { fills: [{ color: '#0000000D' }], borders: [] },
        parent: group
    });
    bg.points.forEach(p => p.cornerRadius = SPECS.radius.input);

    const text = new sketch.Text({
        text: placeholder,
        frame: { x: 16, y: 16, width: effectiveWidth - 32, height: 22 },
        style: {
            fontSize: 17,
            textColor: '#00000066',
            fontFamily: 'SF Pro Text',
            alignment: 'left'
        },
        parent: group
    });

    // Positioning the GROUP relative to the Sheet
    group.frame.x = x;
    group.frame.y = localY;

    return localY + height;
}

function createButton(parent, name, localY, width, type, label, iconSVG) {
    const height = 52;
    const x = SPECS.padding; // 24pt relative
    
    const group = new sketch.Group({ name: `BtnGroup/${name}`, parent: parent });
    
    let fill = '#007AFF';
    let textCol = '#FFFFFF';
    let border = null;

    if (type === 'secondary') {
        fill = '#000000'; // Apple
    } else if (type === 'tertiary') {
        fill = '#FFFFFF'; // Google
        textCol = '#000000';
        border = { color: '#E5E5EA', thickness: 1 };
    }

    const style = { fills: [{ color: fill }], borders: [] };
    if (border) style.borders.push({ ...border, position: 'Inside' });
    if (type === 'primary') style.shadows = [{ color: '#007AFF4D', blur: 10, y: 5 }];

    const bg = new sketch.ShapePath({
        name: "Bg",
        frame: { x: 0, y: 0, width: width, height: height },
        style: style,
        parent: group
    });
    bg.points.forEach(p => p.cornerRadius = SPECS.radius.button);

    // Text & Icon Layout
    const tempText = new sketch.Text({ text: label, style: { fontSize: 17, fontWeight: 600, fontFamily: 'SF Pro Text' } });
    tempText.adjustToFit();
    const textW = tempText.frame.width;
    const iconSize = iconSVG ? (type === 'secondary' ? 24 : 18) : 0; // Apple 24, Google 18
    const gap = 8;
    const totalW = textW + (iconSVG ? iconSize + gap : 0);
    
    const startX = (width - totalW) / 2;
    
    if (iconSVG) {
        try {
            const icon = sketch.createLayerFromData(iconSVG, 'svg');
            icon.parent = group;
            icon.frame.width = iconSize;
            icon.frame.height = iconSize;
            icon.frame.x = startX;
            icon.frame.y = (height - iconSize) / 2;
        } catch(e) {}
    }

    const textLayer = new sketch.Text({
        text: label,
        frame: { 
            x: startX + (iconSVG ? iconSize + gap : 0), 
            y: (height - 22) / 2 + 1, // +1 optical correction 
            width: textW + 5, 
            height: 22 
        },
        style: {
            fontSize: 17,
            fontWeight: 600,
            textColor: textCol,
            fontFamily: 'SF Pro Text',
            alignment: 'left'
        },
        parent: group
    });

    group.frame.x = x;
    group.frame.y = localY;

    return localY + height;
}

function createSheet(artboard, type) {
    const isLogin = type === 'login';
    const sheetW = 345;
    // Calculate Height Dynamic? No, fixed for now but precise
    // Login: Title(40) + Gap(50) + Inputs(2*68) + Button(52) + Gap(24) + Divider(30) + Social(2*68) = Approx 580
    const sheetH = isLogin ? 580 : 660; 
    
    const sheetX = 24; // Margin left on Artboard (393 - 345 = 48 / 2 = 24)
    const sheetY = (852 - sheetH) / 2;

    const sheetGroup = new sketch.Group({ name: "GlassSheet", parent: artboard });
    sheetGroup.frame.x = sheetX;
    sheetGroup.frame.y = sheetY;
    sheetGroup.frame.width = sheetW;
    sheetGroup.frame.height = sheetH;

    // Background
    const bg = new sketch.ShapePath({
        name: "SheetBase",
        frame: { x: 0, y: 0, width: sheetW, height: sheetH },
        style: {
            fills: [{ color: '#FFFFFFCC' }],
            borders: [{ color: '#FFFFFF', thickness: 1, position: 'Inside' }],
            shadows: [{ color: '#00000026', blur: 40, y: 20 }]
        },
        parent: sheetGroup
    });
    bg.points.forEach(p => p.cornerRadius = SPECS.radius.sheet);
    bg.style.blur = { center: {x:0.5, y:0.5}, isEnabled: true, radius: 30, type: sketch.Style.BlurType.Background };

    // Inner Content Width
    const innerW = sheetW - (SPECS.padding * 2); // 345 - 48 = 297

    // --- CONTENT FLOW ---
    let cY = 40;

    // Title
    const title = new sketch.Text({
        text: isLogin ? "Welcome Back" : "Create Account",
        frame: { x: SPECS.padding, y: cY, width: innerW, height: 40 },
        style: { fontSize: 34, fontWeight: 700, alignment: 'center', fontFamily: 'SF Pro Display' },
        parent: sheetGroup
    });
    cY += 60;

    // Inputs
    if (!isLogin) {
        cY = createInput(sheetGroup, "Name", cY, innerW, "Full Name");
        cY += 16;
    }
    cY = createInput(sheetGroup, "Email", cY, innerW, "Email Address");
    cY += 16;
    cY = createInput(sheetGroup, "Pass", cY, innerW, "Password", true);
    cY += 32;

    // Primary
    cY = createButton(sheetGroup, "Primary", cY, innerW, 'primary', isLogin ? "Sign In" : "Sign Up");
    cY += 24;

    // Divider
    new sketch.Text({
        text: "Or continue with",
        frame: { x: SPECS.padding, y: cY, width: innerW, height: 16 },
        style: { fontSize: 13, textColor: '#00000066', alignment: 'center', fontWeight: 500, fontFamily: 'SF Pro Text' },
        parent: sheetGroup
    });
    cY += 30;

    // Socials
    cY = createButton(sheetGroup, "Apple", cY, innerW, 'secondary', "Continue with Apple", ICONS.apple);
    cY += 16;
    cY = createButton(sheetGroup, "Google", cY, innerW, 'tertiary', "Continue with Google", ICONS.google);

    return sheetGroup;
}

// --- EXECUTION ---

const artboard = new sketch.Artboard({
    name: "02 Login [Ralph Validated]",
    frame: { x: 0, y: 0, width: 393, height: 852 },
    parent: page
});

// Artboard BG
new sketch.ShapePath({ frame: {x:0,y:0,width:393,height:852}, style: {fills:['#F2F2F7']}, parent: artboard });

// Run
const resultSheet = createSheet(artboard, 'login');

// --- RALPH REPORT ---
// We inspect the actual frames generated
console.log(JSON.stringify({
    sheetFrame: resultSheet.frame,
    firstChildFrame: resultSheet.layers[0].frame, // Should be BG
    inputFrame: resultSheet.layers.find(l => l.name.includes("Input"))?.frame,
    expectedInputX: SPECS.padding
}));
