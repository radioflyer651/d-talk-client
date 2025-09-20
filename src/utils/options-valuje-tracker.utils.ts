import { BehaviorSubject, distinctUntilChanged, Observable, Subject, switchMap } from "rxjs";


/** Provides a container to hold values of options selected during
 *   configurations.  Example. If a user selects a voice provider, makes changes, then selects
 *   another voice provider, makes some changes, and then goes back to the original.  The original
 *   values will be persisted, and not force the user to start over.
 */
export class OptionsValueTracker<T_OPTIONS_TYPE extends string> {
    constructor(
        /** Dictionary of factory methods to generate default values for options that did not previously exist. */
        readonly typeFactories: Record<T_OPTIONS_TYPE, () => any>,
        /** The current type that's selected at implementation. */
        currentType: T_OPTIONS_TYPE,
        /** The current value for the current type.  If not set, one is generated. */
        currentValue?: any,
    ) {
        // Setup the current value observables.
        this._currentValueSubject = new Subject<any>();
        this.currentValue$ = this._currentValueSubject.pipe(
            distinctUntilChanged()
        );

        // Set the option type subject for emitting the current value.
        this.optionTypeSubject = new BehaviorSubject<T_OPTIONS_TYPE>(currentType);

        // Subscribe to the optionTypeSubject, so we emit new current values
        //  when the subject changes.
        this.optionTypeSubject.pipe(
            distinctUntilChanged(),
        ).subscribe(option => {
            this._currentValueSubject.next(this.currentValue);
        });

        if (!currentValue) {
            // Set the current value.
            this.currentValue = currentValue;
        } else {
            // Set the default value.
            this.currentValue = this.generateValueForType(currentType);
        }
    }

    protected optionValues = {} as Record<T_OPTIONS_TYPE, any>;

    private readonly optionTypeSubject: BehaviorSubject<T_OPTIONS_TYPE>;
    /** Gets or sets the currently selected option type, which dictates the value. */
    get optionType(): T_OPTIONS_TYPE {
        return this.optionTypeSubject.value;
    }
    set optionType(value: T_OPTIONS_TYPE) {
        this.optionTypeSubject.next(value);
    }

    /** Emits the current value to observers. */
    protected _currentValueSubject: Subject<any>;

    /** Emits the current value to observers when it changes. */
    readonly currentValue$: Observable<any>;

    /** Gets or sets the current value for the current option type. */
    get currentValue(): any {
        return this.getValueForType(this.optionType);
    }
    set currentValue(value: any) {
        this.optionValues[this.optionType] = value;
        this._currentValueSubject.next(value);
    }

    /** Generates a default value for a specified option type. */
    protected generateValueForType(type: T_OPTIONS_TYPE) {
        // Find the factory.
        const factory = this.typeFactories[type];

        // Validate
        if (!factory) {
            throw new Error(`No factor exists for the type: ${type}`);
        }

        // Generate the value.
        const value = factory();

        // Return it.
        return value;
    }

    /** Returns a stored value, or a default value if none exists, for a specified type. */
    protected getValueForType(type: T_OPTIONS_TYPE) {
        // Try to get the stored value.
        let storedValue = this.optionValues[type] as any;

        // Generate the value if none exists.
        if (!storedValue) {
            storedValue = this.generateValueForType(type);

            // Store it.
            this.optionValues[type] = storedValue;

            // Note: The current value should be emitted already
            //  by the subscription to the option selection.  No need to emit it here.
        }

        // Return the value.
        return storedValue;
    }
}