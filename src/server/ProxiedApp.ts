import { ILogger } from '@rocket.chat/apps-ts-definition/accessors';
import { App } from '@rocket.chat/apps-ts-definition/App';
import { AppStatus } from '@rocket.chat/apps-ts-definition/AppStatus';
import { IApp } from '@rocket.chat/apps-ts-definition/IApp';
import { AppMethod, IAppAuthorInfo, IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';

import { NotEnoughMethodArgumentsError } from './errors';
import { IAppStorageItem } from './storage';

import * as vm from 'vm';
import { AppManager } from './AppManager';
import { AppConsole } from './logging/index';

export class ProxiedApp implements IApp {
    private previousStatus: AppStatus;

    constructor(private readonly manager: AppManager,
                private storageItem: IAppStorageItem,
                private readonly app: App,
                private readonly customRequire: (mod: string) => {}) {
        this.previousStatus = storageItem.status;
    }

    public getStorageItem(): IAppStorageItem {
        return this.storageItem;
    }

    public setStorageItem(item: IAppStorageItem): void {
        this.storageItem = item;
    }

    public getPreviousStatus() {
        return this.previousStatus;
    }

    public hasMethod(method: AppMethod): boolean {
        console.log('Checking:', method);
        return typeof (this.app as any)[method] === 'function';
    }

    public makeContext(data: object): vm.Context {
        return vm.createContext(Object.assign({}, {
            require: this.customRequire,
            console: this.app.getLogger(),
        }, data));
    }

    public setupLogger(method: AppMethod): AppConsole {
        const logger = new AppConsole(method);
        // Set the logger to our new one
        (this.app as any).logger = logger;

        return logger;
    }

    public runInContext(codeToRun: string, context: vm.Context): any {
        return vm.runInContext(codeToRun, context, { timeout: 1000 });
    }

    public call(method: AppMethod, ...args: Array<any>): any {
        if (typeof (this.app as any)[method] !== 'function') {
            throw new Error(`The App ${this.app.getName()} (${this.app.getID()}`
                + ` does not have the method: "${method}"`);
        }

        // tslint:disable-next-line
        const methodDeclartion = (this.app as any)[method] as Function;
        if (args.length < methodDeclartion.length) {
            throw new NotEnoughMethodArgumentsError(method, methodDeclartion.length, args.length);
        }

        const logger = this.setupLogger(method);
        logger.debug(`${method} is being called...`);

        let result;
        try {
            result = this.runInContext(`app.${method}.apply(app, args)`, this.makeContext({ app: this.app, args }));
            logger.debug(`${method} was successfully called!`, result);
        } catch (e) {
            logger.error(e);
            logger.debug(`${method} was unsuccessful.`);
        }

        this.manager.getLogStorage().storeEntries(this.getID(), logger);

        return result;
    }

    public getStatus(): AppStatus {
        return this.app.getStatus();
    }

    public setStatus(status: AppStatus) {
        this.call(AppMethod.SETSTATUS, status);
        this.manager.getBridges().getAppActivationBridge().appStatusChanged(this, this.getStatus());
    }

    public getName(): string {
        return this.app.getName();
    }

    public getNameSlug(): string {
        return this.app.getNameSlug();
    }

    public getID(): string {
        return this.app.getID();
    }

    public getVersion(): string {
        return this.app.getVersion();
    }

    public getDescription(): string {
        return this.app.getDescription();
    }

    public getRequiredApiVersion(): string {
        return this.app.getRequiredApiVersion();
    }
    public getAuthorInfo(): IAppAuthorInfo {
        return this.app.getAuthorInfo();
    }

    public getInfo(): IAppInfo {
        return this.app.getInfo();
    }

    public getLogger(): ILogger {
        return this.app.getLogger();
    }
}