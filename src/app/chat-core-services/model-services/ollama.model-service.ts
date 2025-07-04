import { OllamaModelParams, OllamaModelServiceParams } from "../../../model/shared-models/chat-core/chat-model-params/ollama.model-params";
import { ILlmModelServiceBase } from "./llm-model-service-base";

export class OllamaModelService implements ILlmModelServiceBase<OllamaModelParams> {
    readonly identifier: OllamaModelParams['llmService'] = 'ollama';

    readonly name = 'Ollama';

    async createParams(): Promise<OllamaModelParams> {
        return {
            llmService: this.identifier,
            serviceParams: {
                model: '' // There's no way we can tell what's installed on the local machine, so we can't provide a valid value here.
            }
        };
    }

    async validateParams(params: OllamaModelParams): Promise<boolean> {
        return params.llmService === this.identifier &&
            typeof params.llmService === 'string';
    }
}