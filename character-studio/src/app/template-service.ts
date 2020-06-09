import {ITemplateService, TChangeHandler} from "./template-service.spec";

export * from './template-service.spec';

export class TemplateService implements ITemplateService {
    protected changeHandlers: TChangeHandler[] = [];
    protected data?: string;
    protected scaleFactor: number = 1;

    public registerChangeListener(handler: TChangeHandler): void {
        this.changeHandlers.push(handler);
    }

    public hasData(): boolean {
        return !!this.data;
    }

    public setData(data?: string): void {
        this.data = data;
        this.updateHandlers();
    }

    public setScaleFactor(factor: number = 1) {
        this.scaleFactor = factor;
        this.updateHandlers();
    }

    protected updateHandlers() {
        for (const handler of this.changeHandlers) {
            handler({
                data: this.data,
                scaleFactor: this.scaleFactor,
            });
        }
    }
}
