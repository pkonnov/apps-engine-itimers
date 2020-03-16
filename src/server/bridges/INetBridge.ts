export interface INetBridge {
    createConnection(options: object): NodeJS.Socket;
}
