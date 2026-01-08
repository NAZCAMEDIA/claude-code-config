# Switch to Sonnet Model

Cambia Claude Code al modelo **Sonnet 4.5** - equilibrio óptimo velocidad/capacidad.

## Uso

```
/sonnet
```

## Cuando ejecuta `/sonnet`:

1. Cambiar `model` en `~/.claude/settings.json` a `"sonnet"`
2. Mostrar confirmación visual:
   ```
   ✅ Model switched to: Sonnet 4.5 (claude-sonnet-4-5-20241022)

   Características:
   • Velocidad: ⚡⚡ RÁPIDA
   • Capacidad: 🧠 BUENA
   • Costo: 💰 EQUILIBRADO
   • Contexto: 200K tokens
   • Ideal para: Desarrollo, refactoring, tests, implementación

   Status: ACTIVO
   ```
3. NO requiere reinicio de Claude Code
4. El cambio es inmediato

## Modelo Actual

- **Nombre**: claude-sonnet-4-5-20241022
- **Velocidad**: Rápida
- **Costo**: $3 / 1M input, $15 / 1M output
- **Mejor para**:
  - Escribir código nuevo
  - Debugging y análisis
  - Implementación de features
  - Tests y validaciones
  - Code reviews técnicos

## Atajos Disponibles

- `/haiku` - Claude Haiku 4.5 (rápido, barato)
- `/sonnet` - Este modelo (equilibrio)
- `/opus` - Claude Opus 4.5 (máxima potencia)

## Notas

- La opción más recomendada para desarrollo general
- Mejor relación costo/capacidad
- Cambio inmediato en nueva sesión
- Perfecto para tareas de ECO-Omega (desarrollo técnico)
