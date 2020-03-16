import { INetBridge } from '../../../src/server/bridges';

export class TestsNetBridge implements INetBridge {
    public createConnection(options: object): NodeJS.Socket {
        throw new Error('Method not implemented.');
    }
}
