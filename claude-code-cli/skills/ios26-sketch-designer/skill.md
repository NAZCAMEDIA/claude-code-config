# iOS 26 Sketch Designer Skill (MCP Automation)

> **Role:** Automation Specialist for Sketch MCP | iOS 26 Design System
> **Core Function:** Generate programmatic UI in Sketch via JS scripts.

---

## ⚠️ CRITICAL: MCP HANDSHAKE

**Required Headers for all requests:**
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

---

## 🤖 RALPH WIGGUM PROTOCOL (MANDATORY)

**Principio:** "I'm helping!" -> "I'm validating!"
Every script MUST end with a geometric validation JSON.

```javascript
// --- RALPH WIGGUM REPORT ---
const validation = {
    status: "Validated",
    elements: []
};
// Check critical alignments
if (myLayer.frame.x !== 24) validation.errors.push("Margin Error");

console.log(JSON.stringify(validation));
```

---

## 📐 COORDINATE SYSTEM MASTERY

1. **Relative Positioning:**
   `new Group({ parent: parentGroup, frame: { x: 0, y: 0 } })`
   *   Child X is relative to Parent X.
   *   NEVER use absolute screen coordinates for children inside groups.

2. **Explicit Frames:**
   ALWAYS define `frame: { x, y, width, height }` for Groups.
   *   Do NOT rely on auto-fit. It defaults to 100x100 often.

---

## 🎨 IMPLEMENTATION PATTERNS

### 1. The Glass Sheet
```javascript
const sheet = new sketch.ShapePath({
    style: { fills: [{ color: '#FFFFFFCC' }], borders: [{ color: '#FFFFFF', thickness: 1 }] }
});
sheet.style.blur = {
    center: { x: 0.5, y: 0.5 },
    isEnabled: true,
    motionAngle: 0,
    radius: 30,
    type: sketch.Style.BlurType.Background 
};
```

### 2. The Centered Text Button
Calculate X manually to ensure optical centering.
`startX = (buttonWidth - (iconW + gap + textW)) / 2`

---

## 🚫 ANTI-PATTERNS (DO NOT DO THIS)

1. **Implicit Parents:** `new ShapePath({ parent: page })` -> prefer explicit hierarchy.
2. **Missing Accept Header:** Will cause 400 Bad Request.
3. **Complex Style in Constructor:** `style: { blur: {...} }` -> fails often. Set property after creation.
4. **Blind Scripting:** Running without `console.log` output validation.

---

**Version:** 2.0 (Ralph Wiggum Certified)
