# 🔧 SOLARIA MCP REFACTORING REQUEST - SKETCH PATTERN ANALYSIS

## 📋 CONTEXTO DEL PROBLEMA

**Situación Actual:**
- Tenemos un servidor MCP (en producción/uso) que presenta errores sistemáticos
- El MCP tiene DEMASIADAS herramientas (sobrecarga de endpoints)
- Tenemos problemas tanto en la API como en la implementación MCP
- Necesitamos evaluar si el patrón de diseño de Sketch MCP puede resolver estos problemas

## 🎯 OBJETIVO DE ESTE PROMPT

Analizar la investigación sobre el **Sketch MCP Server** y proponer un **plan de refactoring** para nuestro MCP actual que:
1. Reduzca drásticamente el número de herramientas/endpoints
2. Implemente un endpoint `run_code` o equivalente
3. Resuelva los errores sistemáticos en API y MCP
4. Mantenga funcionalidad completa con menor complejidad

---

## 📊 INVESTIGACIÓN COMPLETA: SKETCH MCP SERVER

### Arquitectura Minimalista (2 Endpoints)

Sketch MCP oficial tiene SOLO **2 tools**:

#### **1. `get_selection_as_image`**
- **Propósito:** Captura visual del estado actual en Sketch
- **Uso:** La AI analiza visualmente el diseño seleccionado
- **Consumo de tokens:** ~200 tokens (definición muy pequeña)

#### **2. `run_code` ⭐ EL SECRETO**
- **Propósito:** Ejecuta código JavaScript/SketchAPI directamente
- **Capacidades:**
  - Acceso COMPLETO a SketchAPI (como un plugin nativo)
  - Loops, condicionales, manejo de errores
  - Iteración automática si el código falla
  - Cualquier operación compleja en un solo script
- **Consumo de tokens:** ~300 tokens (definición compacta)

### Comparación de Eficiencia

| Métrica | MCP Tradicional (50+ tools) | Sketch MCP (2 tools) | Ahorro |
|-----------|-------------------------------|------------------------|---------|
| Definiciones de tools | 25,000 tokens | 500 tokens | **98%** |
| Operaciones complejas | 10+ llamadas tool | 1 script ejecutado | **90%+** |
| Contexto intermedio | Todo pasa por modelo | Filtrado en código | **95%** |
| Caso real documentado | 150,000 tokens | 2,000 tokens | **98.7%** |

### ¿Por qué `run_code` es brillante?

**El problema de MCP tradicional:**
```typescript
// 50 tools separadas = 50 definiciones = sobrecarga masiva
- createLayer()
- deleteLayer()
- moveLayer()
- setColor()
- setBorder()
- addShadow()
- duplicateLayer()
- ... y 43 más ❌
```

**La solución de Sketch:**
```javascript
// run_code = "universal tool"
run_code(`
  const selection = sketch.getSelectedDocument().selectedLayers;

  // Operación 1: Crear
  const rect = new Rectangle();
  rect.frame = new Rectangle(0, 0, 100, 100);

  // Operación 2: Modificar estilos
  rect.style = {
    fills: ['#ff0000'],
    borders: ['#000000'],
    borderWidth: 2,
    shadows: [{blur: 10, color: '#000000', offsetX: 0, offsetY: 5}]
  };

  // Operación 3: Agrupar
  const group = new Group([rect]);

  // Operación 4: Loop
  for (let i = 0; i < 5; i++) {
    const duplicate = group.duplicate();
    duplicate.frame.x += 120;
  }

  // Operación 5: Manejo de errores
  if (group.frame.width > 600) {
    throw new Error('Elemento demasiado ancho');
  }

  // Operación 6: Exportar
  group.export('~/Desktop/output.svg', 'svg');
`)
```

### Patrones de Eficiencia Implementados

**1. Composición en lugar de encadenamiento:**
```javascript
// ❌ MCP tradicional: 5 llamadas tool encadenadas
tool: createRectangle({...})
tool: setColor({...})
tool: setBorder({...})
tool: addShadow({...})
tool: addToSelection({...})

// ✅ Sketch MCP: 1 script con composición
run_code(`// Todas las operaciones en un solo script`)
```

**2. Filtrado antes del modelo:**
```javascript
// ❌ MCP tradicional: 10,000 filas → modelo filtra (costoso)
tool: getData() → 10,000 filas en contexto

// ✅ Sketch MCP: filtra en código
run_code(`
  const allData = await getData();
  const filtered = allData.filter(row => row.status === 'pending');
  console.log(filtered.length);  // Solo resultado al modelo
`)
```

**3. Iteración automática:**
```javascript
// La AI puede reintentar automáticamente sin intervención
run_code(`
  try {
    const result = await riskyOperation();
    return {success: true, data: result};
  } catch (error) {
    console.log('Reintentando con parámetros más seguros...');
    const result = await saferOperation();
    return {success: true, data: result};
  }
`)
```

### Uso del endpoint `run_code` (ejemplos reales de Sketch)

1. **"Export all icons prefixed with 'icon/' as SVGs to Desktop"**
   ```javascript
   run_code(`
     const doc = sketch.getSelectedDocument();
     const iconSymbols = doc.symbols.filter(s => s.name.startsWith('icon/'));

     iconSymbols.forEach(symbol => {
       const exportPath = `~/Desktop/${symbol.name}.svg`;
       symbol.export(exportPath, 'svg');
     });

     console.log(`Exported ${iconSymbols.length} icons`);
   `)
   ```

2. **"Find symbol masters without instances"**
   ```javascript
   run_code(`
     const doc = sketch.getSelectedDocument();
     const unusedSymbols = doc.symbols.filter(symbol => {
       return !doc.pages.some(page =>
         page.layers.some(layer =>
           layer.symbolId === symbol.id
         )
       );
     });

     console.log(unusedSymbols.map(s => s.name).join(', '));
   `)
   ```

3. **"Create vertical stack of 4 rectangles with unique gradients"**
   ```javascript
   run_code(`
     const gradients = [
       ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
     ];

     const stack = gradients.map((color, i) => {
       const rect = new Rectangle(0, i * 110, 100, 100);
       rect.fills = [{type: 'gradient', stops: [{color, position: 0}, {color: '#ffffff', position: 1}]}];
       return rect;
     });

     const group = new Group(stack);
     sketch.getSelectedDocument().selectedPage.layers.push(group);
   `)
   ```

4. **"Replace every text layer with random Apple product names"**
   ```javascript
   run_code(`
     const products = ['iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods', 'Mac'];
     const doc = sketch.getSelectedDocument();

     doc.pages.forEach(page => {
       page.layers.forEach(layer => {
         if (layer.type === 'text') {
           layer.text = products[Math.floor(Math.random() * products.length)];
         }
       });
     });
   `)
   ```

### Seguridad del diseño Sketch

**Local-only server:**
```
Server: localhost:31126
├─ No acceso remoto (no expone API externamente)
├─ Sandbox macOS nativo
└─ Usuario supervisa cada ejecución
```

**Supervisión:**
- Usuario puede ver el código antes de ejecutar
- El modelo puede pedir confirmación
- Feedback visual en tiempo real

---

## 🚨 NUESTRO PROBLEMA ACTUAL

**Errores sistemáticos que tenemos:**
1. ❌ Demasiadas herramientas/endpoints en el MCP
2. ❌ Errores en la API subyacente
3. ❌ Probablemente sobrecarga de contexto en cada request
4. ❌ Composición compleja (muchas herramientas pequeñas vs pocas poderosas)
5. ❌ Posibles problemas de coordinación entre tools

**Impacto probable:**
- Consumo de tokens excesivo
- Latencia alta (múltiples llamadas encadenadas)
- Errores por falta de coordinación entre tools
- Mantenimiento difícil (50+ tools para actualizar)

---

## 💡 TU TAREA: ANÁLISIS Y PLAN DE REFACTORING

Por favor, realiza las siguientes tareas:

### 1. Analiza nuestro MCP actual
- Revisa el código fuente de nuestro MCP
- Identifica todas las herramientas/endpoints actuales
- Categoriza las herramientas por funcionalidad
- Detecta patrones de redundancia

### 2. Diagnostica los errores sistemáticos
- Identifica causas raíz de errores en la API
- Relaciona errores con arquitectura actual de tools
- Determina qué errores se resolverían con `run_code`

### 3. Diseña el nuevo MCP minimalista
Propón una arquitectura basada en el patrón Sketch:

**Endpoints mínimos:**
```
{
  tools: [
    {
      name: "get_context",
      description: "Obtiene el estado/contexto actual del sistema",
      parameters: {...}
    },
    {
      name: "run_code",
      description: "Ejecuta código arbitrario en el contexto del sistema",
      parameters: {
        code: "string (código a ejecutar)",
        language: "string (opcional, ej: python, javascript, typescript)"
      }
    }
  ]
}
```

**Migración de funcionalidad:**
- Agrupa tools relacionadas en funciones reutilizables dentro de `run_code`
- Mantiene acceso completo a la API subyacente
- Reduce definiciones de 50+ a 2

### 4. Plan de implementación
Propón pasos específicos para:

**Fase 1: Preparación**
- Backup del MCP actual
- Identificación de dependencias críticas
- Documentación de comportamiento actual

**Fase 2: Implementación**
- Creación del nuevo endpoint `run_code`
- Implementación de sandbox seguro
- Migración de funcionalidad crítica a scripts ejecutables

**Fase 3: Pruebas**
- Validación de funcionalidad equivalente
- Tests de casos edge
- Benchmark de token consumption

**Fase 4: Deploy**
- Rollback plan si algo falla
- Migration gradual (dual operation?)
- Monitoreo post-deploy

### 5. Análisis de riesgos y mitigaciones

**Riesgos:**
- Seguridad (ejecución de código arbitrario)
- Breaking changes para clientes existentes
- Complejidad de implementar sandbox

**Mitigaciones:**
- Validación de código antes de ejecución
- Auditoría de sandbox
- Periodo de transición con ambos MCPs
- Documentación exhaustiva de cambios

### 6. Métricas de éxito

Define cómo mediremos que el refactoring tuvo éxito:

**Métricas técnicas:**
```
- [ ] Reducción de tools ≥ 90%
- [ ] Tokens por request ≤ 20% del actual
- [ ] Latencia ≥ 50% más rápida
- [ ] Cobertura funcionalidad 100%
- [ ] Errores API: 0
```

**Métricas de negocio:**
```
- [ ] Costo de operación mensual ↓
- [ ] Tiempo de desarrollo nuevo features ↓
- [ ] Mantenimiento ↓
- [ ] Satisfacción de usuarios ↑
```

---

## 📋 DELIVERABLES ESPERADOS

Por favor, entrega:

1. **Análisis detallado** de nuestro MCP actual (diagrama de arquitectura)
2. **Diagnóstico de errores** con causas raíz
3. **Propuesta de nuevo diseño** minimalista (2 endpoints)
4. **Plan de implementación** paso a paso (Fases 1-4)
5. **Código de ejemplo** del nuevo `run_code` endpoint
6. **Matriz de migración** (old tools → nuevos scripts)
7. **Análisis de riesgos** con mitigaciones
8. **Criterios de éxito** medibles

---

## 🎯 CONTEXT ADICIONAL

**Nuestro stack:**
- Backend: Node.js / TypeScript
- MCP Framework: [ESPECIFICAR SI ES SDK OFICIAL O CUSTOM]
- Integraciones: [LISTAR SI APLICA]
- Clientes que consumen el MCP: [LISTAR]

**Documentación relevante:**
- [Enlace a repo o código del MCP actual]
- [Enlaces a documentación de errores]
- [Cualquier diagrama existente]

---

## ⚠️ CRITICAL REQUIREMENT

**IMPORTANTE:** Tu análisis debe ser ESTRATÉGICO, no solo técnico.

No solo necesito que me digas "cambien las tools". Necesito:
1. Entender POR QUÉ la arquitectura actual falla
2. COMPROBAR que el patrón Sketch aplica a nuestro caso
3. PROPONER una transición viable (sin breaking catastrofico)
4. CUANTIFICAR beneficios esperados
5. IDENTIFICAR riesgos y cómo mitigarlos

**Pregunta clave:** ¿El patrón `run_code` de Sketch es viable para nuestro sistema? Si no, ¿por qué y qué alternativa propondrías?

---

Fin del prompt. Por favor procede con el análisis completo.
