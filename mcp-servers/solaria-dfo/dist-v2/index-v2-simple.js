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
var DFO_SERVER = process.env.DFO_SERVER || 'https://dfo.solaria.agency';
var DFO_API_URL = process.env.DFO_API_URL || DFO_SERVER + '/api';
var AUTH_TOKEN = process.env.DFO_AUTH_TOKEN || 'default';
var PROJECT_NAME = process.env.PROJECT_NAME || 'claude-code-config';
var AGENT_ID = process.env.AGENT_ID || '11';
console.error('[SOLARIA-DFO v2.0] Starting MCP server...');
console.error('[SOLARIA-DFO v2.0] API URL:', DFO_API_URL);
console.error('[SOLARIA-DFO v2.0] Project:', PROJECT_NAME);
var axiosInstance = axios_1.default.create({
    baseURL: DFO_API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer ".concat(AUTH_TOKEN),
        'X-Project-Id': PROJECT_NAME,
        'X-Agent-Id': AGENT_ID,
    },
});
var tools = [
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
    { name: 'health_check', description: 'Verificar conexion DFO' },
];
// @ts-ignore - MCP SDK type incompatibility workaround
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
    var name, args, response_1, err_1, response, result, responseText, error_1, errorMsg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = request.params.name;
                args = request.params.arguments || {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                console.error('[SOLARIA-DFO v2.0] Calling:', name, JSON.stringify(args).substring(0, 100));
                if (!(name === 'health_check')) return [3 /*break*/, 5];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axiosInstance.get('/health', { timeout: 5000 })];
            case 3:
                response_1 = _a.sent();
                return [2 /*return*/, {
                        content: [{ type: 'text', text: JSON.stringify({ status: 'connected', server: DFO_API_URL, response: response_1.data }, null, 2) }],
                    }];
            case 4:
                err_1 = _a.sent();
                return [2 /*return*/, {
                        content: [{ type: 'text', text: JSON.stringify({ status: 'disconnected', server: DFO_API_URL, error: err_1.message }, null, 2) }],
                    }];
            case 5: return [4 /*yield*/, axiosInstance.post('/' + name, __assign(__assign({}, args), { jsonrpc: '2.0', id: Date.now(), method: name }))];
            case 6:
                response = _a.sent();
                result = response.data;
                if (result.success === false || result.error) {
                    return [2 /*return*/, {
                            content: [{ type: 'text', text: 'Error DFO: ' + (result.error || result.message || 'Unknown') }],
                            isError: true,
                        }];
                }
                responseText = result.formatted ? result.formatted : result.data ? JSON.stringify(result.data, null, 2) : 'Success';
                return [2 /*return*/, {
                        content: [{ type: 'text', text: responseText }],
                    }];
            case 7:
                error_1 = _a.sent();
                errorMsg = error_1.response ? 'HTTP ' + error_1.response.status : error_1.code === 'ECONNREFUSED' ? 'Conexion rechazada' : error_1.code === 'ETIMEDOUT' ? 'Timeout' : error_1.message;
                console.error('[SOLARIA-DFO v2.0] Error:', errorMsg);
                return [2 /*return*/, {
                        content: [{ type: 'text', text: 'DFO Error: ' + errorMsg + '\nServidor: ' + DFO_API_URL }],
                        isError: true,
                    }];
            case 8: return [2 /*return*/];
        }
    });
}); });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    console.error('[SOLARIA-DFO v2.0] Server running');
                    console.error('[SOLARIA-DFO v2.0] Tools:', tools.map(function (t) { return t.name; }).join(', '));
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.error('[SOLARIA-DFO v2.0] Fatal:', err);
    process.exit(1);
});
