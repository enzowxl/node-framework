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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Framework = void 0;
const node_http_1 = require("node:http");
class Framework {
    constructor() {
        this.routes = [];
        this.server = (0, node_http_1.createServer)(this.handleRequest.bind(this));
    }
    serverResponse(response) {
        return {
            message: (body) => {
                response.end(body);
            },
            json: (body) => {
                response.end(JSON.stringify(body));
            },
            // ...response
        };
    }
    handleRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const frameWorkResponse = this.serverResponse(response);
            const { method, url } = request;
            const route = this.routes.find((currentRoute) => currentRoute.method === method && currentRoute.path === url);
            if (route) {
                yield route.handler(request, frameWorkResponse);
            }
            else {
                frameWorkResponse.json({ message: "Not found" });
            }
        });
    }
    registerRoute(method, path, handler) {
        this.routes.push({ method, path, handler });
    }
    get(path, handler) {
        this.registerRoute("GET", path, handler);
    }
    post(path, handler) {
        this.registerRoute("POST", path, handler);
    }
    put(path, handler) {
        this.registerRoute("PUT", path, handler);
    }
    delete(path, handler) {
        this.registerRoute("DELETE", path, handler);
    }
    listen(port, callback) {
        this.server.listen(port, callback);
    }
}
exports.Framework = Framework;
