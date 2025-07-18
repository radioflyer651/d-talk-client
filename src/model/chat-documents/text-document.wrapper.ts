import { filter, Observable, takeUntil, debounceTime } from "rxjs";
import { TextDocumentData } from "../shared-models/chat-core/documents/document-types/text-document.model";
import { ChatDocumentWrapperBase } from "./chat-document-base.wrapper";
import { type SocketService } from "../../app/services/socket.service";
import { ENTER_TEXT_DOCUMENT_ROOM, EnterTextDocumentRoomMessage, EXIT_TEXT_DOCUMENT_ROOM, ExitTextDocumentRoomMessage, TEXT_DOCUMENT_CONTENT_CHANGE, TextDocumentContentChangeMessage } from "../shared-models/chat-core/socket-messaging/text-document-messaging.socket-model";


export class TextDocumentWrapper extends ChatDocumentWrapperBase<TextDocumentData> {
    constructor(
        document: TextDocumentData,
        readonly socketService: SocketService,
        destroyer?: Observable<void>,
    ) {
        super(document, destroyer);
        this.initialize();
    }

    private initialize() {
        const enterTextDocumentRoom = () => {
            this.socketService.sendMessage(ENTER_TEXT_DOCUMENT_ROOM, <EnterTextDocumentRoomMessage>{ documentId: this.document._id });
        };
        // Enter the text document room.
        enterTextDocumentRoom();

        // If we lose connection and reconnect, we need to enter the text document room again.
        this.socketService.subscribeToReconnect().pipe(
            takeUntil(this.ngDestroy$)
        ).subscribe(() => {
            enterTextDocumentRoom();
        });

        this.socketService.subscribeToSocketEvent(TEXT_DOCUMENT_CONTENT_CHANGE).pipe(
            takeUntil(this.ngDestroy$),
            filter(ev => {
                const args = ev.args[0] as TextDocumentContentChangeMessage;
                console.log(ev);
                return args.documentId === this.document._id;
            })
        ).subscribe(ev => {
            console.log(`Got updated message: ${ev.args[0]}`);
            try {
                this.disableChangeEvents = true;
                const args = ev.args[0] as TextDocumentContentChangeMessage;
                this.document.content = args.newContent;
            } finally {
                this.disableChangeEvents = false;
            }
        });

        this.propertyChanged$
            .pipe(
                filter(v => v.property === 'content'),
                debounceTime(500)
            )
            .subscribe(v => {
                this.socketService.sendMessage(TEXT_DOCUMENT_CONTENT_CHANGE, <TextDocumentContentChangeMessage>{
                    documentId: this.document._id,
                    newContent: this.content
                });
            });
    }

    protected disposeBase() {
        this.socketService.sendMessage(EXIT_TEXT_DOCUMENT_ROOM, <ExitTextDocumentRoomMessage>{ documentId: this.document._id });
    }

    get content() { return this.document.content; }
    set content(value) {
        this.document.content = value;
        this.onPropertyChanged('content', value);
    }

    get comments() { return this.document.comments; }
    set comments(value) {
        this.document.comments = value;
        this.onPropertyChanged('comments', value);
    }


}