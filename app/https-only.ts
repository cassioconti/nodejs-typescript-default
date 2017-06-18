import { NextFunction, Request, RequestHandler, Response } from "@types/express";

export class HttpsOnly {
    public filter(req: Request, res: Response, next: NextFunction): void {
        console.log(req.hostname);
        console.log(req.url);
        console.log(req.get("X-Forwarded-Proto"));
        if (req.hostname !== "localhost" && req.get("X-Forwarded-Proto") === "http") {
            res.redirect(`https://${req.hostname}${req.url}`);
            return;
        }

        return next();
    }
}
