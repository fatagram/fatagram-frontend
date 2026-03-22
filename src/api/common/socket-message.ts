export interface SocketMessage<T = any> {
  event: string;
  payload: T;
}
