# Switch to Opus Model

Cambia Claude Code al modelo **Opus 4.5** - máxima capacidad y razonamiento.

## Uso

```
/opus
```

## Cuando ejecuta `/opus`:

1. Cambiar `model` en `~/.claude/settings.json` a `"opus"`
2. Mostrar confirmación visual:
   ```
   ✅ Model switched to: Opus 4.5 (claude-opus-4-5-20251101)

   Características:
   • Velocidad: ⚡ MODERADA
   • Capacidad: 🧠🧠🧠 MÁXIMA
   • Razonamiento: 🤔 EXPERTO
   • Contexto: 200K tokens
   • Ideal para: Arquitectura, planning, decisiones estratégicas

   Status: ACTIVO
   ```
3. NO requiere reinicio de Claude Code
4. El cambio es inmediato

## Modelo Actual

- **Nombre**: claude-opus-4-5-20251101
- **Velocidad**: Moderada (pero vale la pena)
- **Capacidad**: Máxima
- **Costo**: $15 / 1M input, $75 / 1M output
- **Mejor para**:
  - Diseño de arquitectura
  - Planificación de proyectos
  - Decisiones estratégicas
  - Análisis complejos
  - Coordinación multi-agentes
  - Evaluación de trade-offs

## Atajos Disponibles

- `/haiku` - Claude Haiku 4.5 (rápido, barato)
- `/sonnet` - Claude Sonnet 4.5 (equilibrio)
- `/opus` - Este modelo (máxima potencia)

## ECO Integration

- **Modelo DEFAULT para ECO-Lambda** (Estratega General)
- Úsalo cuando necesites máximo razonamiento
- Ideal para: Arquitectura, estrategia, coordinación

## Notas

- Modelo más potente disponible
- Más caro pero justificado para tareas complejas
- Cambio inmediato en nueva sesión
- Recomendado para ECO-Lambda (arquitecto estratégico)
