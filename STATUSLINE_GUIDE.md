# Claude Code Status Line - Guía Completa

Explicación detallada de la barra de estado personalizada de Claude Code.

## Formato General

```
CTO | Opus-4.5 | main | e6c6ad2 DOCS: Deployment... | Ctx: 15% | carlosjperez@ORIGIN:~/... 12:37
```

### Componentes

| Componente | Ejemplo | Significado |
|-----------|---------|-------------|
| **Estilo Output** | `CTO` | Modo ejecutivo (cto-executive) |
| **Modelo Activo** | `Opus-4.5` | Claude Opus 4.5 en uso |
| **Rama Git** | `main` | Rama Git actual |
| **Último Commit** | `e6c6ad2 DOCS:...` | Hash corto + mensaje |
| **Contexto** | `Ctx: 15%` | Uso de ventana de contexto |
| **Usuario@Host** | `carlosjperez@ORIGIN` | Usuario y hostname |
| **Ruta** | `~/...` | Directorio actual (relativo a home) |
| **Hora** | `12:37` | Hora actual |

---

## 🎯 Indicador de Contexto (`Ctx: XX%`)

**¿Qué es?**

Muestra el porcentaje de tu ventana de contexto (200,000 tokens) que está siendo utilizado.

**¿Cómo se calcula?**

```
Ctx% = (Input Tokens + Output Tokens) × 100 / 200,000
```

**Ejemplo:**
- Total de tokens usados: 30,000
- Ventana de contexto: 200,000
- Resultado: `Ctx: 15%`

---

## 🎨 Sistema de Colores Dinámicos

El color de `Ctx: XX%` cambia automáticamente según el uso:

### 🟢 Verde (1-79%) - Normal

```
Ctx: 45%   ← Color VERDE
```

**Estado:** Todo bien. Puedes seguir trabajando normalmente.

**Significado:** Tienes 45% de tu contexto disponible, queda 55% libre.

**Acción:** Ninguna requerida.

---

### 🟠 Naranja (80-89%) - Advertencia

```
Ctx: 85%   ← Color NARANJA
```

**Estado:** Contexto alto. Acercándose al límite.

**Significado:** Tienes 85% de tu contexto usado, queda 15% libre.

**Acción Recomendada:**
- Considera hacer `/dfo save` para guardar contexto en memoria
- Prepárate para posible compactación
- Si tienes tareas grandes pendientes, considera usarlas ahora

**Ejemplo:**
```
Ctx: 82% ← Se pone naranja
# Guardar contexto en memoria
/dfo save

# Continuar trabajando, pero ten cuidado
```

---

### 🔴 Rojo (90-99%) - Crítico

```
Ctx: 95%   ← Color ROJO
```

**Estado:** CRÍTICO. Contexto casi lleno.

**Significado:** Tienes 95% de tu contexto usado, queda 5% libre.

**Riesgo:** Auto-compactación próxima.

**Acción URGENTE:**
1. Guardar contexto inmediatamente: `/dfo save`
2. Si es posible, cierra la sesión y reinicia
3. No inicies tareas nuevas grandes

**Ejemplo:**
```
Ctx: 93% ← ALERTA ROJA
# ACCIÓN INMEDIATA REQUERIDA

/dfo save
# Esperar a que se guarde

# Luego reinicia Claude Code o comienza nueva sesión
exit
claude
```

---

### 🚨 Rojo Crítico + 🚨 (≥100%) - Auto-compactación

```
🚨 Ctx: 100% ← Color ROJO + emoji 🚨
```

**Estado:** CRÍTICO. Auto-compactación EN PROGRESO.

**Significado:** Has excedido el límite de contexto.

**¿Qué pasa?**
- Claude Code está automáticamente compactando la conversación
- Se pierden detalles de primeras mensajes
- Algunos cambios pueden no ser recordados
- Desempeño puede degradarse

**Acción INMEDIATA:**
1. `/dfo save` - Guardar TODO el contexto importante en memoria
2. `exit` - Salir de Claude Code
3. `claude` - Reiniciar sesión limpia

---

## 📊 Ejemplo Visual - Progresión de Contexto

```
Sesión inicial:
CTO | Haiku | main | abc123 | Ctx: 5% | user@host:~ 10:00
                                    ↓ (Verde - Normal)

Después de 1 hora de trabajo:
CTO | Haiku | main | def456 | Ctx: 42% | user@host:~ 11:00
                                    ↓ (Verde - Normal)

Mucho trabajo completado:
CTO | Haiku | main | ghi789 | Ctx: 81% | user@host:~ 12:15
                                    ↓ (Naranja - Advertencia)
    🎯 ACCIÓN: /dfo save

Continuando (ignorando advertencia):
CTO | Haiku | main | jkl012 | Ctx: 92% | user@host:~ 12:45
                                    ↓ (Rojo - Crítico)
    🚨 ACCIÓN URGENTE: /dfo save + reiniciar

Limite alcanzado:
CTO | Haiku | main | mno345 | 🚨 Ctx: 100% | user@host:~ 13:00
                                        ↓ (Auto-compactación)
    💀 CRÍTICO: exit → claude (nueva sesión)
```

---

## 🔄 Mejores Prácticas

### 1. Monitoreo Continuo

Revisa `Ctx: XX%` regularmente:
- Si es < 50%: Seguro trabajar
- Si es 50-79%: Normal pero monitoreando
- Si es 80-89%: Prepararse para guardar
- Si es 90%+: Acción inmediata

### 2. Guardar Contexto Proactivamente

No esperes a que llegue a 80%:

```bash
# Cada 1-2 horas de trabajo
/dfo save

# Esto guarda:
- Resumen de decisiones tomadas
- Cambios realizados
- Contexto de sesión
# En la base de datos DFO (persistente)
```

### 3. Integración con Ralph Loop

Cuando uses `/ralph-loop`:

```bash
# Antes de ralph loop
/dfo save

# Inicia ralph loop
/ralph-loop "Criterio específico"

# Ralph iterará. Monitorea Ctx: XX%
# Si llega a 85%+ durante ralph loop:
/cancel-ralph
/dfo save
```

### 4. Cambio de Modelo y Contexto

Cambiar de modelo NO resetea contexto:

```bash
/opus
# Ctx: 45% ← No cambia

/haiku
# Ctx: 45% ← Sigue igual

# Cambiar modelo solo cambia CPU usada, no contexto
```

---

## 🐛 Troubleshooting

### ¿Por qué a veces llega a 400%?

**ANTES (Bug):** Script calculaba sin limitar a 100%.

**AHORA (Arreglado):**
- Se limita automáticamente a 100%
- Se detiene la auto-compactación
- Se muestra `🚨 Ctx: 100%` cuando llega al límite

### ¿Cómo reseteo el contexto?

```bash
# Opción 1: Reiniciar sesión limpia
exit
claude

# Opción 2: Guardar y hacer checkpoint
/dfo save
# Continúa en nueva sesión mental (aunque mismo CLI)
```

### ¿Puedo expandir el contexto?

**No.** El límite de 200K tokens es del modelo Claude.

**Alternativas:**
- Usar `/opus` (mejor razonamiento con contexto limitado)
- Guardar contexto en memoria con `/dfo save`
- Hacer checkpoints frecuentes
- Particionar trabajo en tareas más pequeñas

---

## 📈 Estadísticas Típicas

| Tarea | Contexto Usado | Duración |
|-------|----------------|----------|
| Búsqueda simple | 5-10% | <5 min |
| Análisis de archivos | 15-25% | 10-30 min |
| Implementar feature | 30-50% | 1-2 horas |
| Refactoring complejo | 50-80% | 2-4 horas |
| Ralph loop (4h) | 40-70% | 4 horas |
| Día completo trabajo | 90%+ | 8 horas |

**Recomendación:** Guardar contexto cada 1-2 horas máximo.

---

## 🎯 Cheat Sheet - Quick Reference

```
┌─────────────────────────────────────────────────────────┐
│             CONTEXTO - GUÍA RÁPIDA                      │
├──────────────┬──────────────┬──────────────────────────┤
│ Rango        │ Color        │ Acción                   │
├──────────────┼──────────────┼──────────────────────────┤
│ 1-79%        │ 🟢 Verde     │ Normal - Continúa        │
│ 80-89%       │ 🟠 Naranja   │ Alerta - Prepárate       │
│ 90-99%       │ 🔴 Rojo      │ Crítico - /dfo save      │
│ 100%+        │ 🚨 Rojo      │ Compactando - exit       │
└──────────────┴──────────────┴──────────────────────────┘
```

---

## 🔗 Relacionado

- **Status Line Script:** `statusline-comprehensive.sh`
- **DFO Integration:** `/dfo save`, `/dfo status`
- **Memory System:** `memory_create()`, `memory_save()`
- **Ralph Loop:** `/ralph-loop` (monitorea Ctx% durante ejecución)

---

## Resumen

**`Ctx: XX%` es tu "tanque de combustible" de contexto.**

- 🟢 Verde (1-79%): Tanque lleno - ¡Conduce tranquilo!
- 🟠 Naranja (80-89%): Tanque alto - ¡Busca gasolinera!
- 🔴 Rojo (90-99%): Tanque casi vacío - ¡PARADA DE EMERGENCIA!
- 🚨 Rojo Crítico (100%): Tanque vacío - ¡Auto-compactación!

**Acción clave:** `/dfo save` es tu "gasolinera digital" 🔋

---

**Last Updated:** 2026-01-08
**Status:** ✅ Actualizado con colores dinámicos y límites
