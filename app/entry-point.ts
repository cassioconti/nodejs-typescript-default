import { Request, Response } from "@types/express";

import fs = require("fs");

import { HttpHandler } from "./http-handler";
import { JwtHandler } from "./jwt-handler";

export class EntryPoint {
    public handleRequest = (request: Request, response: Response): void => {
        const jwtHandler = new JwtHandler();
        const token = jwtHandler.createToken();
        const isValid = jwtHandler.verifyToken(token);
        const httpHandler = new HttpHandler();
        httpHandler.postTokenRequest(token, (body: string) => {
            console.log("Token: " + token +
                "\nIsValid: " + isValid +
                "\nResponse: " + body);
            const content = JSON.parse(body);
            this.loggingSearch(httpHandler, content.access_token, response);
        });
    }

    private loggingSearch = (httpHandler: HttpHandler, apiToken: string, response: Response) => {
        const query: string = fs.readFileSync("app/resources/query.txt", "utf8");
        httpHandler.post(query, apiToken, (responseBody: string) => {
            response.json(responseBody);
        });
    }
}
