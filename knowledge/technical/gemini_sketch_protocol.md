# Protocolo de Conexión Gemini CLI ↔ Sketch MCP
**Fecha:** 2026-01-11
**Estado:** ✅ Validado
**Sistema:** ECO-Lambda (Gemini Adapter)

## 1. Contexto
La conexión nativa con Sketch MCP (`http://localhost:31126/mcp`) presentaba errores HTTP 400 al intentar invocar herramientas. Se requirió ingeniería inversa del handshake para estabilizar la comunicación.

## 2. Diagnóstico
*   **Error Inicial:** `400 Bad Request`
*   **Causa:** El servidor MCP de Sketch es estricto con los encabezados HTTP.
*   **Requisito Crítico:** Es obligatorio incluir el header `Accept: application/json`. La mayoría de clientes HTTP por defecto no lo envían o envían `*/*`.

## 3. Protocolo Técnico Correcto

### Endpoint
`POST http://localhost:31126/mcp`

### Headers Obligatorios
```http
Content-Type: application/json
Accept: application/json
```

### Payload JSON-RPC
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "run_code",
    "arguments": {
      "script": "const sketch = require('sketch'); ..."
    }
  }
}
```

## 4. Cliente Python de Referencia (Arnés)

Este script (`mcp_client.py`) funciona correctamente como puente:

```python
import requests
import json
import sys

MCP_URL = "http://localhost:31126/mcp"

def call_tool(name, args):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": name, "arguments": args}
    }
    # HEADER ACCEPT ES CRÍTICO
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    response = requests.post(MCP_URL, json=payload, headers=headers)
    return response.json()
```

## 5. Patrón "Ralph Loop" para Sketch

Para garantizar calidad 10/10 en generación de UI:

1.  **Ejecutar Script:** Enviar código JS a Sketch.
2.  **Capturar Output:** El script JS **DEBE** hacer `console.log(JSON.stringify(resultado))` al final.
3.  **Verificar Warnings:** El cliente captura stderr/stdout. Si aparece "deprecated", el loop debe corregir la API.
4.  **Validar Dimensiones:** El JSON retornado debe incluir `frame`, `style` y `text` para validación matemática (ej. Centrado perfecto).

---
*Documentado automáticamente por Gemini CLI Agent.*
