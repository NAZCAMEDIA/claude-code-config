#!/usr/bin/env node
/**
 * SOLARIA Digital Field Operations - MCP Server v3.3.0
 *
 * Este servidor MCP actúa como cliente del servidor centralizado DFO
 * proporcionando herramientas para gestión de proyectos, tareas y memoria
 * para agentes de Claude Code, Cursor, Windsurf y OpenCode.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import axios from 'axios';
const DFO_SERVER = process.env.DFO_SERVER || 'https://dfo.solaria.agency';
const DFO_MCP_URL = process.env.DFO_MCP_URL || `${DFO_SERVER}/mcp`;
const AUTH_TOKEN = process.env.DFO_AUTH_TOKEN || 'default';
const PROJECT_NAME = process.env.PROJECT_NAME || 'default';
console.error(`[SOLARIA-DFO MCP] Connecting to: ${DFO_MCP_URL}`);
console.error(`[SOLARIA-DFO MCP] Auth token: ${AUTH_TOKEN === 'default' ? 'default (bypass)' : 'custom'}`);
const axiosInstance = axios.create({
    baseURL: DFO_MCP_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'X-Project-Id': PROJECT_NAME,
    },
});
const server = new McpServer({
    name: 'solaria-dfo',
    version: '3.3.0',
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler('notifications/list', async () => {
    return { notifications: [] };
});
server.setRequestHandler('tools/list', async () => {
    return {
        tools: [
            {
                name: 'set_project_context',
                description: 'Establecer contexto de proyecto para aislar sesión (LLAMAR PRIMERO). Esta herramienta es CRÍTICA para multi-agent working. Debe llamarse al inicio de cada sesión para asegurar que el agente trabaje solo en el proyecto asignado y no contamine datos de otros proyectos.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project_name: {
                            type: 'string',
                            description: 'Nombre del proyecto (ej: "PRILABSA Website")',
                        },
                        project_id: {
                            type: 'number',
                            description: 'ID del proyecto (opcional, usa project_name si no se especifica)',
                        },
                        working_directory: {
                            type: 'string',
                            description: 'Directorio de trabajo actual (ej: "/Users/user/projects/my-app")',
                        },
                    },
                    oneOf: [
                        { required: ['project_name'] },
                        { required: ['project_id'] },
                        { required: ['working_directory'] },
                    ],
                },
            },
            {
                name: 'get_current_context',
                description: 'Obtener contexto actual del proyecto (verificar aislamiento)',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'list_projects',
                description: 'Listar todos los proyectos disponibles',
                inputSchema: {
                    type: 'object',
                    properties: {
                        limit: {
                            type: 'number',
                            description: 'Límite de resultados (default: 50)',
                        },
                        office_visible: {
                            type: 'boolean',
                            description: 'Filtrar solo proyectos visibles en SOLARIA OFFICE',
                        },
                    },
                },
            },
            {
                name: 'create_project',
                description: 'Crear nuevo proyecto en DFO',
                inputSchema: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Nombre del proyecto',
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción del proyecto',
                        },
                        client_id: {
                            type: 'number',
                            description: 'ID del cliente (opcional)',
                        },
                        budget_usd: {
                            type: 'number',
                            description: 'Presupuesto en USD (opcional)',
                        },
                        start_date: {
                            type: 'string',
                            description: 'Fecha de inicio (YYYY-MM-DD)',
                        },
                        end_date: {
                            type: 'string',
                            description: 'Fecha de fin (YYYY-MM-DD)',
                        },
                    },
                },
            },
            {
                name: 'get_project',
                description: 'Obtener detalles de un proyecto específico',
                inputSchema: {
                    type: 'object',
                    required: ['project_id'],
                    properties: {
                        project_id: {
                            type: 'number',
                            description: 'ID del proyecto',
                        },
                    },
                },
            },
            {
                name: 'update_project',
                description: 'Actualizar información de un proyecto',
                inputSchema: {
                    type: 'object',
                    required: ['project_id'],
                    properties: {
                        project_id: {
                            type: 'number',
                            description: 'ID del proyecto',
                        },
                        name: {
                            type: 'string',
                            description: 'Nuevo nombre del proyecto',
                        },
                        description: {
                            type: 'string',
                            description: 'Nueva descripción',
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'on_hold', 'completed', 'cancelled'],
                            description: 'Estado del proyecto',
                        },
                        budget_usd: {
                            type: 'number',
                            description: 'Actualizar presupuesto',
                        },
                    },
                },
            },
            {
                name: 'list_tasks',
                description: 'Listar tareas con filtros avanzados',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project_id: {
                            type: 'number',
                            description: 'Filtrar por proyecto ID',
                        },
                        sprint_id: {
                            type: 'number',
                            description: 'Filtrar por sprint ID',
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'in_progress', 'completed', 'cancelled', 'blocked'],
                            description: 'Filtrar por estado',
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high', 'critical'],
                            description: 'Filtrar por prioridad',
                        },
                        agent_id: {
                            type: 'number',
                            description: 'Filtrar por agente asignado',
                        },
                        limit: {
                            type: 'number',
                            description: 'Límite de resultados (default: 50)',
                        },
                    },
                },
            },
            {
                name: 'get_ready_tasks',
                description: 'Tareas listas para trabajar (DFN-004). Retorna tareas sin bloqueadores con scoring inteligente (0-100). Usa este endpoint para priorizar qué trabajar a continuación.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project_id: {
                            type: 'number',
                            description: 'Filtrar por proyecto ID',
                        },
                        agent_id: {
                            type: 'number',
                            description: 'Filtrar por agente asignado',
                        },
                        sprint_id: {
                            type: 'number',
                            description: 'Filtrar por sprint ID',
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high', 'critical'],
                            description: 'Filtrar por prioridad',
                        },
                        limit: {
                            type: 'number',
                            description: 'Límite (default: 10, max: 100)',
                        },
                    },
                },
            },
            {
                name: 'create_task',
                description: 'Crear nueva tarea',
                inputSchema: {
                    type: 'object',
                    required: ['title', 'project_id'],
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Título de la tarea',
                        },
                        description: {
                            type: 'string',
                            description: 'Descripción detallada',
                        },
                        project_id: {
                            type: 'number',
                            description: 'ID del proyecto donde crear la tarea',
                        },
                        epic_id: {
                            type: 'number',
                            description: 'ID del epic (opcional)',
                        },
                        sprint_id: {
                            type: 'number',
                            description: 'ID del sprint (opcional)',
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high', 'critical'],
                            default: 'medium',
                            description: 'Prioridad de la tarea',
                        },
                        estimated_hours: {
                            type: 'number',
                            description: 'Estimación en horas',
                        },
                        assignee_id: {
                            type: 'number',
                            description: 'ID del agente asignado',
                        },
                    },
                },
            },
            {
                name: 'update_task',
                description: 'Actualizar información de una tarea',
                inputSchema: {
                    type: 'object',
                    required: ['task_id'],
                    properties: {
                        task_id: {
                            type: 'number',
                            description: 'ID de la tarea',
                        },
                        title: {
                            type: 'string',
                            description: 'Nuevo título',
                        },
                        description: {
                            type: 'string',
                            description: 'Nueva descripción',
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'in_progress', 'completed', 'cancelled', 'blocked'],
                            description: 'Nuevo estado',
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high', 'critical'],
                            description: 'Nueva prioridad',
                        },
                        progress: {
                            type: 'number',
                            minimum: 0,
                            maximum: 100,
                            description: 'Porcentaje de progreso (0-100)',
                        },
                    },
                },
            },
            {
                name: 'complete_task',
                description: 'Marcar tarea como completada',
                inputSchema: {
                    type: 'object',
                    required: ['task_id'],
                    properties: {
                        task_id: {
                            type: 'number',
                            description: 'ID de la tarea',
                        },
                        notes: {
                            type: 'string',
                            description: 'Notas de completion',
                        },
                    },
                },
            },
            {
                name: 'memory_create',
                description: 'Crear nueva memoria (decisiones, contexto, aprendizajes)',
                inputSchema: {
                    type: 'object',
                    required: ['content'],
                    properties: {
                        content: {
                            type: 'string',
                            description: 'Contenido de la memoria',
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Tags para organización (ej: ["decision", "architecture"])',
                        },
                        importance: {
                            type: 'number',
                            minimum: 0,
                            maximum: 1,
                            description: 'Importancia (0.0-1.0, default: 0.5)',
                        },
                        source_session_id: {
                            type: 'string',
                            description: 'ID de sesión de origen (OpenCode, Claude Code, etc.)',
                        },
                    },
                },
            },
            {
                name: 'memory_search',
                description: 'Búsqueda full-text en memorias',
                inputSchema: {
                    type: 'object',
                    required: ['query'],
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Texto de búsqueda',
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Filtrar por tags',
                        },
                        limit: {
                            type: 'number',
                            description: 'Límite de resultados (default: 10)',
                        },
                    },
                },
            },
            {
                name: 'memory_semantic_search',
                description: 'Búsqueda semántica con vectores de embeddings',
                inputSchema: {
                    type: 'object',
                    required: ['query'],
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Consulta en lenguaje natural',
                        },
                        limit: {
                            type: 'number',
                            description: 'Límite de resultados (default: 5)',
                        },
                    },
                },
            },
            {
                name: 'memory_boost',
                description: 'Aumentar importancia de una memoria útil',
                inputSchema: {
                    type: 'object',
                    required: ['memory_id'],
                    properties: {
                        memory_id: {
                            type: 'number',
                            description: 'ID de la memoria',
                        },
                        increment: {
                            type: 'number',
                            description: 'Incremento (default: 0.1, range: -1.0 to 1.0)',
                        },
                    },
                },
            },
        ],
    };
});
server.setRequestHandler('tools/call', async (request) => {
    const name = request.params.name;
    const args = request.params.arguments;
    try {
        console.error(`[SOLARIA-DFO MCP] Calling tool: ${name}`, JSON.stringify(args));
        const response = await axiosInstance.post('', {
            jsonrpc: '2.0',
            id: Date.now(),
            method: name,
            params: args || {},
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
        }
        else if (result.data) {
            responseText = JSON.stringify(result.data, null, 2);
        }
        else {
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
    }
    catch (error) {
        console.error(`[SOLARIA-DFO MCP] Error calling ${name}:`, error.message);
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
//# sourceMappingURL=index.js.map