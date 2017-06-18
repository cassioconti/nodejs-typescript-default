import jwt = require("jsonwebtoken");
import fs = require("fs");

export class JwtHandler {
    private readonly certPriv: Buffer;
    private readonly certPubl: Buffer;
    private readonly properties: any;

    constructor() {
        this.properties = JSON.parse(fs.readFileSync("app/resources/properties.json", "utf8"));
        // this.certPriv = fs.readFileSync("certificate/my_private_key.pem");  // get private key
        // this.certPubl = fs.readFileSync("certificate/my_public_key.pem");  // get public key
        this.certPriv = fs.readFileSync("certificate/log_priv.pem");  // get private key
        this.certPubl = fs.readFileSync("certificate/log_publ.pem");  // get public key
    }

    public createToken = (): string => {
        // sign with RSA SHA256
        const token = jwt.sign({
            aud: "https://www.googleapis.com/oauth2/v4/token",
            iss: this.properties.serviceAccountEmail,
            scope: "https://www.googleapis.com/auth/logging.read",
        },
            this.certPriv, { algorithm: "RS256", expiresIn: "1h" });
        // const token=jwt.sign({foo:"bar",exp:Math.floor(Date.now()/1000)-60},certPriv,{algorithm:"RS256"});
        console.log(token);
        return token;
    }

    public verifyToken = (token: string): boolean => {
        let isValid = true;

        // verify a token symmetric - synchronous
        let decoded;
        try {
            // verify fails if key doesn't match or token is expired
            decoded = jwt.verify(token, this.certPubl);
        } catch (err) {
            console.log(err);
            isValid = false;
            // decode dont verify, just decode the payload
            decoded = jwt.decode(token);
        }

        let date = new Date(0); // The 0 there is the key, which sets the date to the epoch
        date.setUTCSeconds(decoded.iat);
        console.log(date.toLocaleString());

        date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        console.log(date.toLocaleString());

        return isValid;
    }
}
