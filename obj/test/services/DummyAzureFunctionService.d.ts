import { IReferences } from 'pip-services3-commons-nodex';
import { AzureFunctionService } from '../../src/services/AzureFunctionService';
export declare class DummyAzureFunctionService extends AzureFunctionService {
    private _controller;
    constructor();
    protected getBodyData(context: any): any;
    setReferences(references: IReferences): void;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    protected register(): void;
}
