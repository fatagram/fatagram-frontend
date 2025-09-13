import apiUrl from '@/config';
import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export const createSignalRConnection = () => {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${apiUrl}/hubs/notification`, {
            withCredentials: true,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
    return connection;
}