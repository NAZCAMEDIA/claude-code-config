#!/usr/bin/env node

const axios = require('axios');

const DFO_SERVER = process.env.DFO_SERVER || 'https://dfo.solaria.agency';
const DFO_API_URL = process.env.DFO_API_URL || DFO_SERVER + '/api';
const AUTH_TOKEN = process.env.DFO_AUTH_TOKEN || 'default';
const PROJECT_NAME = process.env.PROJECT_NAME || 'claude-code-config';
const AGENT_ID = process.env.AGENT_ID || '11';

console.error('[SOLARIA-DFO v2.0] Starting minimal MCP server...');
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
  { name: 'memory_semantic_search', description: 'Busqueda semántica' },
  { name: 'health_check', description: 'Verificar conexión DFO' },
];

process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');

async function handleMessage() {
  let buffer = '';
  for await (const chunk of process.stdin) {
    buffer += chunk;
    while (true) {
      const newlineIdx = buffer.indexOf('\n');
      if (newlineIdx === -1) break;

      const line = buffer.substring(0, newlineIdx);
      buffer = buffer.substring(newlineIdx + 1);

      try {
        const request = JSON.parse(line);

        if (request.method === 'initialize') {
          writeMessage({
            jsonrpc: '2.0',
            id: request.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: { tools: {} },
              serverInfo: { name: 'solaria-dfo', version: '2.0.0' },
            },
          });
          continue;
        }

        if (request.method === 'notifications/list') {
          writeMessage({
            jsonrpc: '2.0',
            id: request.id,
            result: { notifications: [] },
          });
          continue;
        }

        if (request.method === 'tools/list') {
          writeMessage({
            jsonrpc: '2.0',
            id: request.id,
            result: { tools },
          });
          continue;
        }

        if (request.method === 'tools/call') {
          const { name, arguments: args = {} } = request.params;

          console.error('[SOLARIA-DFO v2.0] Calling:', name);

          if (name === 'health_check') {
            try {
              const response = await axiosInstance.get('/health', { timeout: 5000 });
              writeMessage({
                jsonrpc: '2.0',
                id: request.id,
                result: { content: [{ type: 'text', text: JSON.stringify({ status: 'connected', server: DFO_API_URL, response: response.data }, null, 2) }] },
              });
            } catch (err) {
              writeMessage({
                jsonrpc: '2.0',
                id: request.id,
                result: { content: [{ type: 'text', text: JSON.stringify({ status: 'disconnected', server: DFO_API_URL, error: err.message }, null, 2) }] },
              });
            }
            continue;
          }

          const response = await axiosInstance.post('/' + name, { ...args, jsonrpc: '2.0', id: Date.now(), method: name });
          const result = response.data;

          if (result.success === false || result.error) {
            writeMessage({
              jsonrpc: '2.0',
              id: request.id,
              result: { content: [{ type: 'text', text: 'Error DFO: ' + (result.error || result.message || 'Unknown') }] },
              isError: true,
            });
            continue;
          }

          let responseText = result.formatted ? result.formatted : result.data ? JSON.stringify(result.data, null, 2) : 'Success';
          writeMessage({
            jsonrpc: '2.0',
            id: request.id,
            result: { content: [{ type: 'text', text: responseText }] },
          });
        }
      } catch (err) {
        writeMessage({
          jsonrpc: '2.0',
          id: request.id,
          error: { code: -32700, message: 'Parse error: ' + err.message },
        });
      }
    }
  }
}

function writeMessage(message) {
  process.stdout.write(JSON.stringify(message) + '\n');
}

async function main() {
  console.error('[SOLARIA-DFO v2.0] Server running');
  console.error('[SOLARIA-DFO v2.0] Tools:', tools.map(t => t.name).join(', '));
  
  await handleMessage();
}

main().catch(err => {
  console.error('[SOLARIA-DFO v2.0] Fatal error:', err);
  process.exit(1);
});
