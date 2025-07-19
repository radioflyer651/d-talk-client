import { AppConfig } from "../model/app-config.models";

export const environment: AppConfig = {
    production: true,
    apiBaseUrl: 'https://chat.richardolson.org/api/',
    chatSocketIoEndpoint: 'https://chat.richardolson.org',
    chatSocketPath: '/chat-io/'
};
