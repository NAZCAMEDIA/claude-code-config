#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
const server = new Server({
    name: 'opencode-bridge',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
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
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name;
    const args = request.params.arguments || {};
    console.error(`[OpenCode Bridge] Tool: ${name}`, JSON.stringify(args));
    return {
        content: [
            {
                type: 'text',
                text: `OpenCode Bridge - ${name} called with args: ${JSON.stringify(args)}`,
            },
        ],
    };
});
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[OpenCode Bridge] Server running and ready');
console.error(`[OpenCode Bridge] Available tools: ${tools.map((t) => t.name).join(', ')}`);
//# sourceMappingURL=index.js.map