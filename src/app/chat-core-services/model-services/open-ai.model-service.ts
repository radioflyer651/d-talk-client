import { OpenAiModelParams } from "../../../model/shared-models/chat-core/chat-model-params/open-ai/openai.model-params";
import { ILlmModelServiceBase } from "./llm-model-service-base";

export class OpenAiModelService implements ILlmModelServiceBase<OpenAiModelParams> {
    readonly identifier: OpenAiModelParams['llmService'] = 'open-ai';

    readonly name = 'OpenAI';

    async createParams(): Promise<OpenAiModelParams> {
        return {
            llmService: this.identifier,
            serviceParams: {
                model: 'gpt-4.1-nano'
            }
        };
    }

    async validateParams(params: OpenAiModelParams): Promise<boolean> {
        return params.llmService === this.identifier &&
            typeof params.llmService === 'string';
    }
}