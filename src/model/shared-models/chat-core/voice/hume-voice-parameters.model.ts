import { ReturnVoice, VoiceProvider } from "hume/api/resources/tts";
import { IVoiceParameters } from "./voice-parameters-base.model";
import { ModelServiceParams } from "../model-service-params.model";

export const HUME_VOICE_TYPE = 'hume';

export interface HumeVoiceParameters extends IVoiceParameters {
    parameterType: typeof HUME_VOICE_TYPE;
    voiceProvider: VoiceProvider;
    voice: ReturnVoice;
    /** The speed 1 to 10, for how fast the voice will talk. */
    speed?: number;
    /** When true, the AI will analyze the message to extract individual dialog utterances and
     *   generate a per-utterance description of how each is vocally delivered.
     *   This enables Hume's multi-utterance synthesis for more expressive voice output. */
    useDialogExtraction?: boolean;
    /** The LLM model to use for dialog extraction. Required when useDialogExtraction is true. */
    dialogExtractionModelParams?: ModelServiceParams;
    /** Optional extra instructions appended to the dialog extraction prompt.
     *   Use this to guide the LLM on tone, style, or character-specific delivery conventions. */
    dialogExtractionStaticInstructions?: string;
}

export function getDefaultHumeVoiceParameters(): HumeVoiceParameters {
    return {
        parameterType: HUME_VOICE_TYPE,
        voiceProvider: 'CUSTOM_VOICE',
        voice: {
            name: 'Ash2',
            id: '600e8e61-4a31-4624-929a-50cc4b77e6e6',
            provider: "CUSTOM_VOICE"
        }
    };
}