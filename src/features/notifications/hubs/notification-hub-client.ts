import appConfig from "@/config";
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const createSignalRConnection = () => {
  try {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${appConfig.apiUrl}/hubs/notification`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    return connection;
  } catch (error) {
    console.error("Error creating SignalR connection: ", error);
    throw error;
  }
};
