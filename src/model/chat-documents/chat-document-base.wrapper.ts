import { Observable, Subject, Subscription, takeUntil, tap } from "rxjs";
import { IChatDocumentData } from "../shared-models/chat-core/documents/chat-document.model";

export type ChatDocumentWrapperEventType = 'property-changed';

export abstract class ChatDocumentWrapperBase<T extends IChatDocumentData> {
    constructor(
        /** The document that this wrapper wraps. */
        readonly document: T,
        public destroyer?: Observable<void>,
    ) {

        if (destroyer) {
            const subscription = destroyer.subscribe(() => {
                this.dispose();
            });

            this.destroyerSubscription = () => subscription.unsubscribe();
        } else {
            this.destroyerSubscription = () => undefined;
        }
    }

    private destroyerSubscription: () => void;

    protected _ngDestroy$ = new Subject<void>();
    ngDestroy$: Observable<void> = this._ngDestroy$.asObservable();

    private _isDisposed = false;

    /** Called when the wrapper is no longer needed to clean up any other observables. */
    protected abstract disposeBase(): void;

    dispose() {
        this.destroyerSubscription();
        if (this._isDisposed) {
            return;
        }
        this._ngDestroy$.next();
        this._isDisposed = true;
        this.disposeBase();
        this._propertyChanged$.complete();
    }

    /** Disables property change events.  Useful if an update is happening from network
     *   operations, and you don't want those change re-emitted back up to the sender of the update. */
    protected disableChangeEvents: boolean = false;

    protected onPropertyChanged(property: string, value: any) {
        if (!this.disableChangeEvents) {
            this._propertyChanged$.next({ property, value });
        }
    }

    private readonly _propertyChanged$ = new Subject<{ property: string, value: any; }>();
    readonly propertyChanged$ = this._propertyChanged$.asObservable().pipe(takeUntil(this.ngDestroy$));

    get _id() {
        return this.document._id;
    }
    set _id(value) {
        this.document._id = value;
        this.onPropertyChanged('_id', value);
    }

    get type() {
        return this.document.type;
    }
    set type(value) {
        this.document.type = value;
        this.onPropertyChanged('type', value);
    }

    get name() {
        return this.document.name;
    }
    set name(value) {
        this.document.name = value;
        this.onPropertyChanged('name', value);
    }

    get folderLocation() {
        return this.document.folderLocation;
    }
    set folderLocation(value) {
        this.document.folderLocation = value;
        this.onPropertyChanged('folderLocation', value);
    }

    get projectId() {
        return this.document.projectId;
    }
    set projectId(value) {
        this.document.projectId = value;
        this.onPropertyChanged('projectId', value);
    }

    get createdDate() {
        return this.document.createdDate;
    }
    set createdDate(value) {
        this.document.createdDate = value;
        this.onPropertyChanged('createdDate', value);
    }

    get updatedDate() {
        return this.document.updatedDate;
    }
    set updatedDate(value) {
        this.document.updatedDate = value;
        this.onPropertyChanged('updatedDate', value);
    }

    get lastChangedBy() {
        return this.document.lastChangedBy;
    }
    set lastChangedBy(value) {
        this.document.lastChangedBy = value;
        this.onPropertyChanged('lastChangedBy', value);
    }

    get description() {
        return this.document.description;
    }
    set description(value) {
        this.document.description = value;
        this.onPropertyChanged('description', value);
    }


}
