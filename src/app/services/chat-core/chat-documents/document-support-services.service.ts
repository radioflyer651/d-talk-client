import { inject, Injectable, InjectionToken } from "@angular/core";
import { IDocumentSupportService } from "./document-support-service.interface";
import { TextDocumentService } from "./text-document.service";


export const DOC_SUPPORT_SERVICES = new InjectionToken<any>('document-services');

export function getInjectionSupportServices() {
    const result: IDocumentSupportService[] = [
        inject(TextDocumentService)
    ];

    return result;
}

export const DocumentSupportServicesProvider = {
    provide: DOC_SUPPORT_SERVICES,
    useFactory: getInjectionSupportServices
};

