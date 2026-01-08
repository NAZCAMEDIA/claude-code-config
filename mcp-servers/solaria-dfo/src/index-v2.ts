#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import axios from 'axios';

// DFO v2.0 Configuration
const DFO_SERVER = process.env.DFO_SERVER || 'https://dfo.solaria.agency';
const DFO_MCP_URL = process.env.DFO_MCP_URL || `${DFO_SERVER}/mcp`;
const DFO_API_URL = process.env.DFO_API_URL || `${DFO_SERVER}/api`;
const AUTH_TOKEN = process.env.DFO_AUTH_TOKEN || 'default';
const PROJECT_NAME = process.env.PROJECT_NAME || 'claude-code-config';
const AGENT_ID = process.env.AGENT_ID || '11';
const TIMEOUT = process.env.DFO_TIMEOUT || '30000';

console.error(`[SOLARIA-DFO v2.0] Starting MCP server...`);
console.error(`[SOLARIA-DFO v2.0] API URL: ${DFO_API_URL}`);
console.error(`[SOLARIA-DFO v2.0] MCP URL: ${DFO_MCP_URL}`);
console.error(`[SOLARIA-DFO v2.0] Project: ${PROJECT_NAME}`);
console.error(`[SOLARIA-DFO v2.0] Agent ID: ${AGENT_ID}`);

// Create axios instance with retry logic
const axiosInstance = axios.create({
  baseURL: DFO_API_URL,
  timeout: parseInt(TIMEOUT),
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'X-Project-Id': PROJECT_NAME,
    'X-Agent-Id': AGENT_ID,
    'User-Agent': 'SOLARIA-DFO-MCP/v2.0',
  },
  // Retry on network errors
  validateStatus: (status) => status >= 200 && status < 500,
});

// DFO v2.0 Tools definitions
const tools = [
  {
    name: 'list_projects',
    description: 'Listar todos los proyectos disponibles en DFO',
  },
  {
    name: 'get_project',
    description: 'Obtener detalles de un proyecto específico',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'number' },
      },
    },
  },
  {
    name: 'list_tasks',
    description: 'Listar tareas con filtros avanzados',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'number' },
        status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'blocked'] },
        priority: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
        limit: { type: 'number', default: 50 },
      },
    },
  },
  {
    name: 'get_ready_tasks',
    description: 'Tareas listas para trabajar con scoring inteligente (0-100)',
  },
  {
    name: 'create_task',
    description: 'Crear nueva tarea',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        project_id: { type: 'number' },
        description: { type: 'string' },
        priority: { type: 'string', enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
        status: { type: 'string', enum: ['pending', 'in_progress'], default: 'pending' },
      },
      required: ['title'],
    },
  },
  {
    name: 'update_task',
    description: 'Actualizar información de una tarea',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: { type: 'number' },
        status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'blocked'] },
        priority: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
        progress: { type: 'number', minimum: 0, maximum: 100 },
      },
      required: ['task_id'],
    },
  },
  {
    name: 'complete_task',
    description: 'Marcar tarea como completada',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: { type: 'number' },
        completion_notes: { type: 'string' },
      },
      required: ['task_id'],
    },
  },
  {
    name: 'list_agents',
    description: 'Listar agentes SOLARIA disponibles',
  },
  {
    name: 'get_agent',
    description: 'Obtener estado de un agente específico',
    inputSchema: {
      type: 'object',
      properties: {
        agent_id: { type: 'number' },
      },
      required: ['agent_id'],
    },
  },
  {
    name: 'update_agent_status',
    description: 'Actualizar estado de un agente',
    inputSchema: {
      type: 'object',
      properties: {
        agent_id: { type: 'number' },
        status: { type: 'string', enum: ['active', 'busy', 'inactive', 'maintenance'] },
      },
      required: ['agent_id', 'status'],
    },
  },
  {
    name: 'get_dashboard_overview',
    description: 'Obtener KPIs ejecutivos (tareas, proyectos, agentes)',
  },
  {
    name: 'get_dashboard_alerts',
    description: 'Obtener alertas activas (deadlines, bloqueadores, overbudget)',
  },
  {
    name: 'memory_create',
    description: 'Crear nueva memoria (decisiones, contexto, aprendizajes)',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        summary: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        importance: { type: 'number', minimum: 0, maximum: 1, default: 0.5 },
      },
      required: ['content'],
    },
  },
  {
    name: 'memory_list',
    description: 'Listar memorias con filtros',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        limit: { type: 'number', default: 20 },
      },
    },
  },
  {
    name: 'memory_semantic_search',
    description: 'Búsqueda semántica con vectores de embeddings',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        min_similarity: { type: 'number', minimum: 0, maximum: 1, default: 0.5 },
        limit: { type: 'number', default: 10 },
      },
      required: ['query'],
    },
  },
  {
    name: 'health_check',
    description: 'Verificar conexión con DFO v2.0',
  },
];

const server = new Server(
  {
    name: 'solaria-dfo',
    version: '2.0.0',
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

server.setRequestHandler('tools/list', async () => {
  return { tools };
});

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    console.error(`[SOLARIA-DFO v2.0] Calling: ${name}`, JSON.stringify(args).substring(0, 200));

    // Handle health check specially
    if (name === 'health_check') {
      try {
        const response = await axiosInstance.get('/health', { timeout: 5000 });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'connected',
                server: DFO_API_URL,
                response: response.data,
              }, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'disconnected',
                server: DFO_API_URL,
                error: err.message,
                suggestion: 'Verifica que el servidor DFO esté activo o contacta soporte@solaria.agency',
              }, null, 2),
            },
          ],
          isError: false, // Not an error, just disconnected
        };
      }
    }

    // Make API call to DFO v2.0
    const response = await axiosInstance.post(`/${name}`, {
      ...args,
      jsonrpc: '2.0',
      id: Date.now(),
      method: name,
    });

    const result = response.data;

    // Handle different response formats
    if (result.success === false || result.error) {
      console.error(`[SOLARIA-DFO v2.0] API Error:`, result.error || result.message);
      return {
        content: [
          {
            type: 'text',
            text: `Error from DFO: ${result.error || result.message || 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }

    // Format successful response
    let responseText = '';
    if (result.formatted) {
      responseText = result.formatted;
    } else if (result.data) {
      responseText = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2);
    } else {
      responseText = JSON.stringify(result, null, 2);
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
    const errorMsg = error.response
      ? `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`
      : error.code === 'ECONNREFUSED'
      ? 'Conexión rechazada - Servidor DFO no disponible'
      : error.code === 'ETIMEDOUT'
      ? 'Timeout de conexión - Servidor no responde'
      : error.code === 'ENOTFOUND'
      ? 'DNS no resuelto - Verifica la URL del servidor'
      : error.message;

    console.error(`[SOLARIA-DFO v2.0] Error:`, errorMsg);
    console.error(`[SOLARIA-DFO v2.0] Full error:`, error.message);

    return {
      content: [
        {
          type: 'text',
          text: `DFO Connection Error: ${errorMsg}\n\n` +
                   `Server: ${DFO_API_URL}\n` +
                   `Project: ${PROJECT_NAME}\n` +
                   `Agent ID: ${AGENT_ID}\n\n` +
                   `Sugerencias:\n` +
                   `- Verifica que dfo.solaria.agency esté activo\n` +
                   `- Revisa la configuración de red/firewall\n` +
                   `- Contacta soporte@solaria.agency si persiste`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();

  try {
    await server.connect(transport);
    console.error(`[SOLARIA-DFO v2.0] ✓ Server running and ready`);
    console.error(`[SOLARIA-DFO v2.0] Available tools: ${tools.length}`);
    console.error(`[SOLARIA-DFO v2.0] Tools: ${tools.map(t => t.name).join(', ')}`);
  } catch (error) {
    console.error('[SOLARIA-DFO v2.0] Fatal error:', error);
    process.exit(1);
  }
}

main();
