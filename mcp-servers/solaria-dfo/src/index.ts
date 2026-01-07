#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import axios from 'axios';

const DFO_SERVER = process.env.DFO_SERVER || 'https://dfo.solaria.agency';
const DFO_MCP_URL = process.env.DFO_MCP_URL || `${DFO_SERVER}/mcp`;
const AUTH_TOKEN = process.env.DFO_AUTH_TOKEN || 'default';
const PROJECT_NAME = process.env.PROJECT_NAME || 'default';

console.error(`[SOLARIA-DFO MCP] Connecting to: ${DFO_MCP_URL}`);
console.error(`[SOLARIA-DFO MCP] Project: ${PROJECT_NAME}`);
console.error(`[SOLARIA-DFO MCP] Auth: ${AUTH_TOKEN}`);

const axiosInstance = axios.create({
  baseURL: DFO_MCP_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'X-Project-Id': PROJECT_NAME,
  },
});

const server = new Server(
  {
    name: 'solaria-dfo',
    version: '3.3.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

server.setRequestHandler('notifications/list', async () => {
  return { notifications: [] };
});

const tools = [
  {
    name: 'set_project_context',
    description: 'Establecer contexto de proyecto para aislar sesión (LLAMAR PRIMERO). Esta herramienta es CRÍTICA para multi-agent working. Debe llamarse al inicio de cada sesión para asegurar que el agente trabaje solo en el proyecto asignado y no contamine datos de otros proyectos.',
  },
  {
    name: 'get_current_context',
    description: 'Obtener contexto actual del proyecto (verificar aislamiento)',
  },
  {
    name: 'list_projects',
    description: 'Listar todos los proyectos disponibles',
  },
  {
    name: 'create_project',
    description: 'Crear nuevo proyecto en DFO',
  },
  {
    name: 'get_project',
    description: 'Obtener detalles de un proyecto específico',
  },
  {
    name: 'update_project',
    description: 'Actualizar información de un proyecto',
  },
  {
    name: 'list_tasks',
    description: 'Listar tareas con filtros avanzados',
  },
  {
    name: 'get_ready_tasks',
    description: 'Tareas listas para trabajar (DFN-004). Retorna tareas sin bloqueadores con scoring inteligente (0-100). Usa este endpoint para priorizar qué trabajar a continuación.',
  },
  {
    name: 'create_task',
    description: 'Crear nueva tarea',
  },
  {
    name: 'update_task',
    description: 'Actualizar información de una tarea',
  },
  {
    name: 'complete_task',
    description: 'Marcar tarea como completada',
  },
  {
    name: 'list_agents',
    description: 'Listar agentes SOLARIA disponibles',
  },
  {
    name: 'get_agent',
    description: 'Obtener estado de un agente específico',
  },
  {
    name: 'update_agent_status',
    description: 'Actualizar estado de un agente',
  },
  {
    name: 'get_dashboard_overview',
    description: 'Obtener KPIs ejecutivos (tareas, proyectos, budget, agentes)',
  },
  {
    name: 'get_dashboard_alerts',
    description: 'Obtener alertas activas (deadlines, bloqueadores, overbudget)',
  },
  {
    name: 'log_activity',
    description: 'Registrar actividad en DFO (auditoría)',
  },
  {
    name: 'memory_create',
    description: 'Crear nueva memoria (decisiones, contexto, aprendizajes)',
  },
  {
    name: 'memory_list',
    description: 'Listar memorias con filtros',
  },
  {
    name: 'memory_get',
    description: 'Obtener memoria específica (incrementa contador de acceso)',
  },
  {
    name: 'memory_update',
    description: 'Actualizar contenido de una memoria',
  },
  {
    name: 'memory_delete',
    description: 'Eliminar memoria',
  },
  {
    name: 'memory_search',
    description: 'Búsqueda full-text en memorias',
  },
  {
    name: 'memory_semantic_search',
    description: 'Búsqueda semántica con vectores de embeddings',
  },
  {
    name: 'memory_boost',
    description: 'Aumentar importancia de una memoria útil',
  },
  {
    name: 'memory_related',
    description: 'Obtener memorias relacionadas via cross-references',
  },
  {
    name: 'memory_link',
    description: 'Crear relación entre dos memorias',
  },
];

server.setRequestHandler('tools/list', async () => {
  return { tools };
});

server.setRequestHandler('tools/call', async (request) => {
  const name = request.params.name;
  const args = request.params.arguments || {};

  try {
    console.error(`[SOLARIA-DFO MCP] Calling tool: ${name}`, JSON.stringify(args));

    const response = await axiosInstance.post('', {
      jsonrpc: '2.0',
      id: Date.now(),
      method: name,
      params: args,
    });

    const result = response.data;

    if (result.success === false) {
      return {
        content: [
          {
            type: 'text',
            text: `Error from DFO: ${result.error || 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }

    let responseText = '';
    if (result.formatted) {
      responseText = result.formatted;
    } else if (result.data) {
      responseText = JSON.stringify(result.data, null, 2);
    } else {
      responseText = 'Success';
    }

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };

  } catch (error) {
    console.error(`[SOLARIA-DFO MCP] Error:`, error.message);

    return {
      content: [
        {
          type: 'text',
          text: `Failed to call DFO: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  console.error(`[SOLARIA-DFO MCP] Starting server v3.3.0...`);
  console.error(`[SOLARIA-DFO MCP] Project: ${PROJECT_NAME}`);
  console.error(`[SOLARIA-DFO MCP] Server: ${DFO_MCP_URL}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(`[SOLARIA-DFO MCP] Server running and ready`);
  console.error(`[SOLARIA-DFO MCP] Available tools: set_project_context, get_current_context, list_projects, create_project, list_tasks, create_task, get_ready_tasks, memory_*, etc.`);
}

main().catch((error) => {
  console.error('[SOLARIA-DFO MCP] Fatal error:', error);
  process.exit(1);
});
