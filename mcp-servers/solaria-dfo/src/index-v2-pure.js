#!/usr/bin/env node

const { StdioServerTransport } = require('@modelcontextprotocol/sdk/dist/cjs/server/stdio.js');
const { Server } = require('@modelcontextprotocol/sdk/dist/cjs/server/index.js');
const axios = require('axios');

const DFO_SERVER = process.env.DFO_SERVER || 'https://dfo.solaria.agency';
const DFO_API_URL = process.env.DFO_API_URL || DFO_SERVER + '/api';
const AUTH_TOKEN = process.env.DFO_AUTH_TOKEN || 'default';
const PROJECT_NAME = process.env.PROJECT_NAME || 'claude-code-config';
const AGENT_ID = process.env.AGENT_ID || '11';

console.error('[SOLARIA-DFO v2.0] Starting MCP server...');
console.error('[SOLARIA-DFO v2.0] API URL:', DFO_API_URL);
console.error('[SOLARIA-DFO v2.0] Project:', PROJECT_NAME);

const axiosInstance = axios.create({
  baseURL: DFO_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + AUTH_TOKEN,
    'X-Project-Id': PROJECT_NAME,
    'X-Agent-Id': AGENT_ID,
  },
});

const tools = [
  { name: 'list_projects', description: 'Listar todos los proyectos' },
  { name: 'get_project', description: 'Obtener detalles de proyecto' },
  { name: 'list_tasks', description: 'Listar tareas' },
  { name: 'create_task', description: 'Crear nueva tarea' },
  { name: 'update_task', description: 'Actualizar tarea' },
  { name: 'complete_task', description: 'Completar tarea' },
  { name: 'list_agents', description: 'Listar agentes' },
  { name: 'get_agent', description: 'Obtener agente' },
  { name: 'update_agent_status', description: 'Actualizar estado agente' },
  { name: 'get_dashboard_overview', description: 'Dashboard KPIs' },
  { name: 'get_dashboard_alerts', description: 'Dashboard alertas' },
  { name: 'memory_create', description: 'Crear memoria' },
  { name: 'memory_list', description: 'Listar memorias' },
  { name: 'memory_semantic_search', description: 'Búsqueda semántica' },
  { name: 'health_check', description: 'Verificar conexión DFO' },
];

const server = new Server({
  name: 'solaria-dfo',
  version: '2.0.0',
}, {
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.setRequestHandler('notifications/list', async () => {
  return { notifications: [] };
});

server.setRequestHandler('tools/list', async () => {
  return { tools };
});

server.setRequestHandler('tools/call', async (request) => {
  const name = request.params.name;
  const args = request.params.arguments || {};

  try {
    console.error('[SOLARIA-DFO v2.0] Calling:', name, JSON.stringify(args).substring(0, 100));

    if (name === 'health_check') {
      try {
        const response = await axiosInstance.get('/health', { timeout: 5000 });
        return {
          content: [{ type: 'text', text: JSON.stringify({ status: 'connected', server: DFO_API_URL, response: response.data }, null, 2) }],
        };
      } catch (err) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ status: 'disconnected', server: DFO_API_URL, error: err.message }, null, 2) }],
        };
      }
    }

    const response = await axiosInstance.post('/' + name, { ...args, jsonrpc: '2.0', id: Date.now(), method: name });
    const result = response.data;

    if (result.success === false || result.error) {
      return {
        content: [{ type: 'text', text: 'Error DFO: ' + (result.error || result.message || 'Unknown') }],
        isError: true,
      };
    }

    let responseText = result.formatted ? result.formatted : result.data ? JSON.stringify(result.data, null, 2) : 'Success';
    return {
      content: [{ type: 'text', text: responseText }],
    };
  } catch (error) {
    const errorMsg = error.response
      ? 'HTTP ' + error.response.status + ': ' + JSON.stringify(error.response.data)
      : error.code === 'ECONNREFUSED'
      ? 'Conexión rechazada'
      : error.code === 'ETIMEDOUT'
      ? 'Timeout de conexión'
      : error.code === 'ENOTFOUND'
      ? 'DNS no resuelto'
      : error.message;

    console.error('[SOLARIA-DFO v2.0] Error:', errorMsg);
    return {
      content: [{ type: 'text', text: 'DFO Error: ' + errorMsg + '\nServidor: ' + DFO_API_URL + '\n\nSugerencias:\n- Verifica que dfo.solaria.agency esté activo\n- Revisa firewall/proxy\n- Contacta soporte@solaria.agency' }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[SOLARIA-DFO v2.0] Server running');
  console.error('[SOLARIA-DFO v2.0] Tools:', tools.map(t => t.name).join(', '));
}

main().catch(err => {
  console.error('[SOLARIA-DFO v2.0] Fatal:', err);
  process.exit(1);
});
