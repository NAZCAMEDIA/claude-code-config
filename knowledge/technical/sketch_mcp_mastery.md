---
id: sketch-mcp-mastery
title: "Sketch MCP & Programmatic Design: The Ralph Wiggum Protocol"
date: 2026-01-11
author: ECO-Lambda
tags: [sketch, mcp, ios26, javascript, debugging, ralph-wiggum, liquid-glass]
status: stable
linked_specs: [[ios26-liquid-glass-specs]]
---

# Sketch MCP & Programmatic Design Mastery

Este documento compila los hallazgos críticos para la automatización de diseño en Sketch mediante MCP (Model Context Protocol), específicamente para el sistema iOS 26 Liquid Glass.

## 1. Protocolo de Conexión (The Handshake)

**Problema:** Error `400 Bad Request` al intentar invocar herramientas.
**Causa:** El servidor MCP de Sketch es estricto y rechaza peticiones sin headers específicos.
**Solución:**
Siempre incluir `Accept: application/json`.

```python
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json" # CRÍTICO: Sin esto falla
}
```

## 2. Sistema de Coordenadas (The Relativity Trap)

**Principio:** En la API JS de Sketch, las coordenadas son **RELATIVAS AL PADRE**.

*   **Anti-Pattern (Doble Margen):**
    ```javascript
    const sheetX = 24;
    const group = new sketch.Group({ frame: { x: sheetX, ... } });
    // ERROR: Si pones x: sheetX aquí, se sumará al x del padre
    const child = new ShapePath({ frame: { x: sheetX, ... }, parent: group });
    // Resultado Real X = 24 + 24 = 48 (Desalineado)
    ```

*   **Golden Rule:**
    Si el elemento está dentro de un Grupo/Sheet que ya tiene margen, el elemento hijo debe tener `x: 0` (o el padding interno deseado, ej. `x: 24`).

## 3. Dimensionamiento de Grupos (The Explicit Frame)

**Problema:** Sketch crea grupos con tamaño 100x100 o ajustado al contenido erráticamente si no se especifica.
**Solución:** Siempre definir el `frame` explícito en el constructor del Grupo.

```javascript
// ✅ CORRECTO
const group = new sketch.Group({
    name: "InputContainer",
    parent: parent,
    frame: { x: 24, y: 100, width: 297, height: 52 } // Definir límites físicos
});
```

## 4. El Protocolo "Ralph Wiggum" (Iterative QA)

Nunca asumir que el código genera el visual correcto. Validar geométricamente.
Ver detalles en [[ios26-liquid-glass-specs]].

**Workflow:**
1.  **Generate:** Ejecutar script de creación.
2.  **Inspect:** El script DEBE retornar un JSON con las coordenadas finales de los objetos creados.
3.  **Assert:** El Agente debe leer ese JSON y comparar `actualWidth` vs `expectedWidth`.

```javascript
// Al final del script Sketch
console.log(JSON.stringify({
    element: "LoginInput",
    x: layer.frame.x,     // Debe ser 24 (Padding interno)
    width: layer.frame.width // Debe ser 297 (345 - 24 - 24)
}));
```

## 5. Liquid Glass Implementation

Para lograr el efecto iOS 26 Liquid Glass programáticamente:

*   **Blur:** Usar `sketch.Style.BlurType.Gaussian` para elementos decorativos (Blobs) y `BlurType.Background` para Sheets.
*   **Advertencia:** Asignar `style: { blur: {...} }` en el constructor suele fallar silenciosamente o con warnings.
*   **Mejor Práctica:** Crear capa -> Asignar propiedades simples -> Aplicar blur post-creación si es complejo.

## 6. Snippets Verificados

### Centered Button (SVG + Text)
Ver implementación en `create_auth_final_ralph.js`. Clave: Calcular el ancho total (`icon + gap + text`) y restar del ancho del botón dividido por 2 para encontrar el `startX`.

---
**Indexado por:** ECO-Lambda
**Versión:** 1.0