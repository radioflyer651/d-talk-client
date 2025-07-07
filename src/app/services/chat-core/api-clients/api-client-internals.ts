import { HttpClient } from "@angular/common/http";
import { TokenService } from "../../token.service";
import { type ClientApiServiceBase } from "./api-client-base.service";

// Extract the type of the `post` method from `HttpClient`
export type HttpClientPostMethod = HttpClient['post'];

// Extract the type of the `options` parameter from the `post` method
export type HttpClientPostOptions = Parameters<HttpClientPostMethod>[2];

// Extract the type of the `post` method from `HttpClient`
export type HttpClientGetMethod = HttpClient['get'];

// Extract the type of the `options` parameter from the `post` method
export type HttpClientGetOptions = Parameters<HttpClientGetMethod>[1];

export type HttpCallOptions = HttpClientGetOptions | HttpClientPostOptions;

export class HttpOptionsBuilder {
    constructor(
        readonly parent: ClientApiServiceBase,
        readonly tokenService: TokenService,
    ) {
    }

    /** Shortcut to just return options with the authorization header. */
    withAuthorization(): HttpCallOptions {
        return this.buildOptions().addAuthToken().build();
    }

    buildOptions(): OptionsBuilderInternal {
        return new OptionsBuilderInternal(this);
    }
}

export class OptionsBuilderInternal {
    constructor(
        readonly parent: HttpOptionsBuilder
    ) { }

    protected _optionsBuilder: Exclude<HttpCallOptions, undefined | null> = {};

    /** Returns the TokenService from the parent. */
    get tokenService() {
        return this.parent.tokenService;
    }

    /** Returns the API service from the parent. */
    get parentApiService() {
        return this.parent.parent;
    }

    /** Returns the headers property from the options. */
    private getHeaders(): { [key: string]: string; } {
        if (!this._optionsBuilder.headers) {
            this._optionsBuilder.headers = {} as { [key: string]: string; };
        }

        return this._optionsBuilder.headers as { [key: string]: string; };
    }

    /** Adds a token to the headers. */
    addAuthToken() {
        if (this.tokenService.token) {
            this.getHeaders()['Authorization'] = this.tokenService.token;
        }
        return this;
    }

    build(): HttpCallOptions {
        return this._optionsBuilder;
    }
}