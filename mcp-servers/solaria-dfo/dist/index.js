#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var axios_1 = require("axios");
var DFO_SERVER = process.env.DFO_SERVER || 'https://dfo.solaria.agency';
var DFO_MCP_URL = process.env.DFO_MCP_URL || "".concat(DFO_SERVER, "/mcp");
var AUTH_TOKEN = process.env.DFO_AUTH_TOKEN || 'default';
var PROJECT_NAME = process.env.PROJECT_NAME || 'default';
console.error("[SOLARIA-DFO MCP] Connecting to: ".concat(DFO_MCP_URL));
console.error("[SOLARIA-DFO MCP] Project: ".concat(PROJECT_NAME));
console.error("[SOLARIA-DFO MCP] Auth: ".concat(AUTH_TOKEN));
var axiosInstance = axios_1.default.create({
    baseURL: DFO_MCP_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(AUTH_TOKEN),
        'X-Project-Id': PROJECT_NAME,
    },
});
var server = new index_js_1.Server({
    name: 'solaria-dfo',
    version: '3.3.0',
}, {
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.setRequestHandler('notifications/list', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, { notifications: [] }];
    });
}); });
var tools = [
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
server.setRequestHandler('tools/list', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, { tools: tools }];
    });
}); });
server.setRequestHandler('tools/call', function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var name, args, response, result, responseText, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = request.params.name;
                args = request.params.arguments || {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.error("[SOLARIA-DFO MCP] Calling tool: ".concat(name), JSON.stringify(args));
                return [4 /*yield*/, axiosInstance.post('', {
                        jsonrpc: '2.0',
                        id: Date.now(),
                        method: name,
                        params: args,
                    })];
            case 2:
                response = _a.sent();
                result = response.data;
                if (result.success === false) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error from DFO: ".concat(result.error || 'Unknown error'),
                                },
                            ],
                            isError: true,
                        }];
                }
                responseText = '';
                if (result.formatted) {
                    responseText = result.formatted;
                }
                else if (result.data) {
                    responseText = JSON.stringify(result.data, null, 2);
                }
                else {
                    responseText = 'Success';
                }
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: responseText,
                            },
                        ],
                    }];
            case 3:
                error_1 = _a.sent();
                console.error("[SOLARIA-DFO MCP] Error:", error_1.message);
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: "Failed to call DFO: ".concat(error_1.message),
                            },
                        ],
                        isError: true,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.error("[SOLARIA-DFO MCP] Starting server v3.3.0...");
                    console.error("[SOLARIA-DFO MCP] Project: ".concat(PROJECT_NAME));
                    console.error("[SOLARIA-DFO MCP] Server: ".concat(DFO_MCP_URL));
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    console.error("[SOLARIA-DFO MCP] Server running and ready");
                    console.error("[SOLARIA-DFO MCP] Available tools: set_project_context, get_current_context, list_projects, create_project, list_tasks, create_task, get_ready_tasks, memory_*, etc.");
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error('[SOLARIA-DFO MCP] Fatal error:', error);
    process.exit(1);
});
