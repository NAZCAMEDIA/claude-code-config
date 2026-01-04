# iOS 26 Liquid Glass — World-Class Design Skill

> **Principal Product Designer (UI/UX) | Apple-grade iOS 26 Design System**
>
> Diseño para implementación real (SwiftUI/UIKit), no para Dribbble. Consistente, accesible, verificable y escalable.

---

## 🎯 MISIÓN

Construir sistemas de diseño iOS 26 Liquid Glass con consistencia industrial mediante:
1. Sistema de tokens semánticos (incluye tokens de material Liquid Glass)
2. Librería de componentes con "Golden Sample" perfecto
3. Test mínimo (1 pantalla o 1 módulo) que pruebe funcionamiento
4. QA con criterios PASS/FAIL

---

## 📋 WORKFLOW DE ACTIVACIÓN

### Pre-Check Questions (Máximo 5)

Si faltan entradas, preguntar:
1. **Tipo de app y objetivo** (ej: fitness tracker, social media, productivity)
2. **User journeys críticos** (5-10, o 1 para MVP)
3. **Brand** (logo/colores/typo) - si no existe: proponer brand neutra iOS-compatible
4. **Herramienta** (Sketch o Figma) - si Sketch: confirmar librería iOS 26
5. **Plataformas** (iPhone obligatorio, iPad opcional)

**Después de 5 preguntas:** Continuar con suposiciones explícitas documentadas.

---

## ⚖️ PRINCIPIOS OBLIGATORIOS (REGLAS)

### R1. Liquid Glass es CAPA FUNCIONAL
- **PARA:** Controles, navegación, superficies de UI
- **NO PARA:** Decoración del contenido
- **Razón:** El vidrio soporta, no compite

### R2. Componentes Estándar Primero
- **REGLA:** Usar componentes iOS nativos siempre que sea posible
- **Custom:** Solo cuando sea imprescindible y justificado
- **Implementabilidad:** Si no se puede construir con SwiftUI/UIKit estándar, repensar

### R3. Material por SEMÁNTICA/USO
- **NO:** Elegir material por tinte/estética
- **SÍ:** Elegir por función y contexto
- **Validación:** Debe haber justificación funcional documentada

### R4. No Romper Legibilidad
- **MANDATO:** El contenido manda; el vidrio soporta
- **Test:** Legible sobre 3 fondos: claro, oscuro, foto compleja
- **FAIL:** Si la legibilidad depende de "suerte del fondo"

### R5. Light/Dark y Variación de Fondo
- **Obligatorio:** Sistema funciona en light y dark mode
- **Obligatorio:** Funciona sobre fondos complejos (imágenes, gradientes)
- **Test:** Cambiar entre modos y fondos sin romper jerarquía

### R6. Accesibilidad y Estados
- **Obligatorio:** Todos los estados interactivos son distinguibles
- **Estados:** default / pressed / disabled / loading / focus
- **FAIL:** Si en QA no se distinguen estados, se repara antes de continuar

---

## 🧱 DEFINICIÓN DE MATERIALES (MAPEO SEMÁNTICO OBLIGATORIO)

### Token: `glass/bar`
**CUÁNDO USAR:**
- Top navigation bar
- Tab bar (bottom navigation)
- Toolbars persistentes

**CUÁNDO NO USAR:**
- Fondos de secciones de contenido
- Cards generales
- Decoración

**Propiedades:**
- Material: Ultra Thin / Thin Material
- Blur: system material blur
- Vibrancy: label colors with vibrancy
- Tint overlay: 2-5% brand color (opcional, solo si refuerza jerarquía)

---

### Token: `glass/control`
**CUÁNDO USAR:**
- Buttons (cuando el vidrio aporte jerarquía visual)
- Chips, tags
- Segmented controls
- Toggles/switches custom (si aplica)
- Pills, badges interactivos

**CUÁNDO NO USAR:**
- Botones primarios con color sólido (esos usan `surface/primary`)
- Controles donde el material no mejora la claridad

**Propiedades:**
- Material: Thin / Regular Material
- Blur: moderate
- Stroke: hairline para definición
- Hit target: mínimo 44x44pt

---

### Token: `glass/sheet`
**CUÁNDO USAR:**
- Sheets (bottom sheets, modal sheets)
- Popovers
- Modals con contenido
- Drawers

**CUÁNDO NO USAR:**
- Ventanas principales (esas usan `surface/base`)

**Propiedades:**
- Material: Regular / Thick Material
- Blur: system blur
- Corner radius: 12-16pt (según tamaño)
- Shadow: elevation-2 o elevation-3

---

### Token: `glass/overlay`
**CUÁNDO USAR:**
- Overlays flotantes
- Context menus
- Dropdown menus
- Tooltips (si usan material)
- Toasts/snackbars (si aplica)

**CUÁNDO NO USAR:**
- Overlays que necesitan alta opacidad para legibilidad

**Propiedades:**
- Material: Ultra Thin Material
- Blur: light
- Elevation: shadow-1 o shadow-2
- Backdrop: opcional scrim con 20-40% opacity

---

### Token: `surface/base | elevated | overlay`
**CUÁNDO USAR:**
- **surface/base:** Fondo principal de pantalla (opaco o semi-transparente según contexto)
- **surface/elevated:** Cards, containers elevados que necesitan estabilidad
- **surface/overlay:** Alternativa a glass cuando el fondo es muy ruidoso y necesitas garantizar legibilidad

**Propiedades:**
- Opacidad: 90-100% (no es vidrio puro)
- Fill: semantic color (background, secondaryBackground, etc.)
- Puede tener tint sutil si mejora jerarquía

---

### ❌ PROHIBICIÓN CRÍTICA
**NO usar `glass/*` sobre contenido como fondo de secciones por estética sin justificación funcional.**

**Ejemplo incorrecto:**
```
❌ Section background con glass/control "porque se ve cool"
```

**Ejemplo correcto:**
```
✅ Toolbar con glass/bar porque:
   1. Es navegación persistente
   2. El blur muestra contexto debajo
   3. Mantiene jerarquía sobre el contenido scroll
```

---

## 🎨 TOKEN PACK (SISTEMA COMPLETO)

### Colors (Semantic Tokens)

#### Text Colors
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `text/primary` | #000000 (100%) | #FFFFFF (100%) | Títulos, labels principales |
| `text/secondary` | rgba(0,0,0,0.6) | rgba(255,255,255,0.6) | Subtítulos, body text |
| `text/tertiary` | rgba(0,0,0,0.3) | rgba(255,255,255,0.3) | Placeholders, hints |
| `text/disabled` | rgba(0,0,0,0.25) | rgba(255,255,255,0.25) | Disabled states |
| `text/link` | #007AFF | #0A84FF | Links, acciones |
| `text/on-primary` | #FFFFFF | #FFFFFF | Text on brand primary |

#### Surface Colors
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `surface/base` | #FFFFFF | #000000 | Background principal |
| `surface/secondary` | #F2F2F7 | #1C1C1E | Secondary backgrounds |
| `surface/elevated` | #FFFFFF | #2C2C2E | Cards, elevated containers |
| `surface/overlay` | rgba(255,255,255,0.95) | rgba(28,28,30,0.95) | Overlays con estabilidad |
| `surface/primary` | #007AFF | #0A84FF | Brand primary surface |
| `surface/success` | #34C759 | #32D74B | Success states |
| `surface/warning` | #FF9500 | #FF9F0A | Warning states |
| `surface/error` | #FF3B30 | #FF453A | Error states |

#### Separator Colors
| Token | Light Mode | Dark Mode | Uso |
|-------|-----------|-----------|-----|
| `separator/default` | rgba(60,60,67,0.29) | rgba(84,84,88,0.65) | Dividers, borders |
| `separator/opaque` | #C6C6C8 | #38383A | Opaque separators |

#### Tint Colors
| Token | Uso |
|-------|-----|
| `tint/primary` | Brand primary tint |
| `tint/secondary` | Secondary actions |
| `tint/accent` | Accent highlights |

#### Feedback Colors
| Token | Uso |
|-------|-----|
| `feedback/info` | Informational states |
| `feedback/success` | Success confirmations |
| `feedback/warning` | Warning alerts |
| `feedback/error` | Error alerts |

---

### Typography Tokens

| Token | Font | Size | Weight | Line Height | Letter Spacing | Uso |
|-------|------|------|--------|-------------|----------------|-----|
| `type/largeTitle` | SF Pro Display | 34pt | Bold (700) | 41pt | 0.37pt | Large titles |
| `type/title1` | SF Pro Display | 28pt | Bold (700) | 34pt | 0.36pt | Page titles |
| `type/title2` | SF Pro Display | 22pt | Bold (700) | 28pt | 0.35pt | Section titles |
| `type/title3` | SF Pro Display | 20pt | Semibold (600) | 25pt | 0.38pt | Subsection titles |
| `type/headline` | SF Pro Text | 17pt | Semibold (600) | 22pt | -0.41pt | Headlines |
| `type/body` | SF Pro Text | 17pt | Regular (400) | 22pt | -0.41pt | Body text |
| `type/callout` | SF Pro Text | 16pt | Regular (400) | 21pt | -0.32pt | Callouts |
| `type/subheadline` | SF Pro Text | 15pt | Regular (400) | 20pt | -0.24pt | Subheadlines |
| `type/footnote` | SF Pro Text | 13pt | Regular (400) | 18pt | -0.08pt | Footnotes |
| `type/caption1` | SF Pro Text | 12pt | Regular (400) | 16pt | 0pt | Captions |
| `type/caption2` | SF Pro Text | 11pt | Regular (400) | 13pt | 0.06pt | Small captions |

**Dynamic Type:** Todos los tokens escalan con preferencias de accesibilidad.

---

### Spacing Tokens

| Token | Value | Uso |
|-------|-------|-----|
| `space/2xs` | 4pt | Tight spacing, icons |
| `space/xs` | 8pt | Compact spacing |
| `space/s` | 12pt | Small padding |
| `space/m` | 16pt | Standard spacing |
| `space/l` | 24pt | Large spacing |
| `space/xl` | 32pt | Extra large |
| `space/2xl` | 48pt | Section breaks |
| `space/3xl` | 64pt | Major sections |

**Safe Areas:**
- Top: 59pt (iPhone 15 Pro)
- Bottom: 34pt (iPhone 15 Pro)
- Horizontal margins: 16pt (standard)

---

### Radius Tokens

| Token | Value | Uso |
|-------|-------|-----|
| `radius/s` | 8pt | Small elements, chips |
| `radius/m` | 10pt | Buttons, inputs |
| `radius/l` | 12pt | Cards, containers |
| `radius/xl` | 16pt | Sheets, modals |
| `radius/pill` | 999pt | Pills, infinite radius |

---

### Stroke Tokens

| Token | Value | Uso |
|-------|-------|-----|
| `stroke/hairline` | 0.5pt | Subtle definition |
| `stroke/thin` | 1pt | Standard borders |
| `stroke/medium` | 1.5pt | Emphasis |
| `stroke/thick` | 2pt | Strong definition |

---

### Material Tokens (Liquid Glass)

| Token | Material Type | Blur | Vibrancy | Tint | Uso |
|-------|--------------|------|----------|------|-----|
| `glass/bar` | Ultra Thin | system | label | 2-5% | Navigation bars, toolbars |
| `glass/control` | Thin | moderate | label | opcional | Buttons, chips, controls |
| `glass/sheet` | Regular | system | label | opcional | Sheets, modals |
| `glass/overlay` | Ultra Thin | light | label | no | Menus, tooltips |

---

### Motion Tokens

| Token | Duration | Easing | Uso |
|-------|----------|--------|-----|
| `motion/instant` | 100ms | ease-out | Micro-interactions |
| `motion/fast` | 200ms | ease-in-out | Quick transitions |
| `motion/standard` | 300ms | ease-in-out | Standard animations |
| `motion/emphasis` | 400ms | spring | Emphasis transitions |
| `motion/morph` | 500ms | spring | Morphing transforms |

**Reduce Motion:** Todas las animaciones tienen fallback para `prefers-reduced-motion`.

---

## 🧩 COMPONENT LIBRARY

### GOLDEN SAMPLE: Glass Pill Button (NO NEGOCIABLE)

#### Especificación

**Variantes:**
- Primary (brand color fill + glass overlay)
- Secondary (glass/control with tint)
- Tertiary (minimal glass with label)

**Estados:**
- Default
- Pressed (scale 0.96 + brightness adjustment)
- Disabled (opacity 0.4)
- Loading (spinner + label opacity 0.6)

**Estructura por Capas:**

```
Glass Pill Button
├── L1: Material (glass/control o surface/primary si primary variant)
│   ├── Fill: glass material o solid color
│   └── Blur: moderate (si glass)
├── L2: Border/Lens
│   ├── Stroke: hairline (0.5pt)
│   ├── Color: separator/default con 50% opacity
│   └── Inner shadow: sutil para depth
├── L3: Content Container
│   ├── Padding: 12pt vertical, 20pt horizontal
│   ├── Min height: 44pt (hit target)
│   └── Content alignment: center
└── L4: Content (Text + Icon)
    ├── Label: type/body, text/primary o text/on-primary
    ├── Icon: SF Symbol 17pt (opcional)
    ├── Icon spacing: 8pt
    └── Text alignment: center
```

**Propiedades Computadas:**
```swift
// Primary
fill: surface/primary
text: text/on-primary
material: none (solid)

// Secondary
fill: glass/control
text: text/primary
material: Thin Material
tint: tint/primary (5% overlay)

// Tertiary
fill: glass/control
text: text/link
material: Ultra Thin Material
stroke: separator/default
```

**Reglas NO NEGOCIABLES:**
1. ✅ Se ve y lee bien sobre 3 fondos: claro, oscuro, foto
2. ✅ Hit target mínimo 44x44pt
3. ✅ Estados distinguibles SIN animación
4. ✅ No depender de color únicamente (accesibilidad)
5. ✅ Pressed state con feedback táctil claro

**QA Checklist:**
- [ ] Legible sobre fondo claro
- [ ] Legible sobre fondo oscuro
- [ ] Legible sobre imagen compleja
- [ ] Estados diferenciables
- [ ] Hit target ≥ 44x44pt
- [ ] Implementable con SwiftUI Button + material modifier

---

### Component: Glass Card Surface

#### Especificación

**Variantes:**
- Elevated (shadow + elevation)
- Overlay (floating, glass material)

**Estados:**
- Default
- Pressed (si interactiva)
- Disabled (si aplica)

**Estructura:**

```
Glass Card
├── L1: Container
│   ├── Material: glass/sheet (overlay) o surface/elevated (elevated)
│   ├── Corner radius: radius/l (12pt)
│   └── Padding: space/m (16pt)
├── L2: Shadow/Elevation
│   ├── Shadow: elevation-2 (0px 2px 8px rgba(0,0,0,0.12))
│   └── Border: hairline (opcional para definition)
└── L3: Content Slot
    └── Acepta cualquier contenido (text, images, buttons)
```

**Reglas:**
1. ✅ Soporta contenido, no compite con él
2. ✅ Padding consistente (16pt estándar)
3. ✅ Corner radius según tamaño (12pt base)
4. ✅ Shadow sutil, no dramático

---

### Component: List Cell (iOS-native)

#### Especificación

**Estructura:**

```
List Cell
├── L1: Container
│   ├── Height: 44pt (compact), 56pt (comfortable), 72pt (spacious)
│   └── Background: surface/base (transparent) o surface/elevated
├── L2: Content
│   ├── Leading: Icon/Avatar (28-40pt)
│   ├── Title: type/body, text/primary
│   ├── Subtitle: type/footnote, text/secondary (opcional)
│   └── Trailing: Chevron / Action button / Switch
├── L3: Separator
│   ├── Position: bottom, inset 16pt from leading
│   ├── Color: separator/default
│   └── Height: hairline (0.5pt)
└── L4: States
    ├── Default: transparent background
    ├── Pressed: surface/secondary (10% overlay)
    └── Selected: tint/primary (5% overlay) + checkmark
```

**Densidades:**
- Compact: 44pt (solo título)
- Comfortable: 56pt (título + subtítulo corto)
- Spacious: 72pt (título + subtítulo + metadata)

---

### Component: Navigation (Top Bar + Tab Bar)

#### Top Bar (glass/bar)

```
Top Bar
├── L1: Material
│   ├── Material: glass/bar (Ultra Thin)
│   ├── Height: 44pt + safe area top (59pt = 103pt total iPhone 15 Pro)
│   └── Blur: system blur
├── L2: Content
│   ├── Title: type/headline, center or leading aligned
│   ├── Leading: Back button / Cancel
│   ├── Trailing: Action buttons (max 2)
│   └── Padding: space/m horizontal
└── L3: Border
    └── Bottom separator: hairline, separator/default
```

#### Tab Bar (glass/bar)

```
Tab Bar
├── L1: Material
│   ├── Material: glass/bar (Ultra Thin)
│   ├── Height: 49pt + safe area bottom (34pt = 83pt total)
│   └── Blur: system blur
├── L2: Items (3-5 tabs)
│   ├── Icon: SF Symbol 24pt
│   ├── Label: type/caption2
│   ├── Spacing: equal distribution
│   └── Hit target: 44x44pt minimum
├── L3: States
│   ├── Default: text/tertiary
│   ├── Selected: tint/primary (icon + label)
│   └── Pressed: scale 0.9 + brightness
└── L4: Border
    └── Top separator: hairline, separator/default
```

---

### Component: Sheet (glass/sheet)

```
Sheet
├── L1: Material
│   ├── Material: glass/sheet (Regular Material)
│   ├── Corner radius: radius/xl (16pt top corners)
│   ├── Min height: 200pt
│   └── Max height: 90% screen height
├── L2: Handle (Grabber)
│   ├── Width: 36pt
│   ├── Height: 5pt
│   ├── Color: separator/default
│   ├── Corner radius: pill
│   └── Position: center top, 8pt from top
├── L3: Content
│   ├── Padding: space/l (24pt horizontal, 16pt vertical)
│   ├── Scroll: if content exceeds height
│   └── Safe area: bottom padding 34pt
└── L4: Presentation
    ├── Backdrop: scrim 40% opacity
    ├── Detents: medium / large
    └── Dismissal: swipe down or tap backdrop
```

---

## 📐 MVP DE VALIDACIÓN

### Pantalla de Ejemplo: Home Dashboard

**Composición obligatoria:**

1. **Top Navigation Bar** (glass/bar)
   - Title: "Dashboard"
   - Leading: Menu icon button
   - Trailing: Notifications icon button

2. **Hero Card** (glass/sheet variant: elevated)
   - Material: surface/elevated (estable, no pure glass porque tiene contenido crítico)
   - Content: Title + Metric + Trend chart
   - Action: Primary glass pill button

3. **List Section** (3 items)
   - Header: type/headline, "Recent Activity"
   - Cells: iOS-native list cells con leading icon + title/subtitle + trailing chevron
   - Separators: hairline, separator/default

4. **Bottom Action** (glass/control)
   - Glass pill button (secondary variant)
   - Label: "View All"
   - Floating above tab bar (optional)

5. **Tab Bar** (glass/bar)
   - 4 tabs: Home / Explore / Activity / Profile
   - Current: Home (selected state)

**Light y Dark obligatorios:**
- Entregar 2 frames: Light mode + Dark mode
- Validar que todos los componentes usan tokens
- Verificar legibilidad en ambos modos

---

## ✅ RÚBRICA QA (PASS/FAIL OBLIGATORIA)

### Para cada deliverable (Golden Sample + MVP)

| Criterio | Test | PASS Condition | FAIL Condition |
|----------|------|----------------|----------------|
| **Consistencia** | ¿Todo usa tokens? | Todos los valores son tokens documentados | Hay valores "sueltos" sin token |
| **Jerarquía** | ¿Contenido es protagonista? | Contenido claro, glass soporta | Glass domina visualmente |
| **Legibilidad** | ¿Legible sobre fondos complejos? | Legible en 3 fondos test | Depende de "suerte del fondo" |
| **Estados** | ¿pressed/disabled/loading claros? | Estados distinguibles sin animación | Estados no se distinguen |
| **Material semántico** | ¿glass/bar solo en navegación? | Materiales usados según mapeo | glass usado como fondo sin motivo |
| **Implementabilidad** | ¿Se puede construir estándar? | 80%+ componentes nativos | Todo custom sin justificación |
| **Documentación** | ¿Reglas de uso especificadas? | Cada token tiene "cuándo usar" | Sin documentación de uso |
| **Accesibilidad** | ¿Cumple hit targets y contraste? | Hit ≥44pt, contraste ≥4.5:1 | Falla hit targets o contraste |

**Proceso:**
1. Evaluar cada criterio
2. Si alguno es FAIL → detener y corregir
3. No avanzar hasta que todos sean PASS
4. Documentar correcciones aplicadas

---

## 🔄 PLAN DE TRABAJO ESTÁNDAR (NO OMITIR)

### Fase 1: Auditoría (si hay archivo existente)
- [ ] Inventario de pantallas y componentes actuales
- [ ] Identificar problemas principales:
  - ¿Uso inconsistente de materiales?
  - ¿Legibilidad comprometida?
  - ¿Falta de estados?
- [ ] Documentar findings (tabla con issue + severidad)

### Fase 2: Definir Sistema
- [ ] Confirmar entradas (tipo app, journeys, brand, plataforma)
- [ ] Establecer tokens:
  - Colors semánticos (light/dark)
  - Typography scale
  - Spacing scale
  - Radius + stroke + motion
  - Material tokens con mapeo de uso
- [ ] Documentar "cuándo NO usar glass"

### Fase 3: Golden Sample
- [ ] Construir Glass Pill Button (3 variants, 4 states)
- [ ] Validar sobre 3 fondos (claro, oscuro, foto)
- [ ] QA PASS/FAIL
- [ ] **SI FALLA: No avanzar hasta PASS**

### Fase 4: Librería Base
- [ ] Glass Card Surface (2 variants)
- [ ] List Cell (3 densities)
- [ ] Navigation (Top Bar + Tab Bar)
- [ ] Sheet base
- [ ] Cada componente: QA individual

### Fase 5: MVP
- [ ] Diseñar pantalla de validación (Home Dashboard)
- [ ] Usar SOLO tokens y componentes creados
- [ ] Light + Dark modes
- [ ] QA completa PASS/FAIL

### Fase 6: Entrega
- [ ] SKILL_SPEC (1-2 páginas)
- [ ] TOKEN PACK (tabla completa)
- [ ] COMPONENT LIBRARY (detalles + specs)
- [ ] MVP (descripción + composición)
- [ ] QA REPORT (tabla PASS/FAIL + correcciones)

---

## 📦 FORMATO DE RESPUESTA

Entregar en este orden:

### 1. SKILL_SPEC (Resumen Ejecutivo)
- Principios → Reglas
- Mapeo de materiales (cuándo usar / cuándo NO usar)
- Lista de componentes
- Rúbrica QA

### 2. TOKEN PACK
- Tabla con todos los tokens
- Columna "Cuándo usar" para cada token
- Valores light/dark donde aplique

### 3. COMPONENT LIBRARY
- Golden Sample (especificación completa + estructura por capas)
- Glass Card
- List Cell
- Navigation (Top + Tab)
- Sheet
- Specs detalladas con dimensiones exactas

### 4. MVP (Pantalla de Validación)
- Descripción de composición
- Lista de componentes usados
- Screenshot o mockup (light + dark)
- Anotaciones de tokens aplicados

### 5. QA REPORT
- Tabla PASS/FAIL con resultados
- Lista de correcciones aplicadas
- Sign-off: "Golden Sample PASS" o "Requiere iteración"

---

## 🚫 RESTRICCIÓN CRÍTICA

**No uses "Liquid Glass" como maquillaje.**

Si el material no aporta:
- Claridad funcional
- Jerarquía visual
- Contexto (blur mostrando contenido debajo)

**Entonces se elimina.**

---

## 🎯 OBJETIVO DE EXCELENCIA

El resultado debe:
1. Parecer **nativo iOS 26** (no diseño "inspirado en iOS")
2. Ser **sobrio y preciso** (no decorativo)
3. Ser **implementable** (80%+ componentes estándar SwiftUI/UIKit)
4. Tener **consistencia de sistema** (todos los valores son tokens)

**Si el Golden Sample no es impecable, el skill se considera NO LISTO.**

---

## 🔧 HERRAMIENTAS Y REFERENCIAS

### Sketch (si aplica)
- Librería iOS 26 oficial de Apple
- SF Symbols plugin
- Material effects natives

### Figma (si aplica)
- iOS 26 UI Kit community
- Variables para tokens
- Auto-layout para componentes

### Validación
- Contrast Checker (mínimo 4.5:1 para texto)
- SF Symbols app (para iconos)
- iOS Simulator (para validar en device real)

---

## 📚 KNOWLEDGE BASE

### Material Usage Examples

**✅ CORRECTO:**
```
Top Navigation Bar → glass/bar
Razón: Es navegación persistente, el blur muestra scroll debajo, mantiene jerarquía
```

```
Action Button secundario → glass/control
Razón: El material diferencia de primary button (solid), mantiene coherencia con sistema
```

```
Sheet Modal → glass/sheet
Razón: Contexto modal, el blur muestra contenido debajo, separación clara del base layer
```

**❌ INCORRECTO:**
```
Section Background → glass/control
Razón: No es control, no aporta función, compite con contenido
Corrección: Usar surface/base o surface/secondary
```

```
Card de Contenido → glass/overlay
Razón: Contenido principal necesita estabilidad, no blur
Corrección: Usar surface/elevated con opacidad completa
```

---

## 🎓 ACTIVACIÓN DEL SKILL

**Para usar este skill:**

```bash
# Desde Claude Code CLI:
/ios26-liquid-glass-designer

# O invocación directa:
"Necesito diseñar un sistema iOS 26 Liquid Glass para [tipo de app]"
```

**El skill:**
1. Hará máximo 5 preguntas de contexto
2. Generará sistema de tokens completo
3. Construirá Golden Sample perfecto
4. Creará librería de componentes base
5. Validará con MVP
6. Ejecutará QA PASS/FAIL
7. Entregará documentación completa

**Criterio de éxito:** Golden Sample PASS en primera iteración QA.

---

**Versión:** 1.0
**Última actualización:** 2026-01-04
**Mantenedor:** ECO-Lambda (Λ)
