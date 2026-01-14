# WORLD-CLASS DESIGN SPECS: iOS 26 Liquid Glass
**Protocolo:** RALPH-WIGGUM-QA
**Estado:** ACTIVO

## 1. Layout & Grid (La Regla de Hierro)
- [ ] **Grid Base:** Todo debe ser múltiplo de 8pt.
- [ ] **Márgenes Laterales:** Mínimo 24pt en contenedores "Glass".
- [ ] **Safe Areas:** Respetar 59pt (Top) y 34pt (Bottom).
- [ ] **Alineación Interna:** Los elementos dentro de un Sheet deben tener padding interno de 24pt. NADA debe tocar los bordes.
- [ ] **Hit Targets:** Botones e Inputs mínimo 44pt de alto (Preferible 52pt para énfasis).

## 2. Componentes (Anatomía Perfecta)
- [ ] **Inputs:**
    - Altura fija: 52pt.
    - Corner Radius: 16pt.
    - Padding Texto: 16pt desde la izquierda.
    - Color: `rgba(0,0,0,0.05)` (Ultra Subtle).
- [ ] **Botones:**
    - Altura fija: 52pt.
    - Corner Radius: 26pt (Pill completa).
    - Tipografía: SF Pro Text, Semibold, 17pt.
- [ ] **Glass Sheet:**
    - Corner Radius: 32pt.
    - Stroke: 1pt Interior, `rgba(255,255,255, 0.3)` a `1.0`.
    - Shadow: Difusa, `Y: 20`, `Blur: 40`.

## 3. Jerarquía Visual
- [ ] **Títulos:** SF Pro Display, Bold, 34pt. Centrados.
- [ ] **Subtítulos/Labels:** SF Pro Text, Regular, 17pt.
- [ ] **Espaciado Vertical:** Título -> Input (40pt+), Input -> Input (16pt).

## 4. Validación Técnica (The Ralph Check)
- [ ] **Coordenadas Relativas:** Al usar Grupos, las coordenadas X/Y de los hijos deben ser RELATIVAS al padre (0,0), no absolutas al Artboard. **(Aquí falló la v3)**.
- [ ] **Grouping:** Cada componente lógico (Input, Botón) debe ser un `sketch.Group`.
