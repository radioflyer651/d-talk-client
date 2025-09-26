import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";
import { IVoiceParameters } from "../../../../../../model/shared-models/chat-core/voice/voice-parameters-base.model";
import { AiActingInstructionsConfiguration } from "../../../../../../model/shared-models/chat-core/voice/ai-acting-instructions-configuration.model";

export type ActingParameterTypes = 'none' | 'static' | 'ai-generated';

/** Given a specified IVoiceParameters object (or undefined), returns the type of ActingParameterTypes it uses. */
export function getAiActingParameterType(voiceParams?: IVoiceParameters): ActingParameterTypes {
    return !voiceParams
        ? 'none'
        : !!voiceParams.aiActingInstructions
            ? 'ai-generated'
            : !!voiceParams.staticActingInstructions
                ? 'static'
                : 'none';
}

/** Provides a helper model to work with the instruction generation types of an IVoiceParams. 
 *   In the consumer that works with IVoiceParameters, this class maintains a single set of Instruction Generation parameters,
 *   even though the IVoiceParameters instance is volatile and changes frequently.
 *   IMPORTANT: Only one instance of this class should probably be used per agent (i.e. don't re-use it through component re-use if you can).
*/
export class ActingParamsHelper {
    private readonly _instructionsType: BehaviorSubject<ActingParameterTypes>;
    readonly instructionsType$: Observable<ActingParameterTypes>;

    private readonly _voiceParams: BehaviorSubject<IVoiceParameters | undefined>;
    readonly voiceParams$: Observable<IVoiceParameters | undefined>;

    protected ngDestroy$ = new Subject<void>();

    constructor() {
        // Setup the subject/observables.
        this._voiceParams = new BehaviorSubject<IVoiceParameters | undefined>(undefined);
        this.voiceParams$ = this._voiceParams.asObservable();

        this._instructionsType = new BehaviorSubject<ActingParameterTypes>('none');
        this.instructionsType$ = this._instructionsType.asObservable();

        // When the voice params change, we need to move our values back to it.
        this.voiceParams$.pipe(
            takeUntil(this.ngDestroy$)
        ).subscribe(params => {
            // Copy our stored values to the new params.
            //  IMPORTANT: This MUST be called be for initialization in case it's the first time
            //  and this is the params we want to initialize from.
            this.setValuesOnParams();

            // Call initialize.  It will exit early if we're already initialized.
            this.initialize();

        });

        this.initialize();

        // Whenever we change our parameter types, we need to update
        //  the values on the voiceParams.
        this.instructionsType$.pipe(
            takeUntil(this.ngDestroy$)
        ).subscribe(() => {
            this.setValuesOnParams();
        });
    }

    private _isInitialized = false;
    private initialize() {
        // We might not be ready to rock and roll yet, or we might already be initialized.
        if (!this.voiceParams || this._isInitialized) {
            return;
        }

        // Get the type of voice params we're using.
        const instructionsType = getAiActingParameterType(this.voiceParams);

        // Update the editor values to work with.
        switch (instructionsType) {
            case 'ai-generated':
                this._aiGeneratedValue = this.voiceParams!.aiActingInstructions!;
                this._staticInstructionsValue = '';
                break;
            case 'static':
                this._aiGeneratedValue = this.getDefaultGeneratedValue();
                this._instructionList = this._aiGeneratedValue.modelInstructions.map((m, i) => new InstructionHelper(i, this._aiGeneratedValue.modelInstructions));
                this._staticInstructionsValue = this.voiceParams!.staticActingInstructions!;
                break;
            case 'none':
                this._aiGeneratedValue = this.getDefaultGeneratedValue();
                this._instructionList = this._aiGeneratedValue.modelInstructions.map((m, i) => new InstructionHelper(i, this._aiGeneratedValue.modelInstructions));
                this._staticInstructionsValue = '';
                break;
            default:
                throw new Error(`Unexpected instructionsType: ${instructionsType}`);
        }

        // Update the type of instructions for use in the UI and anywhere else.
        this._instructionsType.next(instructionsType);

        // From here, we're initialized.
        this._isInitialized = true;

        // Copy the values back to the voiceParams, so that it's setup properly.
        this.setValuesOnParams();

    }

    private getDefaultGeneratedValue(): AiActingInstructionsConfiguration {
        return {
            // We just have to cheat here - I hate it but we can't assume the model.
            modelParams: {
                llmService: 'open-ai',
                serviceParams: {
                    model: 'gpt-4.1-nano'
                },
            },
            modelInstructions: [],
            excludeFinalInstructionForActingResponse: false,
        };
    }

    private setValuesOnParams() {
        // Do nothing if we're not initialized.
        if (!this._isInitialized) {
            return;
        }

        // Update the values on the current params.
        if (this.voiceParams) {
            switch (this.instructionsType) {
                case 'ai-generated':
                    this.voiceParams.aiActingInstructions = this._aiGeneratedValue;
                    this._instructionList = this._aiGeneratedValue.modelInstructions.map((m, i) => new InstructionHelper(i, this._aiGeneratedValue.modelInstructions));
                    this.voiceParams.staticActingInstructions = '';
                    break;
                case 'static':
                    this.voiceParams.aiActingInstructions = undefined;
                    this.voiceParams.staticActingInstructions = this._staticInstructionsValue;
                    break;
                case 'none':
                    this.voiceParams.aiActingInstructions = undefined;
                    this.voiceParams.staticActingInstructions = undefined;
                    break;
                default:
                    throw new Error(`Unexpected instructionsType: ${this.instructionsType}`);
            }
        }
    }

    private _aiGeneratedValue!: AiActingInstructionsConfiguration;
    private _staticInstructionsValue = '';

    private _instructionList: InstructionHelper[] = [];
    get instructionList() {
        return this._instructionList;
    }

    get aiGeneratedValue(): AiActingInstructionsConfiguration {
        return this._aiGeneratedValue;
    }

    get staticInstructionsValue() {
        return this._staticInstructionsValue;
    }
    set staticInstructionsValue(newVal: string) {
        this._staticInstructionsValue = newVal;

        // We need to update the voiceParams with this, since it's just a primitive.
        if (this.instructionsType === 'static' && this.voiceParams) {
            this.voiceParams.staticActingInstructions = newVal;
        }
    }

    /** Gets or sets the voice parameters being worked with. */
    get voiceParams(): IVoiceParameters | undefined {
        return this._voiceParams.getValue();
    }

    set voiceParams(newVal: IVoiceParameters | undefined) {
        this._voiceParams.next(newVal);
    }

    /** Gets or sets the acting parameter type being worked with. */
    get instructionsType(): ActingParameterTypes {
        return this._instructionsType.getValue();
    }

    set instructionsType(newVal: ActingParameterTypes) {
        this._instructionsType.next(newVal);
    }

    deleteInstruction(index: number) {
        this.instructionList.splice(index, 1);
        this.aiGeneratedValue.modelInstructions.splice(index, 1);
        this.instructionList.forEach((item, i) => {
            item.index = i;
        });
    }

    addInstruction() {
        let newMsg = this.aiGeneratedValue.modelInstructions.length > 0
            ? ''
            : `
    # Instructions:
      - Keep your reply short - no more than 2 sentences.
      - State the emotion and tone of the voice.
      - If applicable to the situation, include any structural elements for the speech pattern.
      - **IMPORTANT** DO NOT include text from the conversation into these instructions.

    **Now, generate the "acting instructions" for the generation, based on the context of your conversation.**`;

        this.aiGeneratedValue.modelInstructions.push(newMsg);
        this.instructionList.push(new InstructionHelper(this.aiGeneratedValue.modelInstructions.length - 1, this.aiGeneratedValue.modelInstructions));
    }
}


export class InstructionHelper {
    constructor(
        public index: number,
        readonly instructionList: string[]
    ) { }

    get message(): string {
        return this.instructionList[this.index];
    }
    set message(newVal: string) {
        this.instructionList[this.index] = newVal;
    }
}