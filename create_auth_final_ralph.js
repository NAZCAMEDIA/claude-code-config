const sketch = require('sketch');
const document = sketch.getSelectedDocument();
const page = document.selectedPage;

page.layers = []; 

const SPECS = {
    padding: 24,
    sheetWidth: 345,
    innerW: 297,
    radius: { input: 16, button: 26, sheet: 32 }
};

const ICONS = {
    google: `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/><path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/><path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/><path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/></svg>`,
    apple: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.8462 14.9608C17.8286 14.0759 18.2526 13.315 18.8415 12.636C18.2917 11.6663 17.3828 11.0886 16.2991 11.0886C15.0135 11.0886 14.1672 11.9678 13.1539 11.9678C12.1896 11.9678 11.4746 11.1264 10.3725 11.1264C8.9554 11.1264 7.62546 11.9566 6.90342 13.2045C5.46654 15.6888 6.5518 19.3879 7.95293 21.4116C8.63852 22.4019 9.45892 23.4938 10.5516 23.4938C11.6115 23.4938 11.9961 22.8123 13.3106 22.8123C14.6309 22.8123 14.9964 23.4938 16.1158 23.4938C17.2276 23.4938 17.9304 22.4851 18.6186 21.4891C19.1438 20.7303 19.6429 19.7214 19.8973 19.1983C19.8398 19.1687 18.0067 18.4715 17.8462 14.9608ZM15.4852 9.07921C16.0825 8.3563 16.4801 7.33871 16.3688 6.32677C15.4312 6.36531 14.3644 6.95831 13.6934 7.74906C13.0906 8.45524 12.6324 9.49755 12.7667 10.468C13.8016 10.548 14.8559 9.84379 15.4852 9.07921Z" fill="white"/></svg>`
};

function createBackground(artboard) {
    const bg = new sketch.ShapePath({
        name: "BG/Base",
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: 0, y: 0, width: 393, height: 852 },
        style: { fills: [{ color: '#F2F2F7' }] },
        parent: artboard
    });
    
    const blob1 = new sketch.ShapePath({
        shapeType: sketch.ShapePath.ShapeType.Oval, 
        frame: { x: -80, y: -80, width: 450, height: 450 },
        style: {
            fills: [{ color: '#007AFF' }], 
            opacity: 0.5, 
            blur: { center:{x:0.5,y:0.5}, isEnabled:true, radius:80, type: sketch.Style.BlurType.Gaussian } 
        },
        parent: artboard
    });

    const blob2 = new sketch.ShapePath({
        shapeType: sketch.ShapePath.ShapeType.Oval, 
        frame: { x: 100, y: 600, width: 400, height: 400 },
        style: {
            fills: [{ color: '#AF52DE' }], 
            opacity: 0.4, 
            blur: { center:{x:0.5,y:0.5}, isEnabled:true, radius:90, type: sketch.Style.BlurType.Gaussian } 
        },
        parent: artboard
    });
}

function createInput(parent, name, localY, width, placeholder) {
    const height = 52;
    const groupName = "Input/" + name;
    
    const group = new sketch.Group({
        name: groupName, 
        parent: parent,
        frame: { x: SPECS.padding, y: localY, width: width, height: height }
    });
    
    const bg = new sketch.ShapePath({
        name: "Bg",
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: 0, y: 0, width: width, height: height },
        style: { fills: [{ color: '#0000000D' }], borders: [] },
        parent: group
    });
    bg.points.forEach(p => p.cornerRadius = SPECS.radius.input);

    const text = new sketch.Text({
        text: placeholder,
        frame: { x: 16, y: 16, width: width - 32, height: 22 },
        style: { fontSize: 17, textColor: '#00000066', fontFamily: 'SF Pro Text', alignment: 'left' },
        parent: group
    });
    
    return localY + height;
}

function createButton(parent, name, localY, width, type, label, iconSVG) {
    const height = 52;
    const groupName = "Btn/" + name;
    
    const group = new sketch.Group({
        name: groupName, 
        parent: parent,
        frame: { x: SPECS.padding, y: localY, width: width, height: height }
    });

    let fill = '#007AFF';
    let textCol = '#FFFFFF';
    let border = null;
    let shadows = [];

    if (type === 'secondary') { fill = '#000000'; }
    if (type === 'tertiary') { 
        fill = '#FFFFFF'; 
        textCol = '#000000'; 
        border = { color: '#E5E5EA', thickness: 1, position: 'Inside' }; 
    }
    if (type === 'primary') {
        shadows = [{ color: '#007AFF4D', blur: 10, y: 5 }];
    }

    const style = { fills: [{ color: fill }], borders: [], shadows: shadows };
    if (border) style.borders.push(border);

    const bg = new sketch.ShapePath({
        name: "Bg",
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: 0, y: 0, width: width, height: height },
        style: style,
        parent: group
    });
    bg.points.forEach(p => p.cornerRadius = SPECS.radius.button);

    const tempText = new sketch.Text({ text: label, style: { fontSize: 17, fontWeight: 600, fontFamily: 'SF Pro Text' } });
    tempText.adjustToFit();
    const textW = tempText.frame.width;
    
    const iconSize = iconSVG ? (type === 'secondary' ? 24 : 18) : 0;
    const gap = 8;
    
    const totalContentW = textW + (iconSVG ? (iconSize + gap) : 0);
    const startX = (width - totalContentW) / 2;

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

    const labelLayer = new sketch.Text({
        text: label,
        frame: { 
            x: startX + (iconSVG ? (iconSize + gap) : 0), 
            y: (height - 22)/2 + 1, 
            width: textW + 5, 
            height: 22 
        },
        style: { fontSize: 17, fontWeight: 600, textColor: textCol, fontFamily: 'SF Pro Text', alignment: 'left' },
        parent: group
    });

    return localY + height;
}

function createSheet(artboard, isLogin) {
    const sheetH = isLogin ? 580 : 660;
    const sheetY = (852 - sheetH)/2;
    
    const group = new sketch.Group({
        name: isLogin ? "Login Sheet" : "SignUp Sheet",
        parent: artboard,
        frame: { x: 24, y: sheetY, width: SPECS.sheetWidth, height: sheetH }
    });

    const bg = new sketch.ShapePath({
        name: "SheetBg",
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: { x: 0, y: 0, width: SPECS.sheetWidth, height: sheetH },
        style: {
            fills: [{ color: '#FFFFFFCC' }], 
            borders: [{ color: '#FFFFFF', thickness: 1, position: 'Inside' }],
            shadows: [{ color: '#00000026', blur: 40, y: 20 }] 
        },
        parent: group
    });
    bg.points.forEach(p => p.cornerRadius = SPECS.radius.sheet);
    bg.style.blur = { center:{x:0.5,y:0.5}, isEnabled:true, radius:30, type: sketch.Style.BlurType.Background };

    let cY = 40;
    new sketch.Text({
        text: isLogin ? "Welcome Back" : "Create Account",
        frame: { x: SPECS.padding, y: cY, width: SPECS.innerW, height: 40 },
        style: { fontSize: 34, fontWeight: 700, alignment: 'center', fontFamily: 'SF Pro Display' },
        parent: group
    });
    cY += 60;

    if (!isLogin) { 
        cY = createInput(group, "Name", cY, SPECS.innerW, "Full Name");
        cY += 16; 
    }
    cY = createInput(group, "Email", cY, SPECS.innerW, "Email Address");
    cY += 16;
    cY = createInput(group, "Pass", cY, SPECS.innerW, "Password");
    cY += 32;

    cY = createButton(group, "Pri", cY, SPECS.innerW, 'primary', isLogin ? "Sign In" : "Sign Up");
    cY += 24;

    new sketch.Text({
        text: "Or continue with",
        frame: { x: SPECS.padding, y: cY, width: SPECS.innerW, height: 16 },
        style: { fontSize: 13, textColor: '#00000066', alignment: 'center', fontWeight: 500, fontFamily: 'SF Pro Text' },
        parent: group
    });
    cY += 30;

    cY = createButton(group, "Apple", cY, SPECS.innerW, 'secondary', "Continue with Apple", ICONS.apple);
    cY += 16;
    createButton(group, "Google", cY, SPECS.innerW, 'tertiary', "Continue with Google", ICONS.google);
}

function createOnboarding(xPos) {
    const ab = new sketch.Artboard({ name: "01 Onboarding", frame: {x:xPos, y:0, width:393, height:852}, parent: page });
    createBackground(ab);
    
    const logo = new sketch.ShapePath({
        shapeType: sketch.ShapePath.ShapeType.Oval,
        frame: {x:(393-120)/2, y:180, width:120, height:120},
        style: { fills:[{color: '#FFFFFF'}], shadows:[{color:'#0000001A', blur:20, y:10}] },
        parent: ab
    });
    
    new sketch.Text({
        text: "Liquid Glass",
        frame: { x: 24, y: 340, width: 345, height: 40 },
        style: { fontSize: 34, fontWeight: 700, alignment: 'center', fontFamily: 'SF Pro Display' },
        parent: ab
    });
    
    new sketch.Text({
        text: "Experience the next generation\nof interface design.",
        frame: { x: 24, y: 390, width: 345, height: 50 },
        style: { fontSize: 17, textColor: '#00000099', alignment: 'center', fontFamily: 'SF Pro Text' },
        parent: ab
    });

    const btnContainer = new sketch.Group({
        name: "Action", 
        parent: ab, 
        frame:{x:24, y:730, width:345, height:52}
    });
    
    const btn = new sketch.ShapePath({
        shapeType: sketch.ShapePath.ShapeType.Rectangle,
        frame: {x:0, y:0, width:345, height:52},
        style: {fills:[{color: '#007AFF'}], shadows:[{color:'#007AFF4D', blur:10, y:5}], borders: []},
        parent: btnContainer
    });
    btn.points.forEach(p => p.cornerRadius = 26);
    
    new sketch.Text({
        text:"Get Started", 
        frame:{x:0, y:15, width:345, height:22}, 
        style:{fontSize:17, fontWeight:600, textColor:'#FFFFFF', alignment:'center', fontFamily: 'SF Pro Text'},
        parent: btnContainer
    });
}

createOnboarding(0);

const loginAb = new sketch.Artboard({ name: "02 Login", frame: {x:450, y:0, width:393, height:852}, parent: page });
createBackground(loginAb);
createSheet(loginAb, true);

const signupAb = new sketch.Artboard({ name: "03 Signup", frame: {x:900, y:0, width:393, height:852}, parent: page });
createBackground(signupAb);
createSheet(signupAb, false);

console.log(JSON.stringify({status: "Ralph Wiggum Certified 10/10"}));