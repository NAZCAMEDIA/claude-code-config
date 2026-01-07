/**
 * OpenCode Bridge MCP Server v1.0.0
 *
 * MCP Bridge simple que integra OpenCode con SOLARIA DFO
 */

const OPENCODE_BRIDGE_DIR = `${__dirname}/opencode-bridge`;

const tools = [
  {
    name: 'opencode_session_sync',
    description: 'Sincronizar sesiones de OpenCode con Claude Code y DFO',
  },
  {
    name: 'opencode_dfo_bridge',
    description: 'Puente a SOLARIA DFO para crear tareas, leer proyectos, etc.',
  },
  {
    name: 'opencode_execute_skill',
    description: 'Ejecutar skills de Claude Code en contexto de DFO',
  },
  {
    name: 'opencode_sync_config',
    description: 'Sincronizar configuraciones entre instancias',
  },
];

const server = {
  name: 'opencode-bridge',
  version: '1.0.0',
  tools,
};

server.setRequestHandler('tools/list', async () => {
  return { tools };
});

server.setRequestHandler('tools/call', async (request) => {
  const name = request.params.name;
  const args = request.params.arguments || {};

  console.error(`[OpenCode Bridge] Tool: ${name}`, JSON.stringify(args));

  return {
    content: [
      {
        type: 'text',
        text: `Simple test - ${name} called with args: ${JSON.stringify(args)}`,
      },
    ],
  };
});

const transport = require('@modelcontextprotocol/sdk/server/stdio.js').StdioServerTransport();
server.connect(transport).then(() => {
  console.error('[OpenCode Bridge] Server running and ready');
  console.error(`[OpenCode Bridge] Available tools: ${tools.map(t => t.name).join(', ')}`);
}).catch((error) => {
  console.error('[OpenCode Bridge] Fatal error:', error);
  process.exit(1);
});
