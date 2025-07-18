import { OllamaModelParams, OllamaModelServiceParams } from "../../../model/shared-models/chat-core/chat-model-params/ollama.model-params";
import { ILlmModelServiceBase } from "./llm-model-service-base";

export class OllamaModelService implements ILlmModelServiceBase<OllamaModelParams> {
    readonly identifier: OllamaModelParams['llmService'] = 'ollama';

    readonly name = 'Ollama';

    async createParams(): Promise<OllamaModelParams> {
        return {
            llmService: this.identifier,
            serviceParams: {
                modelId: '', // There's no way to know what this is to start.
            }
        };
    }

    async validateParams(params: OllamaModelParams): Promise<boolean> {
        return params.llmService === this.identifier &&
            typeof params.llmService === 'string';
    }
}