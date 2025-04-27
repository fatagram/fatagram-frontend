import apiUrl from '@/config';
import * as signalR from '@microsoft/signalr';

export const connection = new signalR.HubConnectionBuilder()
    .withUrl(apiUrl + "/hubs/notification", {
        withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();