import { Request, Response } from "@types/express";

import fs = require("fs");

import { HttpHandler } from "./http-handler";

export class EntryPoint {
    private readonly httpHandler: HttpHandler;

    constructor() {
        this.httpHandler = new HttpHandler();
    }

    public handleRequest = (request: Request, response: Response): void => {
        this.httpHandler.redirectAuthRequest(response);
    }

    public callback = (req: Request, res: Response): any => {
        const code = this.getCode(req);
        this.httpHandler.postTokenRequest(code, (body) => {
            const content = JSON.parse(body);
            this.loggingSearch(content.access_token, res);
        });
    }

    private getCode = (req: Request): string => {
        let code;
        let params = req.url.split("?");
        params = params[1].split("&");
        params.forEach((entry) => {
            if (entry.indexOf("code=") === 0) {
                const pair = entry.split("=");
                code = pair[1];
            }
        });

        console.log("code: " + code);
        return code;
    }

    private loggingSearch = (apiToken: string, response: Response) => {
        const query: string = fs.readFileSync("app/resources/query.txt", "utf8");
        this.httpHandler.post(query, apiToken, (responseBody: string) => {
            response.json(responseBody);
        });
    }
}
