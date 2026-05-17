/** A single dialog utterance extracted from an agent message, paired with an AI-generated
 *   description of how it should be vocally delivered. Used for Hume TTS multi-utterance synthesis. */
export interface HumeDialogUtterance {
    /** The spoken text of this utterance. */
    text: string;

    /** A 1–2 sentence description of how this utterance is delivered: emotion, tone, pacing, and vocal quality. */
    description: string;
}
