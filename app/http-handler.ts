import { Response } from "@types/express";

import request = require("request");
import fs = require("fs");

export class HttpHandler {
    private readonly properties: any;

    constructor() {
        this.properties = JSON.parse(fs.readFileSync("app/resources/properties.json", "utf8"));
    }

    public redirectAuthRequest = (response: Response): void => {
        // Start the request
        response.redirect("https://accounts.google.com/o/oauth2/v2/auth" +
            "?client_id=" + this.properties.clientId +
            "&redirect_uri=" + this.properties.baseUrl + "/callback" +
            "&response_type=code" +
            "&scope=https://www.googleapis.com/auth/logging.read" +
            "&state=state_parameter_passthrough_value");
    }

    public postTokenRequest = (code: string, callback: (body: string) => any): void => {
        // Configure the request
        const options = {
            form: {
                client_id: this.properties.clientId,
                client_secret: this.properties.clientSecret,
                code,
                grant_type: "authorization_code",
                redirect_uri: this.properties.baseUrl + "/callback",
            },
            method: "POST",
            url: "https://www.googleapis.com/oauth2/v4/token",
        };

        this.doRequest(options, callback);
    }

    public post = (query: string, token: string, callback: (body: string) => any): void => {
        // Set the headers
        const headers = {
            Authorization: "Bearer " + token,
        };

        // Configure the request
        const options = {
            headers,
            json: {
                filter: query,
                orderBy: "timestamp desc",
                pageSize: 1000,
                resourceNames: [this.properties.projectId],
            },
            method: "POST",
            url: "https://logging.googleapis.com/v2/entries:list",
        };

        this.doRequest(options, callback);
    }

    private doRequest = (options: any, callback: (body: string) => any): void => {
        // Start the request
        request(options, (error, response, body): void => {
            console.log("error:", error);
            console.log("statusCode:", response && response.statusCode);
            console.log("body:", body);
            callback(body);
        });
    }
}
