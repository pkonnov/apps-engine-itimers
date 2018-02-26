import { IAppActivationBridge } from './IAppActivationBridge';
import { IAppCommandBridge } from './IAppCommandBridge';
import { IAppDetailChangesBridge } from './IAppDetailChangesBridge';
import { IEnvironmentalVariableBridge } from './IEnvironmentalVariableBridge';
import { IHttpBridge } from './IHttpBridge';
import { IMessageBridge } from './IMessageBridge';
import { IPersistenceBridge } from './IPersistenceBridge';
import { IRoomBridge } from './IRoomBridge';
import { IServerSettingBridge } from './IServerSettingBridge';
import { IUserBridge } from './IUserBridge';

export abstract class AppBridges {
    public abstract getCommandBridge(): IAppCommandBridge;
    public abstract getAppDetailChangesBridge(): IAppDetailChangesBridge;
    public abstract getEnvironmentalVariableBridge(): IEnvironmentalVariableBridge;
    public abstract getHttpBridge(): IHttpBridge;
    public abstract getMessageBridge(): IMessageBridge;
    public abstract getPersistenceBridge(): IPersistenceBridge;
    public abstract getAppActivationBridge(): IAppActivationBridge;
    public abstract getRoomBridge(): IRoomBridge;
    public abstract getServerSettingBridge(): IServerSettingBridge;
    public abstract getUserBridge(): IUserBridge;
}