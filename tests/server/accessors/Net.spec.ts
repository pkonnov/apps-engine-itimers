import { Expect, SetupFixture, SpyOn, Test } from 'alsatian';

import { Net } from '../../../src/server/accessors';
import { AppBridges, INetBridge } from '../../../src/server/bridges';

export class NetAccessorsTestFixture {
    private mockAppBridge: AppBridges;
    private mockINetBridge: INetBridge;
    private mockSocket: NodeJS.Socket;

    @SetupFixture
    public setupFixture() {
        const socket = this.mockSocket as NodeJS.Socket;
        this.mockINetBridge = {
            createConnection(options: {}): NodeJS.Socket {
                return socket;
            },
        };
        const netBridge = this.mockINetBridge;
        this.mockAppBridge = {
            getNetBridge(): INetBridge {
                return netBridge;
            },
        } as AppBridges;
    }

    @Test()
    public useNet() {
        Expect(() => new Net(this.mockAppBridge)).not.toThrow();

        const net = new Net(this.mockAppBridge);
        SpyOn(this.mockINetBridge, 'createConnection');
        SpyOn(net, 'createConnection');
    }
}
