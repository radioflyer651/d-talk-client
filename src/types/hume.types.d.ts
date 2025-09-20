
declare module 'hume/api/resources/tts' {
    /**
 * An Octave voice available for text-to-speech
 */
    export interface ReturnVoice {
        /** ID of the voice in the `Voice Library`. */
        id?: string;
        /** Name of the voice in the `Voice Library`. */
        name?: string;
        /**
         * The provider associated with the created voice.
         *
         * Voices created through this endpoint will always have the provider set to `CUSTOM_VOICE`, indicating a custom voice stored in your account.
         */
        provider?: VoiceProvider;
    }

    export type VoiceProvider = "HUME_AI" | "CUSTOM_VOICE";

    export const VoiceProvider: {
        readonly HumeAi: "HUME_AI";
        readonly CustomVoice: "CUSTOM_VOICE";
    };

}