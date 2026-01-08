# Ralph-Wiggum Plugin - Autonomous Iterative Development Loop

**Plugin Oficial de Anthropic para Claude Code**

## Overview

Ralph-Wiggum es un plugin de Anthropic que implementa bucles iterativos autónomos. Claude trabaja automáticamente en la misma tarea, viendo su trabajo anterior, hasta cumplir el criterio de terminación especificado.

```
┌─────────────────────────────────────┐
│   /ralph-loop "criterio"            │
└────────────┬────────────────────────┘
             │
             ▼
      ┌──────────────┐
      │   Analizar   │
      └──────┬───────┘
             │
             ▼
      ┌──────────────┐
      │  Generar     │
      │  Cambios     │
      └──────┬───────┘
             │
             ▼
      ┌──────────────┐
      │  Validar     │
      └──────┬───────┘
             │
             ▼
      ┌──────────────────────────┐
      │ ¿Criterio cumplido?      │
      └──────┬──────────────┬────┘
             │ SÍ           │ NO
             │              └─────────────┐
             │                            │
             ▼                            ▼
        ✅ DONE                    (Siguiente iteración)
```

---

## Instalación

✅ **Ya instalado y habilitado** en esta configuración

```json
{
  "enabledPlugins": {
    "ralph-wiggum@anthropics-claude-plugins-official": true
  },
  "extraKnownMarketplaces": {
    "anthropics-claude-plugins-official": {
      "source": {
        "source": "github",
        "repo": "anthropics/claude-plugins-official"
      }
    }
  }
}
```

### Aplicar configuración

```bash
cd /Users/carlosjperez/Documents/GitHub/claude-code-config
./sync-config.sh
# Luego reinicia Claude Code
```

---

## Uso

### Comando Principal

```bash
/ralph-loop [criterio de terminación]
```

**Parámetros:**
- `criterio`: Descripción clara del objetivo y cómo validar que está completo

### Cancelar Loop

```bash
/cancel-ralph
```

---

## Ejemplos

### 1. Implementar Feature Completa

```
/ralph-loop "Implementar autenticación JWT en el backend.
Criterio:
- Endpoint POST /auth/login funcional
- Tests unitarios pasando (>80% coverage)
- Documentación de API completa
- Sin secrets en logs"
```

**Resultado:**
- Ralph itera implementando, testeando, ajustando
- Se detiene cuando todos los criterios se cumplen
- Resume el trabajo realizado

### 2. Optimizar Performance

```
/ralph-loop "Mejorar tiempo de carga del dashboard.
Criterio:
- Lighthouse score >=90
- First Contentful Paint <1.5s
- No console errors o warnings"
```

**Resultado:**
- Identifica bottlenecks
- Aplica optimizaciones (code splitting, lazy loading, etc.)
- Mide y valida cada iteración
- Para cuando métrica objetivo se alcanza

### 3. Completar Tarea DFO

```
/ralph-loop "Completar DFO-547 - Formulario Contacto.
Criterio:
- Todos los tests verdes
- Validación Zod implementada
- Honeypot field configurado
- PR lista para merge
- Documentación actualizada"
```

**Resultado:**
- Toma DFO context
- Implementa todas las subtareas
- Se detiene al cumplir todos los criterios

### 4. Debugging y Fixing

```
/ralph-loop "Resolver bug de autenticación en producción.
Criterio:
- Issue reproducible en local
- Root cause identificado y documentado
- Fix implementado
- Tests pasen
- PR con fix submiteada"
```

---

## Criterios Efectivos

✅ **Buen criterio (específico, medible):**
```
"Implementar login. Criterios:
- 2 endpoints (POST /login, POST /logout)
- JWT tokens con 24h expiry
- Refresh tokens con 7d expiry
- Unit tests: 100% coverage en auth.service.ts
- Integration tests: end-to-end login flow"
```

❌ **Mal criterio (vago, ambiguo):**
```
"Hacer login mejor"
```

---

## Cómo Ralph Trabaja

1. **Inicialización**
   - Parsea el criterio
   - Carga contexto previo (archivos, memoria DFO)
   - Configura métricas de validación

2. **Iteración (repite hasta éxito)**
   - Analiza estado actual
   - Genera cambios/mejoras
   - Ejecuta cambios
   - Valida contra criterios
   - Si incompleto → siguiente iteración

3. **Terminación**
   - Verifica todos los criterios cumplidos
   - Reporta resumen (iteraciones, tokens, tiempo)
   - Limpia estado

---

## Integración con DFO

Ralph puede trabajar con tareas DFO:

```
/ralph-loop "Completar DFO-547.
Usar set_project_context({ project_id: 1 }).
Criterio: complete_task({ task_id: 547 }) exitoso"
```

Ralph automáticamente:
- Carga contexto de la tarea
- Actualiza subtareas conforme progresa
- Guarda memoria de decisiones
- Marca tarea como completa

---

## Output y Reportes

Después de cada `/ralph-loop`, Ralph muestra:

```
═══════════════════════════════════════
   🎯 RALPH LOOP SUMMARY
═══════════════════════════════════════

Criterio:     "Implementar JWT..."
Status:       ✅ COMPLETADO

Iteraciones:  4
Tokens:       45,230 / 200,000 (22.6%)
Tiempo:       12m 34s

Cambios realizados:
  ✓ auth.service.ts
  ✓ auth.controller.ts
  ✓ auth.module.ts
  ✓ auth.test.ts

Validaciones:
  ✓ Tests: 45/45 passing
  ✓ Lint: 0 warnings
  ✓ Coverage: 92% (target: 80%)
  ✓ Security: No secrets in logs

═══════════════════════════════════════
```

---

## Best Practices

### ✅ DO

1. **Criterios claros y medibles**
   ```
   /ralph-loop "Tests >80% coverage, Lighthouse >90"
   ```

2. **Chequear output entre iteraciones**
   - Ralph mostrará progreso
   - Puedes ver qué cambios hace

3. **Usar con DFO context**
   ```
   /ralph-loop "set_project_context(). Completar DFO-123"
   ```

4. **Cancelar si algo sale mal**
   ```
   /cancel-ralph
   ```

### ❌ DON'T

1. ❌ Criterios vagos
   ```
   /ralph-loop "Mejorar el código"
   ```

2. ❌ Criterios imposibles de validar
   ```
   /ralph-loop "Hacer que sea bonito"
   ```

3. ❌ Múltiples tareas disjuntas en un loop
   ```
   /ralph-loop "Implementar auth, DB schema, y UI al mismo tiempo"
   ```
   **Mejor:** 3 loops separados

4. ❌ No revisar output
   - Ralph es autónomo pero necesita supervisión
   - Revisa cambios entre iteraciones

---

## Troubleshooting

### Ralph se congela o no avanza

```bash
/cancel-ralph
```

Luego analiza qué salió mal y reinicia con criterios más específicos.

### Demasiadas iteraciones sin converger

**Causa:** Criterios ambiguo o contradictorio

**Solución:**
```
/cancel-ralph

# Reinicia con criterio más específico
/ralph-loop "Criterio simplificado..."
```

### Se acabaron tokens

Ralph reportará cuando no haya suficientes tokens.

**Solución:** Espera, o particiona tarea en Ralph loops más pequeños.

---

## Combinación: Ralph + TodoWrite

Para máximo control:

```bash
# 1. Crea plan con TodoWrite
# (marca tareas como in_progress conforme Ralph trabaja)

# 2. Inicia Ralph loop
/ralph-loop "Cumplir criterio de tarea #1"

# 3. Ralph itera y completa tarea
# 4. Marca como completed en TodoWrite
# 5. Siguiente tarea
```

---

## Combinación: Ralph + DFO

Ralph integrado con SOLARIA DFO:

```bash
/ralph-loop "
set_project_context({ project_id: 1 });
get_ready_tasks().then(tasks => {
  const task = tasks[0];
  // Ralph trabaja en tarea
  complete_task({ task_id: task.id });
});
"
```

---

## Performance Tips

1. **Especifica archivos a modificar** en criterio
   - Ralph sabrá dónde enfocar
   - Menos iteraciones = menos tokens

2. **Agrupa validaciones**
   ```
   /ralph-loop "Tests + Lint + Types en una pasada"
   ```

3. **Úsalo para tareas complejas**
   - No vale la pena para trivialidades
   - Ideal para features 2-4 horas

4. **Monitorea tokens**
   - Ralph reporta uso cada iteración
   - Ajusta criterios si consumes mucho

---

## Comandos Relacionados

```bash
# Ver estado de Ralph
/ralph-loop --status

# Ver historial de loops
/ralph-loop --history

# Configurar límites
/ralph-loop --max-iterations 10 --max-tokens 50000 "criterio"

# Debug mode (verbose output)
/ralph-loop --debug "criterio"
```

---

## ECO Integration

Ralph funciona perfectamente con ECO (Estratega General):

```
Comandante solicita:
  "Implementar JWT con Ralph"
    ↓
Lambda (ECO):
  1. Diseña especificación
  2. Define criterios de Ralph
  3. Inicia /ralph-loop
    ↓
Ralph:
  Itera autónomamente hasta completar
    ↓
Lambda (ECO):
  1. Valida resultado
  2. Reporta a Comandante
```

---

## Resources

- **Plugin Marketplace:** `anthropics/claude-plugins-official`
- **Comandos:** `/ralph-loop`, `/cancel-ralph`
- **Status:** ✅ Habilitado y listo

---

**Last Updated:** 2026-01-08
**Status:** ✅ Operacional
