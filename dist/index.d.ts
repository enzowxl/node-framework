import { IncomingMessage } from "node:http";
type FrameworkResponse = {
    message: (value: string) => void;
    json: (value: unknown) => void;
};
type RouteHandler = (req: IncomingMessage, res: FrameworkResponse) => void | Promise<void>;
export declare class Framework {
    private routes;
    private server;
    constructor();
    private serverResponse;
    private handleRequest;
    private registerRoute;
    get(path: string, handler: RouteHandler): void;
    post(path: string, handler: RouteHandler): void;
    put(path: string, handler: RouteHandler): void;
    delete(path: string, handler: RouteHandler): void;
    listen(port: number, callback?: () => void): void;
}
export {};
