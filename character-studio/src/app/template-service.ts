import {ITemplateService, TChangeHandler} from "./template-service.spec";

export * from './template-service.spec';

export class TemplateService implements ITemplateService {
    protected changeHandlers: TChangeHandler[] = [];
    protected data?: string;

    public registerChangeListener(handler: TChangeHandler): void {
        this.changeHandlers.push(handler);
    }

    public setData(data?: string): void {
        this.data = data;
        this.updateHandlers();
    }

    protected updateHandlers() {
        for (const handler of this.changeHandlers) {
            handler(this.data);
        }
    }
}
