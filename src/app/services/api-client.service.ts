import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EMPTY, Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { LoginRequest } from '../../model/shared-models/login-request.model';
import { TokenPayload } from '../../model/shared-models/token-payload.model';
import { ProjectListing } from '../../model/shared-models/chat-core/project-listing.model';
import { Project } from '../../model/shared-models/chat-core/project.model';
import { ObjectId } from 'mongodb';

// Extract the type of the `post` method from `HttpClient`
type HttpClientPostMethod = HttpClient['post'];

// Extract the type of the `options` parameter from the `post` method
type HttpClientPostOptions = Parameters<HttpClientPostMethod>[2];

// Extract the type of the `post` method from `HttpClient`
type HttpClientGetMethod = HttpClient['get'];

// Extract the type of the `options` parameter from the `post` method
type HttpClientGetOptions = Parameters<HttpClientGetMethod>[1];

type HttpCallOptions = HttpClientGetOptions | HttpClientPostOptions;

class HttpOptionsBuilder {
  constructor(
    readonly parent: ClientApiService,
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

class OptionsBuilderInternal {
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

@Injectable({
  providedIn: 'root',
})
export class ClientApiService {
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
  private constructUrl(path: string) {
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

  /** Makes a call to attempt to login the user with their credentials. */
  login(loginInfo: LoginRequest) {
    return this.http.post<string>(this.constructUrl('login'), loginInfo)
      .pipe(
        tap(response => {
          this.tokenService.token = response;
        })
      );
  }

  logout(): Observable<void> {
    this.tokenService.token = undefined;
    return EMPTY;
  }

  /**
   * Gets the list of project listings for the current user.
   */
  getProjectListings() {
    return this.http.get<ProjectListing[]>(this.constructUrl('project-listings'), this.optionsBuilder.withAuthorization());
  }

  /**
   * Creates a new project for the current user.
   */
  createProject(name: string) {
    return this.http.post<Project>(this.constructUrl('project'), { name }, this.optionsBuilder.withAuthorization());
  }

  /**
   * Updates the name of a project by its ID (must belong to the authenticated user).
   */
  updateProject(id: ObjectId, project: Project) {
    return this.http.put<{ success: boolean; }>(this.constructUrl(`project/${id}`), project, this.optionsBuilder.withAuthorization());
  }

  /**
   * Deletes a project by its ID (must belong to the authenticated user).
   */
  deleteProject(id: ObjectId) {
    return this.http.delete<{ success: boolean; }>(this.constructUrl(`project/${id}`), this.optionsBuilder.withAuthorization());
  }

  /**
   * Gets a project by its ID (must belong to the authenticated user).
   */
  getProjectById(id: ObjectId) {
    return this.http.get<Project>(this.constructUrl(`project/${id}`), this.optionsBuilder.withAuthorization());
  }
}
