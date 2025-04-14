import {
  createServer,
  IncomingMessage,
  ServerResponse,
  Server,
} from "node:http";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

type FrameworkResponse =
  // ServerResponse &
  {
    message: (value: string) => void;
    json: (value: unknown) => void;
  };

type RouteHandler = (
  req: IncomingMessage,
  res: FrameworkResponse
) => void | Promise<void>;

interface Route {
  path: string;
  method: HTTPMethod;
  handler: RouteHandler;
}

export class Framework {
  private routes: Route[] = [];
  private server: Server;

  constructor() {
    this.server = createServer(this.handleRequest.bind(this));
  }

  private serverResponse(response: ServerResponse): FrameworkResponse {
    return {
      message: (body) => {
        response.end(body);
      },
      json: (body) => {
        response.end(JSON.stringify(body));
      },
      // ...response
    } as FrameworkResponse;
  }

  private async handleRequest(
    request: IncomingMessage,
    response: ServerResponse
  ): Promise<void> {
    const frameWorkResponse = this.serverResponse(response);

    const { method, url } = request;

    const route = this.routes.find(
      (currentRoute) =>
        currentRoute.method === method && currentRoute.path === url
    );

    if (route) {
      await route.handler(request, frameWorkResponse);
    } else {
      frameWorkResponse.json({ message: "Not found" });
    }
  }

  private registerRoute(
    method: HTTPMethod,
    path: string,
    handler: RouteHandler
  ) {
    this.routes.push({ method, path, handler });
  }

  public get(path: string, handler: RouteHandler): void {
    this.registerRoute("GET", path, handler);
  }

  public post(path: string, handler: RouteHandler): void {
    this.registerRoute("POST", path, handler);
  }

  public put(path: string, handler: RouteHandler): void {
    this.registerRoute("PUT", path, handler);
  }

  public delete(path: string, handler: RouteHandler): void {
    this.registerRoute("DELETE", path, handler);
  }

  public listen(port: number, callback?: () => void): void {
    this.server.listen(port, callback);
  }
}
