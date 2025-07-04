import { ModelServiceParams } from "../../../model/shared-models/chat-core/model-service-params.model";


export interface ILlmModelServiceBase<P extends ModelServiceParams> {
    /** Returns the key used to identify the specific type of model service. */
    readonly identifier: string;

    /** The name that the user sees for this model type. */
    readonly name: string;

    /** Returns new parameters that would be valid for the model service that consumes them. */
    createParams(): Promise<P>;

    /** Accepts parameters of the type that this LLM service requires, and returns a boolean
     *   value indicating whether or not they are valid. */
    validateParams(params: P): Promise<boolean>;
}