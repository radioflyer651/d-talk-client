import { Injectable, model } from '@angular/core';
import { ILlmModelServiceBase } from '../../chat-core-services/model-services/llm-model-service-base';
import { OllamaModelService } from '../../chat-core-services/model-services/ollama.model-service';
import { OpenAiModelService } from '../../chat-core-services/model-services/open-ai.model-service';
import { ModelServiceParams } from '../../../model/shared-models/chat-core/model-service-params.model';

@Injectable({
  providedIn: 'root'
})
export class ChatModelConfigService {
  constructor() { }

  // TODO: Make this dynamic, using info from the server.
  readonly modelServiceProviders: ILlmModelServiceBase<any>[] = [
    new OllamaModelService(),
    new OpenAiModelService(),
  ];

  /** Returns the identifiers for the service types for LLM models that can be supported by the application. */
  get availableServiceTypes() {
    return this.modelServiceProviders.map(m => m.identifier);
  }

  /** Using the service identifier, returns the service with the specified service name. */
  getServiceForType(type: string): ILlmModelServiceBase<any> | undefined {
    return this.modelServiceProviders.find(s => s.identifier === type);
  }

  /** Returns new parameters that can be used with a specified LLM model type. */
  async getNewParams(modelType: string) {
    // Try to find a service to implement the type, and use it.
    const implementor = this.getServiceForType(modelType);

    if (!implementor) {
      throw new Error(`No llm services exist for the model type: ${modelType}`);
    }

    return implementor.createParams();
  }

  /** Returns a boolean value indicating whether or not a specified set of ModelServiceParams are valid. */
  async isParamsValid(params: ModelServiceParams): Promise<boolean> {
    // Try to find a service to implement the type, and use it.
    const implementor = this.getServiceForType(params.llmService);

    if (!implementor) {
      throw new Error(`No llm services exist for the model type: ${params.llmService}`);
    }

    return await implementor.validateParams(params);
  }
}
