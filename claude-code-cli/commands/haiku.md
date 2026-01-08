# Switch to Haiku Model

Cambia Claude Code al modelo **Haiku 4.5** - el más rápido y económico.

## Uso

```
/haiku
```

## Cuando ejecuta `/haiku`:

1. Cambiar `model` en `~/.claude/settings.json` a `"haiku"`
2. Mostrar confirmación visual:
   ```
   ✅ Model switched to: Haiku 4.5 (claude-haiku-4-5-20251001)

   Características:
   • Velocidad: ⚡⚡⚡ MÁXIMA
   • Costo: 💰 MÍNIMO
   • Contexto: 200K tokens
   • Ideal para: Git ops, búsquedas, tareas simples

   Status: ACTIVO
   ```
3. NO requiere reinicio de Claude Code
4. El cambio es inmediato

## Modelo Actual

- **Nombre**: claude-haiku-4-5-20251001
- **Velocidad**: Ultra-rápido
- **Costo**: $0.80 / 1M input, $4 / 1M output
- **Mejor para**:
  - Operaciones Git (add, commit, push)
  - Búsquedas y análisis simple
  - File operations
  - Tareas mecánicas rápidas

## Atajos Disponibles

- `/haiku` - Este modelo (rápido)
- `/sonnet` - Claude Sonnet 4.5 (equilibrio)
- `/opus` - Claude Opus 4.5 (potencia)

## Notas

- El cambio es inmediato en nueva sesión
- Comandos `/model haiku` también disponible
- Resetea a Haiku en cada inicio si está configurado en settings.json
