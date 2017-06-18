import request = require("request");
import fs = require("fs");

export class HttpHandler {
    private readonly properties: any;

    constructor() {
        this.properties = JSON.parse(fs.readFileSync("app/resources/properties.json", "utf8"));
    }

    public postTokenRequest = (token: string, callback: (body: string) => any): void => {
        // Configure the request
        const options = {
            form: {
                assertion: token,
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            },
            method: "POST",
            url: "https://www.googleapis.com/oauth2/v4/token",
        };

        // Start the request
        request(options, (error, response, body): void => {
            console.log("error:", error);
            console.log("statusCode:", response && response.statusCode);
            console.log("body:", body);
            callback(body);
        });
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

        // Start the request
        request(options, (error, response, body): void => {
            console.log("error:", error);
            console.log("statusCode:", response && response.statusCode);
            console.log("body:", body);
            callback(body);
        });
    }
}
