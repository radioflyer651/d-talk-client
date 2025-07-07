import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { TokenPayload } from "../../../../model/shared-models/token-payload.model";
import { TokenService } from "../../token.service";
import { HttpOptionsBuilder } from "./api-client-internals";


export class ClientApiServiceBase {
    constructor(
        protected readonly http: HttpClient,
        protected readonly tokenService: TokenService,
    ) {
        this.optionsBuilder = new HttpOptionsBuilder(this, this.tokenService);
    }

    protected readonly optionsBuilder: HttpOptionsBuilder;

    /** The base URL to the API. */
    protected readonly baseUrl = environment.apiBaseUrl;

    /** Combines a specified path with the base URL. */
    protected constructUrl(path: string) {
        return this.baseUrl + path;
    }

    /** Attempts to parse a token, and return the TokenPayload. */
    parseToken(token: string): TokenPayload {
        if (!token) {
            throw new Error(`token was empty.`);
        }

        // Decode the Base64 token.
        return JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    }

}