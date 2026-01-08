#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// DFO v2.0 Configuration
var DFO_SERVER = process.env.DFO_SERVER || 'https://dfo.solaria.agency';
var DFO_MCP_URL = process.env.DFO_MCP_URL || "".concat(DFO_SERVER, "/mcp");
var DFO_API_URL = process.env.DFO_API_URL || "".concat(DFO_SERVER, "/api");
var AUTH_TOKEN = process.env.DFO_AUTH_TOKEN || 'default';
var PROJECT_NAME = process.env.PROJECT_NAME || 'claude-code-config';
var AGENT_ID = process.env.AGENT_ID || '11';
var TIMEOUT = process.env.DFO_TIMEOUT || '30000';
console.error("[SOLARIA-DFO v2.0] Starting MCP server...");
console.error("[SOLARIA-DFO v2.0] API URL: ".concat(DFO_API_URL));
console.error("[SOLARIA-DFO v2.0] MCP URL: ".concat(DFO_MCP_URL));
console.error("[SOLARIA-DFO v2.0] Project: ".concat(PROJECT_NAME));
console.error("[SOLARIA-DFO v2.0] Agent ID: ".concat(AGENT_ID));
// Create axios instance with retry logic
var axiosInstance = axios_1.default.create({
    baseURL: DFO_API_URL,
    timeout: parseInt(TIMEOUT),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(AUTH_TOKEN),
        'X-Project-Id': PROJECT_NAME,
        'X-Agent-Id': AGENT_ID,
        'User-Agent': 'SOLARIA-DFO-MCP/v2.0',
    },
    // Retry on network errors
    validateStatus: function (status) { return status >= 200 && status < 500; },
});
// DFO v2.0 Tools definitions
var tools = [
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
var server = new index_js_1.Server({
    name: 'solaria-dfo',
    version: '2.0.0',
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
server.setRequestHandler('tools/list', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, { tools: tools }];
    });
}); });
server.setRequestHandler('tools/call', function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, _b, args, response_1, err_1, response, result, responseText, error_1, errorMsg;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = request.params, name = _a.name, _b = _a.arguments, args = _b === void 0 ? {} : _b;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                console.error("[SOLARIA-DFO v2.0] Calling: ".concat(name), JSON.stringify(args).substring(0, 200));
                if (!(name === 'health_check')) return [3 /*break*/, 5];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axiosInstance.get('/health', { timeout: 5000 })];
            case 3:
                response_1 = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    status: 'connected',
                                    server: DFO_API_URL,
                                    response: response_1.data,
                                }, null, 2),
                            },
                        ],
                    }];
            case 4:
                err_1 = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    status: 'disconnected',
                                    server: DFO_API_URL,
                                    error: err_1.message,
                                    suggestion: 'Verifica que el servidor DFO esté activo o contacta soporte@solaria.agency',
                                }, null, 2),
                            },
                        ],
                        isError: false, // Not an error, just disconnected
                    }];
            case 5: return [4 /*yield*/, axiosInstance.post("/".concat(name), __assign(__assign({}, args), { jsonrpc: '2.0', id: Date.now(), method: name }))];
            case 6:
                response = _c.sent();
                result = response.data;
                // Handle different response formats
                if (result.success === false || result.error) {
                    console.error("[SOLARIA-DFO v2.0] API Error:", result.error || result.message);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Error from DFO: ".concat(result.error || result.message || 'Unknown error'),
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
                    responseText = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2);
                }
                else {
                    responseText = JSON.stringify(result, null, 2);
                }
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: responseText,
                            },
                        ],
                    }];
            case 7:
                error_1 = _c.sent();
                errorMsg = error_1.response
                    ? "HTTP ".concat(error_1.response.status, ": ").concat(JSON.stringify(error_1.response.data))
                    : error_1.code === 'ECONNREFUSED'
                        ? 'Conexión rechazada - Servidor DFO no disponible'
                        : error_1.code === 'ETIMEDOUT'
                            ? 'Timeout de conexión - Servidor no responde'
                            : error_1.code === 'ENOTFOUND'
                                ? 'DNS no resuelto - Verifica la URL del servidor'
                                : error_1.message;
                console.error("[SOLARIA-DFO v2.0] Error:", errorMsg);
                console.error("[SOLARIA-DFO v2.0] Full error:", error_1.message);
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: "DFO Connection Error: ".concat(errorMsg, "\n\n") +
                                    "Server: ".concat(DFO_API_URL, "\n") +
                                    "Project: ".concat(PROJECT_NAME, "\n") +
                                    "Agent ID: ".concat(AGENT_ID, "\n\n") +
                                    "Sugerencias:\n" +
                                    "- Verifica que dfo.solaria.agency est\u00E9 activo\n" +
                                    "- Revisa la configuraci\u00F3n de red/firewall\n" +
                                    "- Contacta soporte@solaria.agency si persiste",
                            },
                        ],
                        isError: true,
                    }];
            case 8: return [2 /*return*/];
        }
    });
}); });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var transport, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_js_1.StdioServerTransport();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, server.connect(transport)];
                case 2:
                    _a.sent();
                    console.error("[SOLARIA-DFO v2.0] \u2713 Server running and ready");
                    console.error("[SOLARIA-DFO v2.0] Available tools: ".concat(tools.length));
                    console.error("[SOLARIA-DFO v2.0] Tools: ".concat(tools.map(function (t) { return t.name; }).join(', ')));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('[SOLARIA-DFO v2.0] Fatal error:', error_2);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
