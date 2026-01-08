# Claude Code Commands Reference

Comandos personalizados para Claude Code CLI.

## 🔄 Model Switcher Commands

Cambia rápidamente entre modelos de Claude sin reiniciar.

### `/haiku` - Haiku 4.5 (Rápido & Económico)

```
/haiku
```

**Uso ideal:**
- Operaciones Git (add, commit, push)
- Búsquedas de archivos
- Análisis simple
- Tareas mecánicas rápidas

**Características:**
- ⚡⚡⚡ Velocidad: MÁXIMA
- 💰 Costo: MÍNIMO
- 💾 Contexto: 200K tokens
- ⏱️ Tiempo respuesta: <1s

**Precios:**
- Input: $0.80 / 1M tokens
- Output: $4 / 1M tokens

**Cuándo usarlo:**
```
/haiku
# Trabajar en operaciones que no requieren razonamiento complejo
git add .
git commit -m "Quick fix"
```

---

### `/sonnet` - Sonnet 4.5 (Equilibrio Perfecto)

```
/sonnet
```

**Uso ideal:**
- Escritura de código nuevo
- Debugging y análisis
- Implementación de features
- Tests y validaciones
- Code reviews técnicos

**Características:**
- ⚡⚡ Velocidad: RÁPIDA
- 🧠 Capacidad: BUENA
- 💰 Costo: EQUILIBRADO
- 💾 Contexto: 200K tokens

**Precios:**
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens

**Cuándo usarlo:**
```
/sonnet
# La mejor opción para desarrollo general
# Implementar features, debugging, tests
```

**RECOMENDADO** para la mayoría de tareas de desarrollo.

---

### `/opus` - Opus 4.5 (Máxima Capacidad)

```
/opus
```

**Uso ideal:**
- Diseño de arquitectura
- Planificación de proyectos
- Decisiones estratégicas
- Análisis complejos
- Coordinación multi-agentes
- Evaluación de trade-offs

**Características:**
- ⚡ Velocidad: MODERADA
- 🧠🧠🧠 Capacidad: MÁXIMA
- 🤔 Razonamiento: EXPERTO
- 💾 Contexto: 200K tokens

**Precios:**
- Input: $15 / 1M tokens
- Output: $75 / 1M tokens

**Cuándo usarlo:**
```
/opus
# Tareas que requieren máximo razonamiento
# Diseño arquitectónico, decisiones complejas
# Perfecto para ECO-Lambda (Estratega General)
```

---

## 📊 Comparativa de Modelos

| Aspecto | Haiku | Sonnet | Opus |
|---------|-------|--------|------|
| **Velocidad** | ⚡⚡⚡ | ⚡⚡ | ⚡ |
| **Capacidad** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Razonamiento** | Básico | Bueno | Experto |
| **Costo** | 💰 | 💰💰 | 💰💰💰 |
| **Contexto** | 200K | 200K | 200K |
| **Ideal para** | Git, búsqueda | Desarrollo | Arquitectura |

---

## 🚀 Ralph Plugin Commands

### `/ralph-loop [criterio]` - Autonomous Development Loop

Inicia un bucle iterativo autónomo que trabaja en tu tarea hasta completarla.

```
/ralph-loop "Implementar JWT. Criterio: Tests >80%, endpoints funcionan"
```

Claude automáticamente:
1. Analiza el criterio
2. Implementa cambios
3. Valida contra criterios
4. Itera hasta completar
5. Se detiene cuando termina

**Características:**
- ✅ Itera automáticamente hasta éxito
- ✅ Ve su trabajo anterior
- ✅ Valida contra criterios
- ✅ Reporta progreso

**Cuándo usarlo:**
- Features complejas (4-8 horas)
- Refactoring extenso
- Debugging profundo
- Optimizaciones

### `/cancel-ralph` - Cancel Autonomous Loop

Detiene un loop de Ralph en progreso.

```
/cancel-ralph
```

**Cuándo usarlo:**
- Si algo falla
- Si quieres cambiar de tarea
- Si Ralph va mal dirección

---

## 🔗 DFO Integration Commands

### `/dfo [subcommand]` - SOLARIA Digital Field Operations

Sincronización bidireccional con DFO.

```bash
/dfo sync          # Sincronización completa
/dfo status        # Estado actual
/dfo next          # Siguiente tarea
/dfo complete      # Marcar como completada
/dfo memory query  # Buscar en memoria
/dfo save          # Guardar sesión
/dfo project name  # Cambiar proyecto
```

---

## 📚 Flujo de Trabajo Recomendado

### Desarrollo Simple (1-2 horas)

```
1. /sonnet                    # Cambiar a Sonnet
2. Implementar código
3. Tests y validación
4. Commit
```

### Desarrollo Complejo (4-8 horas)

```
1. /opus                      # Máximo razonamiento
2. Diseñar arquitectura
3. /sonnet                    # Cambiar a Sonnet
4. /ralph-loop "Criterio"    # Trabajar autónomamente
5. /opus                      # Validar resultado
```

### Tareas Rápidas (<15 min)

```
1. /haiku                     # Máxima velocidad
2. Git ops o búsqueda
3. Done!
```

### Con DFO Integration

```
1. /dfo sync                  # Sincronizar contexto
2. /dfo next                  # Ver siguiente tarea
3. Elegir modelo apropiado (/haiku, /sonnet, /opus)
4. Trabajar en tarea
5. /dfo complete             # Marcar completada
6. /dfo next                 # Siguiente
```

---

## ⚙️ Configuración

Los comandos se almacenan en:
```
~/.claude/commands/
```

Cada comando es un archivo markdown que describe cómo ejecutarlo.

### Sincronizar Comandos

```bash
cd /Users/carlosjperez/Documents/GitHub/claude-code-config
./sync-config.sh
# Luego reinicia Claude Code
```

### Agregar Comando Custom

```bash
# Crear nuevo comando en ~/.claude/commands/mi-comando.md
# Formato: Markdown con instrucciones
```

---

## 🎯 ECO Integration

### ECO-Lambda (Estratega)

```
/opus                        # Máxima capacidad
# Planificar arquitectura
# Tomar decisiones estratégicas
```

### ECO-Omega (Ejecutor Técnico)

```
/sonnet                      # Equilibrio
# Implementar código
# Debugging y tests
```

### ECO-Sigma (Ejecutor Rápido)

```
/haiku                       # Máxima velocidad
# Git operations
# Búsquedas rápidas
```

---

## 🔍 Troubleshooting

### El comando no funciona

```bash
# Asegurar que está sincronizado
cd /Users/carlosjperez/Documents/GitHub/claude-code-config
./sync-config.sh

# Reiniciar Claude Code
exit
claude
```

### El modelo no cambió

- Cambio efectivo en **nueva sesión** de Claude Code
- No requiere reinicio del CLI, pero sí nueva sesión

### Ralph se congela

```bash
/cancel-ralph
# Revisar criterio y reintentar con criterios más específicos
```

---

## 📚 References

- **Model Switcher**: `haiku.md`, `sonnet.md`, `opus.md`
- **Ralph Plugin**: Ver `RALPH_PLUGIN.md`
- **DFO Commands**: Ver `dfo.md`
- **Sync Script**: `sync-config.sh`

---

**Last Updated:** 2026-01-08
**Status:** ✅ Operacional
