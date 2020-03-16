import { INet } from '../../definition/accessors/INet';
import { AppBridges } from '../bridges/AppBridges';

export class Net implements INet {
    constructor(private readonly bridges: AppBridges) { }
    public createConnection(options: object): NodeJS.Socket {
        return this.bridges.getNetBridge().createConnection(options);
    }
}
